"use client"

import gsap from "gsap"
import { useLayoutEffect, type RefObject } from "react"
import { FPS_REVEAL as motion } from "./realisations.content"

type Reveal = { animations: Animation[]; started: boolean; complete: boolean }

/** Each block starts in view; the complete monitor keeps one shared WAAPI clock. */
export function useFpsReveal(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const project = sectionRef.current?.querySelector<HTMLElement>('[data-project="studio"]')
    const card = project?.querySelector<HTMLElement>("[data-project-copy]")
    const visual = project?.querySelector<HTMLElement>("[data-monitor-visual]")
    const unit = project?.querySelector<HTMLElement>("[data-resin-stage]")
    const device = project?.querySelector<HTMLElement>("[data-resin-device]")
    const reflection = project?.querySelector<HTMLElement>("[data-resin-reflection]")
    const parallax = project?.querySelector<HTMLElement>("[data-device-parallax]")
    if (!project || !card || !visual || !unit || !device || !reflection || !parallax) return
    if (typeof device.animate !== "function" || typeof IntersectionObserver === "undefined") return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mobile = window.matchMedia("(max-width: 699px)")
    // Retain the existing desktop exit parallax on its separate parent only.
    const originalTransform = parallax.style.transform
    const factor = Number(parallax.dataset.deviceParallax)
    const setParallax = gsap.quickSetter(parallax, "y", "px")
    const cardReveal: Reveal = { animations: [], started: false, complete: reduced.matches }
    const monitorReveal: Reveal = { animations: [], started: false, complete: reduced.matches }
    const reveals = [cardReveal, monitorReveal]
    let alive = true
    let exitOrigin = 0
    let scrollFrame = 0
    let cardObserver: IntersectionObserver | null = null
    let monitorObserver: IntersectionObserver | null = null

    function cancelAnimations(reveal: Reveal) {
      reveal.animations.forEach(animation => { animation.onfinish = null; animation.cancel() })
      reveal.animations = []
    }

    function finishCard() {
      if (!alive || cardReveal.complete) return
      cardReveal.complete = true
      cancelAnimations(cardReveal)
    }

    function finishMonitor() {
      if (!alive || monitorReveal.complete) return
      monitorReveal.complete = true
      exitOrigin = Math.min(0, project!.getBoundingClientRect().top)
      // Release the fill effects to the unchanged CSS layout: transform: none.
      cancelAnimations(monitorReveal)
      scheduleParallax()
    }

    function animate(reveal: Reveal, element: HTMLElement, keyframes: Keyframe[], timing: KeyframeAnimationOptions) {
      const animation = element.animate(keyframes, { ...timing, fill: "both" })
      animation.pause()
      animation.currentTime = 0
      reveal.animations.push(animation)
      return animation
    }

    function buildMonitor() {
      cancelAnimations(monitorReveal)
      if (mobile.matches) {
        const reveal = animate(monitorReveal, device!, [
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ], motion.mobileReveal)
        reveal.onfinish = finishMonitor
        return
      }

      animate(monitorReveal, device!, [{ opacity: 0 }, { opacity: 1 }], motion.appear)
      animate(monitorReveal, device!, [
        { transform: "perspective(1800px) rotateX(38deg) scale(1.22)" },
        { transform: "perspective(1800px) rotateX(0deg) scale(1)" },
      ], motion.reveal)
      animate(monitorReveal, reflection!, [
        { opacity: 0, transform: "translateX(-140%) skewX(-10deg)" },
        { offset: 0.45, opacity: 1 },
        { opacity: 0, transform: "translateX(330%) skewX(-10deg)" },
      ], motion.reflection)
      const breath = animate(monitorReveal, unit!, [
        { transform: "scale(1.045)" },
        { transform: "scale(1)" },
      ], motion.breath)
      breath.onfinish = finishMonitor
    }

    function build() {
      cancelAnimations(cardReveal)
      const header = animate(cardReveal, card!, [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0px)" },
      ], motion.card)
      header.onfinish = finishCard
      buildMonitor()
    }

    function start(reveal: Reveal) {
      if (!alive || reveal.started || reveal.complete || reduced.matches) return
      reveal.started = true
      const time = typeof document.timeline.currentTime === "number"
        ? document.timeline.currentTime
        : performance.now()
      reveal.animations.forEach(animation => {
        animation.play()
        animation.startTime = time
      })
    }

    function rearm() {
      if (reduced.matches || reveals.every(reveal => !reveal.started && !reveal.complete)) return
      reveals.forEach(reveal => { reveal.started = reveal.complete = false })
      exitOrigin = 0
      setParallax(0)
      build()
    }

    function updateParallax() {
      scrollFrame = 0
      if (!alive) return
      const bounds = project!.getBoundingClientRect()
      // Catch jumps from above to below the viewport, including zero-to-zero
      // intersections that would not cross the observer's reveal threshold.
      if (bounds.top >= window.innerHeight && !reduced.matches) { rearm(); return }
      if (bounds.bottom <= 0) { finishCard(); finishMonitor() }
      if (reduced.matches || mobile.matches) { setParallax(0); return }
      if (!monitorReveal.complete) return
      const distance = Math.min(bounds.height, Math.max(0, exitOrigin - Math.min(0, bounds.top)))
      setParallax(-distance * factor)
    }

    function scheduleParallax() {
      if (alive && !scrollFrame) scrollFrame = requestAnimationFrame(updateParallax)
    }

    function onPreferenceChange() {
      if (reduced.matches) { finishCard(); finishMonitor() }
      scheduleParallax()
    }

    function observeCard() {
      cardObserver?.disconnect()
      // The project's top is the card's stable layout position, without its
      // animated 24 px translation. Do not wait for a fraction of the whole case study.
      const bottomInset = window.innerHeight * (1 - motion.cardTrigger)
      cardObserver = new IntersectionObserver(entries => {
        if (!alive || reduced.matches) return
        const entry = entries[entries.length - 1]
        if (entry.boundingClientRect.top >= window.innerHeight) rearm()
        else if (entry.boundingClientRect.bottom <= 0) finishCard()
        else if (entry.isIntersecting) start(cardReveal)
      }, { rootMargin: `0px 0px -${bottomInset}px 0px`, threshold: 0 })
      cardObserver.observe(project!)
    }

    function onResize() {
      observeCard()
      observeMonitor()
      scheduleParallax()
    }

    function onBreakpointChange() {
      if (!reduced.matches && !monitorReveal.complete) {
        // Keep an already visible illustration visible when rotating the device.
        if (monitorReveal.started) finishMonitor()
        else buildMonitor()
      }
      observeMonitor()
      scheduleParallax()
    }

    function observeMonitor() {
      monitorObserver?.disconnect()
      // Mobile observes the illustration's layout wrapper, not its animated child
      // or the text above it. Start as its first 15% enters the lower viewport.
      let target = visual!
      let threshold: number = motion.mobileMonitorVisibility
      let rootMargin = `0px 0px -${window.innerHeight * (1 - motion.mobileMonitorTrigger)}px 0px`
      if (!mobile.matches) {
        // Preserve the desktop trigger independently of the card's translation.
        const anchorTop = card!.offsetTop + visual!.getBoundingClientRect().top - card!.getBoundingClientRect().top
        const revealPoint = anchorTop + visual!.offsetHeight * motion.monitorVisibility
        const projectHeight = Math.max(1, project!.offsetHeight)
        target = project!
        threshold = Math.min(1, Math.max(0, revealPoint / projectHeight))
        rootMargin = `${projectHeight}px 0px 0px 0px`
      }
      monitorObserver = new IntersectionObserver(entries => {
        if (!alive || reduced.matches) return
        const entry = entries[entries.length - 1]
        if (project!.getBoundingClientRect().top >= window.innerHeight) rearm()
        else if (entry.boundingClientRect.bottom <= 0) finishMonitor()
        else if (entry.isIntersecting && entry.intersectionRatio >= threshold) start(monitorReveal)
      }, { threshold, rootMargin })
      monitorObserver.observe(target)
    }

    if (!reduced.matches) build()
    observeCard()
    observeMonitor()
    const geometryObserver = new ResizeObserver(observeMonitor)
    geometryObserver.observe(project)
    geometryObserver.observe(card)
    geometryObserver.observe(visual)
    window.addEventListener("scroll", scheduleParallax, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    window.addEventListener("pageshow", onResize)
    project.addEventListener("focusin", finishCard)
    reduced.addEventListener("change", onPreferenceChange)
    mobile.addEventListener("change", onBreakpointChange)

    return () => {
      alive = false
      cardObserver?.disconnect()
      monitorObserver?.disconnect()
      geometryObserver.disconnect()
      cancelAnimationFrame(scrollFrame)
      reveals.forEach(cancelAnimations)
      parallax.style.transform = originalTransform
      window.removeEventListener("scroll", scheduleParallax)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pageshow", onResize)
      project.removeEventListener("focusin", finishCard)
      reduced.removeEventListener("change", onPreferenceChange)
      mobile.removeEventListener("change", onBreakpointChange)
    }
  }, [sectionRef])
}
