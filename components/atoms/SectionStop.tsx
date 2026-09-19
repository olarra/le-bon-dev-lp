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
 * Makes a downward wheel scroll that crosses the top of `#targetId` stop
 * exactly there: the page is set to the boundary the moment it's crossed and
 * the rest of that gesture's momentum is swallowed, so a fast scroll from
 * the hero lands on the start of the next section instead of flying into
 * it. The next gesture (a pause, or a fresh, stronger swipe) scrolls freely
 * at once - no fixed dead zone, and the scrollbar always matches the page.
 * Scrolling back up is never intercepted. Wheel input only (mouse,
 * trackpad); touch scrolls through untouched. Active only in the hero's
 * pinned mode. Renders nothing.
 */
export function SectionStop({ targetId }: { targetId: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    const pinned = window.matchMedia(PINNED_QUERY)
    let lastY = window.scrollY
    let lastWheelAt = Number.NEGATIVE_INFINITY
    let lastDelta = 0
    let holding = false
    let holdUntil = 0

    const boundary = () => target.getBoundingClientRect().top + window.scrollY

    const onScroll = () => {
      const previous = lastY
      const y = window.scrollY
      lastY = y
      if (!pinned.matches) return
      const now = performance.now()
      const b = boundary()

      if (holding) {
        // The gesture is over (no wheel input for a while) or the cap is
        // reached: let go, so keyboard or scrollbar scrolling is never fought.
        if (now - lastWheelAt > GESTURE_GAP_MS || now > holdUntil) {
          holding = false
          return
        }
        // Scroll the browser already had in flight when we clamped (async
        // scrolling, notably Firefox) can carry a few pixels past the
        // boundary; keep the section exactly flush for the rest of the hold.
        if (Math.abs(y - b) > 0.5) {
          window.scrollTo({ top: b, behavior: "instant" })
          lastY = b
        }
        return
      }

      // Downward crossings only, and only ones a wheel gesture caused.
      if (now - lastWheelAt > RECENT_WHEEL_MS) return
      if (!(previous < b && y > b)) return
      window.scrollTo({ top: b, behavior: "instant" })
      lastY = b
      holding = true
      holdUntil = now + MAX_HOLD_MS
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return // pinch-zoom on trackpads, not a scroll
      const now = performance.now()
      const gap = now - lastWheelAt
      const delta = Math.abs(event.deltaY)
      const previousDelta = lastDelta
      lastWheelAt = now
      lastDelta = delta
      if (!holding) return
      const newGesture = gap > GESTURE_GAP_MS || delta > previousDelta * NEW_GESTURE_DELTA_FACTOR + 2
      if (newGesture || now > holdUntil) {
        holding = false
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
  }, [targetId])
  return null
}
