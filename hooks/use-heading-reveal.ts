"use client"

import { useCallback, useLayoutEffect, useRef } from "react"
import { useAnimationControls, type AnimationControls } from "motion/react"

/** Server markup stays visible; only mounted, motion-enabled headings animate. */
export function useHeadingReveal(threshold: number, externalControls?: AnimationControls) {
  const elementRef = useRef<HTMLElement | null>(null)
  const ref = useCallback((element: HTMLElement | null) => { elementRef.current = element }, [])
  const controls = useAnimationControls()

  useLayoutEffect(() => {
    // A section can own the start while preserving the shared letter effect.
    if (externalControls) return
    const element = elementRef.current
    if (!element) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let observer: IntersectionObserver | undefined
    const show = () => {
      controls.stop()
      controls.set("visible")
      observer?.disconnect()
    }

    if (reduced.matches || element.getBoundingClientRect().top < 0) {
      show()
    } else {
      controls.set("hidden")
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < threshold) return
        void controls.start("visible")
        observer?.disconnect()
      }, { threshold })
      observer.observe(element)
    }

    const onPreference = () => { if (reduced.matches) show() }
    reduced.addEventListener("change", onPreference)
    return () => {
      observer?.disconnect()
      reduced.removeEventListener("change", onPreference)
      show()
    }
  }, [controls, threshold, externalControls])

  return { ref, controls: externalControls ?? controls }
}
