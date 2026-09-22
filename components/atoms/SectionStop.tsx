"use client"

import { useEffect } from "react"

/** Same query as the hero's pinned mode (hero.module.css / globals.css). */
const PINNED_QUERY = "(min-height: 700px)"
/** A pause longer than this between wheel events means a new gesture. */
const GESTURE_GAP_MS = 120
/** A sudden jump in wheel delta (vs. decaying momentum) also means a new gesture. */
const NEW_GESTURE_DELTA_FACTOR = 1.6
/** Hard cap on how long one crossing gesture is absorbed. */
const MAX_HOLD_MS = 1200
/** Only clamp crossings that a wheel gesture caused (not anchors, keys, scrollbar). */
const RECENT_WHEEL_MS = 200

/**
 * Stops a downward wheel gesture at the first target boundary it crosses.
 * One controller owns all targets, so a large delta cannot activate two
 * competing holds. The page lands exactly at the section's top and the
 * rest of that gesture's momentum is swallowed.
 * The next gesture (a pause, or a fresh, stronger swipe) scrolls freely
 * at once - no fixed dead zone, and the scrollbar always matches the page.
 * Scrolling back up is never intercepted. Wheel input only (mouse,
 * trackpad); touch scrolls through untouched. Active only in the hero's
 * pinned mode. Renders nothing.
 */
export function SectionStop({ targetIds }: { targetIds: readonly string[] }) {
  useEffect(() => {
    const targets = targetIds
      .map((id) => document.getElementById(id))
      .filter((target): target is HTMLElement => target !== null)
    if (!targets.length) return
    const pinned = window.matchMedia(PINNED_QUERY)
    let lastY = window.scrollY
    let lastWheelAt = Number.NEGATIVE_INFINITY
    let lastDelta = 0
    let holdingTarget: HTMLElement | null = null
    let holdUntil = 0

    const boundary = (target: HTMLElement) => target.getBoundingClientRect().top + window.scrollY

    const onScroll = () => {
      const previous = lastY
      const y = window.scrollY
      lastY = y
      if (!pinned.matches) {
        holdingTarget = null
        return
      }
      const now = performance.now()

      if (holdingTarget) {
        // The gesture is over (no wheel input for a while) or the cap is
        // reached: let go, so keyboard or scrollbar scrolling is never fought.
        if (now - lastWheelAt > GESTURE_GAP_MS || now > holdUntil) {
          holdingTarget = null
          return
        }
        // Scroll the browser already had in flight when we clamped (async
        // scrolling, notably Firefox) can carry a few pixels past the
        // boundary; keep the section exactly flush for the rest of the hold.
        const b = boundary(holdingTarget)
        if (Math.abs(y - b) > 0.5) {
          window.scrollTo({ top: b, behavior: "instant" })
          lastY = b
        }
        return
      }

      // Downward crossings only, and only ones a wheel gesture caused.
      if (now - lastWheelAt > RECENT_WHEEL_MS || y <= previous) return
      let nextTarget: HTMLElement | null = null
      let nextBoundary = Number.POSITIVE_INFINITY
      for (const target of targets) {
        const b = boundary(target)
        if (previous < b && y >= b && b < nextBoundary) {
          nextTarget = target
          nextBoundary = b
        }
      }
      if (!nextTarget) return
      window.scrollTo({ top: nextBoundary, behavior: "instant" })
      lastY = nextBoundary
      holdingTarget = nextTarget
      holdUntil = now + MAX_HOLD_MS
    }

    const onWheel = (event: WheelEvent) => {
      // Upward gestures, horizontal scrolling and pinch-zoom always release.
      if (event.ctrlKey || event.deltaY <= 0 || !pinned.matches) {
        holdingTarget = null
        lastWheelAt = Number.NEGATIVE_INFINITY
        lastDelta = 0
        return
      }
      const now = performance.now()
      const gap = now - lastWheelAt
      const delta = Math.abs(event.deltaY)
      const previousDelta = lastDelta
      lastWheelAt = now
      lastDelta = delta
      if (!holdingTarget) return
      const newGesture = gap > GESTURE_GAP_MS || delta > previousDelta * NEW_GESTURE_DELTA_FACTOR + 2
      if (newGesture || now > holdUntil) {
        holdingTarget = null
        return
      }
      event.preventDefault()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // Non-passive so the tail of a crossing gesture can be swallowed; the
    // handler itself is a few comparisons, so scrolling latency is unaffected.
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("wheel", onWheel)
    }
  }, [targetIds])
  return null
}
