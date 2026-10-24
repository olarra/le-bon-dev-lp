"use client"

import { useCallback, useLayoutEffect, useRef } from "react"
import { useAnimationControls } from "motion/react"
import type { AnimationControls } from "@/lib/motion"

/** Server markup stays visible; only mounted, motion-enabled headings animate. */
export function useHeadingReveal(threshold: number, externalControls?: AnimationControls, staggerByLine = false) {
  const elementRef = useRef<HTMLElement | null>(null)
  const characterOrder = useRef<number[]>([])
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
        if (staggerByLine) {
          // Word wrappers keep their layout while the individual letters scale.
          // Measure at the reveal so wrapping follows the current viewport.
          const order: number[] = []
          let lineTop: number | undefined
          let position = 0
          element.querySelectorAll<HTMLElement>("[data-heading-word]").forEach(word => {
            const top = word.getBoundingClientRect().top
            if (lineTop === undefined || Math.abs(top - lineTop) > 1) {
              lineTop = top
              position = 0
            }
            word.querySelectorAll("[data-heading-character]").forEach(() => {
              order.push(position++)
            })
          })
          characterOrder.current = order
        }
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
  }, [controls, threshold, externalControls, staggerByLine])

  return { ref, controls: externalControls ?? controls, characterOrder }
}
