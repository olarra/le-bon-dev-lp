"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import styles from "./showcase.module.css"

/** The green card opens on entry and returns to its contained shape on exit. */
export function ShowcaseSection({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let expanded: boolean | null = null
    let scrollFrame = 0

    const update = () => {
      scrollFrame = 0
      const { top, bottom } = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const entryTrigger = viewportHeight * 0.48
      const exitTrigger = viewportHeight * 0.9
      // Separate entry/exit thresholds prevent repeated toggles near the edge.
      const releaseDistance = Math.min(72, viewportHeight * 0.08)
      const hasEntered = top <= entryTrigger + (expanded ? releaseDistance : 0)
      // Close as the following section comes into view; reopen on the return
      // journey only after moving past the small hysteresis band.
      const hasNotExited = bottom > exitTrigger + (expanded === false ? releaseDistance : 0)
      const next = hasEntered && hasNotExited

      if (next !== expanded) {
        expanded = next
        section.dataset.expanded = String(next)
      }
    }

    const scheduleUpdate = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(update)
    }

    // Restore the correct surface before paint on reloads and anchor landings.
    update()
    const readyFrame = requestAnimationFrame(() => {
      section.dataset.ready = "true"
    })

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(section)
    if (section.previousElementSibling) observer.observe(section.previousElementSibling)

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("pageshow", scheduleUpdate)

    return () => {
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(readyFrame)
      observer.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("pageshow", scheduleUpdate)
      delete section.dataset.ready
      delete section.dataset.expanded
    }
  }, [])

  return (
    <div ref={sectionRef} className={styles.showcase} id="offers-showcase" data-expanded="false" data-header-theme="light">
      <div className={styles.surface} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
