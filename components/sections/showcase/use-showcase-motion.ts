"use client"

import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { useLayoutEffect, type RefObject } from "react"
import { SHOWCASE_MOTION } from "./realisations.content"

gsap.registerPlugin(CustomEase)

type DeviceMotion = { set: ReturnType<typeof gsap.quickSetter>; factor: number }
type Reveal = {
  project: HTMLElement
  anchor: HTMLElement
  exitAnchor: HTMLElement
  timeline: gsap.core.Timeline
  fraction: number
  started: boolean
  completed: boolean
  exitOrigin: number
  devices: DeviceMotion[]
  refresh?: () => void
  shouldStart?: () => boolean
}

export function useShowcaseMotion(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const fade = CustomEase.create("showcase-fade", ".25,.1,.25,1")
    const arrive = CustomEase.create("showcase-arrive", ".16,1,.3,1")
    const config = SHOWCASE_MOTION
    const media = gsap.matchMedia()

    media.add({
      desktop: "(min-width: 700px)",
      mobile: "(max-width: 699px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (context.conditions?.reduced) return
      const mobile = Boolean(context.conditions?.mobile)
      let alive = true
      let scrollFrame = 0
      let resizeFrame = 0
      const reveals: Reveal[] = []
      // Keep Miau's glass-card reveal; FPS owns one shared WAAPI sequence.
      const projects = Array.from(section.querySelectorAll<HTMLElement>('[data-project="miau"]'))

      function track(project: HTMLElement, anchor: HTMLElement, timeline: gsap.core.Timeline, fraction = 0, devices: DeviceMotion[] = [], exitAnchor = anchor) {
        const reveal: Reveal = { project, anchor, exitAnchor, timeline, fraction, devices, started: false, completed: false, exitOrigin: 0 }
        reveals.push(reveal)
        timeline.eventCallback("onComplete", () => {
          reveal.completed = true
          reveal.exitOrigin = Math.min(0, exitAnchor.getBoundingClientRect().top)
          scheduleScroll()
        })
        return reveal
      }

      projects.forEach(project => {
        const copy = project.querySelector<HTMLElement>("[data-project-copy]")!
        track(project, copy, gsap.timeline({ paused: true }).fromTo(copy,
          { opacity: 0 }, { opacity: 1, duration: 0.6, ease: fade }))
        if (mobile) {
          const visual = project.querySelector<HTMLElement>("[data-miau-carousel]")!
          const timeline = gsap.timeline({ paused: true }).fromTo(visual,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: arrive })
          track(project, visual, timeline, 0.12)
        }
      })

      function checkScroll() {
        scrollFrame = 0
        if (!alive) return
        const viewport = window.innerHeight
        reveals.forEach(reveal => {
          if (reveal.project.getBoundingClientRect().top > viewport + 1) {
            if (reveal.started) {
              reveal.started = reveal.completed = false
              reveal.exitOrigin = 0
              reveal.timeline.pause(0, true)
              reveal.devices.forEach(({ set }) => set(0))
              reveal.refresh?.()
            }
            return
          }
          if (!reveal.started) reveal.refresh?.()
          const bounds = reveal.anchor.getBoundingClientRect()
          const threshold = reveal.fraction ? config.trigger : config.copyTrigger
          const revealPoint = bounds.top + Math.min(bounds.height, viewport) * reveal.fraction
          const shouldStart = reveal.shouldStart?.() ?? (revealPoint <= viewport * threshold)
          if (!reveal.started && shouldStart) {
            reveal.started = true
            if (bounds.bottom <= 0) {
              reveal.timeline.progress(1, true).pause()
              reveal.refresh?.()
              reveal.completed = true
              reveal.exitOrigin = Math.min(0, reveal.exitAnchor.getBoundingClientRect().top)
            } else reveal.timeline.play(0)
          }
          if (reveal.completed && reveal.devices.length) {
            const exitBounds = reveal.exitAnchor.getBoundingClientRect()
            const distance = Math.min(exitBounds.height, Math.max(0, reveal.exitOrigin - Math.min(0, exitBounds.top)))
            reveal.devices.forEach(({ set, factor }) => set(-distance * factor))
          }
        })
      }
      function scheduleScroll() {
        if (alive && !scrollFrame) scrollFrame = requestAnimationFrame(checkScroll)
      }
      const measure = () => {
        resizeFrame = 0
        if (!alive) return
        reveals.forEach(({ timeline, refresh }) => {
          const time = timeline.time()
          timeline.invalidate().totalTime(time, true)
          refresh?.()
        })
        scheduleScroll()
      }
      const scheduleMeasure = () => {
        if (!resizeFrame) resizeFrame = requestAnimationFrame(measure)
      }
      const resize = new ResizeObserver(scheduleMeasure)
      projects.forEach(project => resize.observe(project))
      const focus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return
        const project = event.target.closest("[data-project]")
        reveals.filter(reveal => reveal.project === project).forEach(reveal => {
          reveal.timeline.progress(1, true).pause()
          reveal.refresh?.()
          reveal.started = reveal.completed = true
          reveal.exitOrigin = Math.min(0, reveal.exitAnchor.getBoundingClientRect().top)
          reveal.devices.forEach(({ set }) => set(0))
        })
      }
      section.addEventListener("focusin", focus)
      window.addEventListener("scroll", scheduleScroll, { passive: true })
      window.addEventListener("resize", scheduleMeasure, { passive: true })
      window.addEventListener("pageshow", scheduleMeasure)
      void document.fonts.ready.then(() => { if (alive) scheduleMeasure() })
      scheduleScroll()

      return () => {
        alive = false
        cancelAnimationFrame(scrollFrame)
        cancelAnimationFrame(resizeFrame)
        resize.disconnect()
        section.removeEventListener("focusin", focus)
        window.removeEventListener("scroll", scheduleScroll)
        window.removeEventListener("resize", scheduleMeasure)
        window.removeEventListener("pageshow", scheduleMeasure)
      }
    }, section)

    return () => media.revert()
  }, [sectionRef])
}
