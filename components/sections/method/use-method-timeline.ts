"use client"

import { useLayoutEffect, useRef } from "react"
import { createMethodMotion, type MethodKind } from "@/components/method-icons/motion"

export function useMethodTimeline() {
  const timelineRef = useRef<HTMLOListElement>(null)

  useLayoutEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    const steps = Array.from(timeline.querySelectorAll<HTMLElement>("[data-method-step]"))
    const markers = Array.from(timeline.querySelectorAll<HTMLElement>("[data-method-marker]"))
    if (!steps.length || markers.length !== steps.length) return

    let frame = 0
    let needsMeasure = true
    let markerOffsets: number[] = []
    let railStart = 0
    let railLength = 0
    let previousProgress = ""
    const reached = steps.map((step) => step.dataset.active === "true")
    const icons = steps.map(step => {
      const root = step.querySelector<HTMLElement>("[data-method-icon]")
      return root ? {
        root,
        motion: createMethodMotion(root, root.dataset.methodIcon as MethodKind),
        visible: false,
        played: false,
      } : null
    })

    const syncIcon = (index: number) => {
      const icon = icons[index]
      if (!icon) return
      if (!reached[index] || !icon.visible) {
        icon.motion.cancel()
        if (!reached[index]) icon.played = false
      } else if (!icon.played) {
        icon.played = true
        void icon.motion.play()
      }
    }

    const update = () => {
      frame = 0
      const bounds = timeline.getBoundingClientRect()

      if (needsMeasure) {
        // Marker centers stay fixed during their scale transition. Measuring
        // them also follows the rail's move to the left on mobile.
        const rects = markers.map((marker) => marker.getBoundingClientRect())
        markerOffsets = rects.map((rect) => rect.top + rect.height / 2 - bounds.top)
        railStart = markerOffsets[0]
        railLength = Math.max(0, markerOffsets[markerOffsets.length - 1] - railStart)
        timeline.style.setProperty("--method-rail-top", `${railStart}px`)
        timeline.style.setProperty("--method-rail-left", `${rects[0].left + rects[0].width / 2 - bounds.left}px`)
        timeline.style.setProperty("--method-rail-height", `${railLength}px`)
        needsMeasure = false
      }

      // One shared position drives the fill and the later stages. Scrolling
      // back retracts them, while the first stage always remains active.
      const position = window.innerHeight * 0.52 - bounds.top
      const progress = railLength > 0
        ? Math.min(1, Math.max(0, (position - railStart) / railLength))
        : 0
      const progressValue = progress.toFixed(5)
      if (progressValue !== previousProgress) {
        timeline.style.setProperty("--method-progress", progressValue)
        previousProgress = progressValue
      }

      steps.forEach((step, index) => {
        const nextReached = index === 0 || position >= markerOffsets[index]
        if (nextReached === reached[index]) return
        step.dataset.active = String(nextReached)
        reached[index] = nextReached
        syncIcon(index)
      })
    }

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const measureAndUpdate = () => {
      needsMeasure = true
      scheduleUpdate()
    }

    update()
    // Visibility only gates playback. Activation still comes from the same
    // marker crossing as the card highlight, not a second scroll threshold.
    // The already-active first card plays on its first visible entrance.
    const iconObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const index = icons.findIndex(icon => icon?.root === entry.target)
        const icon = icons[index]
        if (!icon) return
        icon.visible = entry.isIntersecting && entry.intersectionRatio >= 0.6
        syncIcon(index)
      })
    }, { threshold: [0, 0.6] })
    icons.forEach(icon => { if (icon) iconObserver.observe(icon.root) })
    const observer = new ResizeObserver(measureAndUpdate)
    observer.observe(timeline)
    steps.forEach((step) => observer.observe(step))
    const section = timeline.closest("section")
    if (section) {
      observer.observe(section)
      if (section.previousElementSibling) observer.observe(section.previousElementSibling)
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", measureAndUpdate)
    window.addEventListener("pageshow", measureAndUpdate)

    return () => {
      cancelAnimationFrame(frame)
      iconObserver.disconnect()
      icons.forEach(icon => icon?.motion.destroy())
      observer.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", measureAndUpdate)
      window.removeEventListener("pageshow", measureAndUpdate)
      steps.forEach((step, index) => { step.dataset.active = String(index === 0) })
      timeline.style.removeProperty("--method-rail-top")
      timeline.style.removeProperty("--method-rail-left")
      timeline.style.removeProperty("--method-rail-height")
      timeline.style.removeProperty("--method-progress")
    }
  }, [])

  return timelineRef
}
