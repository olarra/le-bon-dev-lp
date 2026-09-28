"use client"

import { useEffect, type RefObject } from "react"

const MATERIAL = {
  angle: 210,
  angleRangeX: 140,
  angleRangeY: 75,
  originX: 50,
  originY: 42,
  originRange: 30,
  pointerGain: 1.25,
  tilt: 12,
  travelX: 3,
  travelY: 2,
  smoothingMs: 70,
  reactionRadius: 380,
  fadeStart: 260,
  directionRadius: 160,
} as const

const TOUCH_FEEDBACK_MS = 180

const RESPONSES = {
  follow: { direction: 1, smoothingMs: MATERIAL.smoothingMs },
  counter: { direction: -0.65, smoothingMs: 115 },
} as const

const MATERIAL_PROPERTIES = [
  "--sticker-foil-angle", "--sticker-foil-x", "--sticker-foil-y",
  "--sticker-gloss-x", "--sticker-gloss-y", "--sticker-gloss-angle",
  "--sticker-rx", "--sticker-ry",
  "--sticker-x", "--sticker-y",
  "--sticker-activity",
] as const

export type StickerTracking = "proximity" | "surface" | "nearest-surface"

type StickerMotionOptions = {
  enabled?: boolean
  tracking?: StickerTracking
}

type StickerPress = { kind: "touch" | "pen"; id: number; startedAt: number }

/** Track the nearest sticker, or map a whole card to its own artwork. */
export function useStickerMotion(
  ref: RefObject<HTMLElement | null>,
  { enabled = true, tracking = "proximity" }: StickerMotionOptions = {},
) {
  useEffect(() => {
    if (!enabled) return
    const section = ref.current
    if (!section) return

    // Measure the stationary wrapper, never its transformed artwork.
    const stickers = Array.from(section.querySelectorAll<HTMLElement>("[data-metal-sticker]"), element => ({
      element, x: 0, y: 0, activity: 0, targetX: 0, targetY: 0, targetActivity: 0,
      response: RESPONSES[element.dataset.stickerResponse === "counter" ? "counter" : "follow"],
    }))
    if (!stickers.length) return

    const interactive = window.matchMedia("(prefers-reduced-motion: no-preference)")
    let frame = 0
    let lastFrame = 0
    let pointer: { x: number; y: number } | null = null
    let pointerChanged = false
    let press: StickerPress | null = null
    let releaseTimer = 0

    const resetTargets = () => {
      stickers.forEach(sticker => { sticker.targetX = sticker.targetY = sticker.targetActivity = 0 })
    }

    const updateTargets = () => {
      if (!pointer) {
        resetTargets()
        return
      }

      const sectionRect = section.getBoundingClientRect()
      if (pointer.x < sectionRect.left || pointer.x > sectionRect.right ||
          pointer.y < sectionRect.top || pointer.y > sectionRect.bottom) {
        // Keep the last pose if scrolling carries the card away from the finger.
        if (press?.kind !== "touch") resetTargets()
        return
      }

      if (tracking === "surface") {
        // Use the full card's dimensions so movement stays responsive at its bottom.
        const x = (pointer.x - sectionRect.left) / Math.max(1, sectionRect.width) * 2 - 1
        const y = (pointer.y - sectionRect.top) / Math.max(1, sectionRect.height) * 2 - 1
        stickers.forEach(sticker => {
          sticker.targetX = x
          sticker.targetY = y
          sticker.targetActivity = 1
        })
        return
      }

      let nearest: typeof stickers[number] | undefined
      let nearestRect: DOMRect | undefined
      let distance: number = tracking === "nearest-surface" ? Infinity : MATERIAL.reactionRadius
      let localX = 0
      let localY = 0

      for (const sticker of stickers) {
        const rect = sticker.element.getBoundingClientRect()
        const dx = pointer.x - (rect.left + rect.width / 2)
        const dy = pointer.y - (rect.top + rect.height / 2)
        const candidateDistance = Math.hypot(dx, dy)
        if (candidateDistance < distance) {
          nearest = sticker
          nearestRect = rect
          distance = candidateDistance
          localX = dx
          localY = dy
        }
      }
      if (!nearest || !nearestRect) {
        if (press?.kind !== "touch") resetTargets()
        return
      }
      resetTargets()

      if (tracking === "nearest-surface") {
        // Each icon looks toward the cursor across the full section, without
        // reaching its maximum tilt before the pointer reaches an edge.
        const centerX = nearestRect.left + nearestRect.width / 2
        const centerY = nearestRect.top + nearestRect.height / 2
        const rangeX = localX < 0 ? centerX - sectionRect.left : sectionRect.right - centerX
        const rangeY = localY < 0 ? centerY - sectionRect.top : sectionRect.bottom - centerY
        nearest.targetX = Math.max(-1, Math.min(1, localX / Math.max(1, rangeX)))
        nearest.targetY = Math.max(-1, Math.min(1, localY / Math.max(1, rangeY)))
        nearest.targetActivity = 1
        return
      }

      // Full response close by, then a soft falloff at the wide area's edge.
      const fade = Math.max(0, (distance - MATERIAL.fadeStart) / (MATERIAL.reactionRadius - MATERIAL.fadeStart))
      const influence = press?.kind === "touch" ? 1 : 1 - fade * fade * (3 - 2 * fade)
      nearest.targetX = Math.max(-1, Math.min(1, localX / MATERIAL.directionRadius * MATERIAL.pointerGain)) * influence
      nearest.targetY = Math.max(-1, Math.min(1, localY / MATERIAL.directionRadius * MATERIAL.pointerGain)) * influence
      nearest.targetActivity = influence
    }

    const draw = (now: number) => {
      // Batch geometry reads before writing any sticker's material variables.
      if (pointerChanged) {
        updateTargets()
        pointerChanged = false
      }

      const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 1000 / 60
      lastFrame = now
      let settled = true
      for (const sticker of stickers) {
        const targetX = sticker.targetX * sticker.response.direction
        const targetY = sticker.targetY * sticker.response.direction
        if (sticker.x === targetX && sticker.y === targetY && sticker.activity === sticker.targetActivity) continue

        const blend = 1 - Math.exp(-elapsed / sticker.response.smoothingMs)
        sticker.x += (targetX - sticker.x) * blend
        sticker.y += (targetY - sticker.y) * blend
        sticker.activity += (sticker.targetActivity - sticker.activity) * blend
        const atRest = Math.abs(targetX - sticker.x) + Math.abs(targetY - sticker.y) +
          Math.abs(sticker.targetActivity - sticker.activity) < 0.001
        if (atRest) {
          sticker.x = targetX
          sticker.y = targetY
          sticker.activity = sticker.targetActivity
        }
        else settled = false

        const { x, y, element } = sticker
        element.style.setProperty("--sticker-foil-angle", `${MATERIAL.angle + x * MATERIAL.angleRangeX + y * MATERIAL.angleRangeY}deg`)
        element.style.setProperty("--sticker-foil-x", `${MATERIAL.originX + x * MATERIAL.originRange}%`)
        element.style.setProperty("--sticker-foil-y", `${MATERIAL.originY + y * MATERIAL.originRange}%`)
        element.style.setProperty("--sticker-gloss-x", `${50 + x * 60}%`)
        element.style.setProperty("--sticker-gloss-y", `${50 + y * 45}%`)
        element.style.setProperty("--sticker-gloss-angle", `${110 + x * 12 + y * 8}deg`)
        element.style.setProperty("--sticker-rx", `${-y * MATERIAL.tilt}deg`)
        element.style.setProperty("--sticker-ry", `${x * MATERIAL.tilt}deg`)
        element.style.setProperty("--sticker-x", `${x * MATERIAL.travelX}px`)
        element.style.setProperty("--sticker-y", `${y * MATERIAL.travelY}px`)
        element.style.setProperty("--sticker-activity", String(sticker.activity))
      }

      frame = settled ? 0 : requestAnimationFrame(draw)
      if (settled) lastFrame = 0
    }

    const schedule = () => {
      pointerChanged = true
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const rest = () => {
      window.clearTimeout(releaseTimer)
      releaseTimer = 0
      press = null
      pointer = null
      schedule()
    }
    const startPress = (kind: StickerPress["kind"], id: number, x: number, y: number) => {
      window.clearTimeout(releaseTimer)
      releaseTimer = 0
      resetTargets()
      press = { kind, id, startedAt: performance.now() }
      pointer = { x, y }
      schedule()
    }
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "pen" || !event.isPrimary || press) return
      startPress("pen", event.pointerId, event.clientX, event.clientY)
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      if (event.pointerType === "mouse") {
        if (press) return
        window.clearTimeout(releaseTimer)
        releaseTimer = 0
      } else if (press?.kind !== "pen" || event.pointerId !== press.id) return
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const release = () => {
      if (!press) return
      // Let a quick tap reach a visible frame before easing back to rest.
      const remaining = Math.max(0, TOUCH_FEEDBACK_MS - (performance.now() - press.startedAt))
      press = null
      if (remaining) releaseTimer = window.setTimeout(rest, remaining)
      else rest()
    }
    const up = (event: PointerEvent) => {
      if (press?.kind === "pen" && event.pointerId === press.id) release()
    }
    const cancel = (event: PointerEvent) => {
      if (press?.kind === "pen" && event.pointerId === press.id) rest()
    }
    // Native scrolling cancels touch pointers before the finger lifts.
    // Touch events keep following the original contact throughout the pan.
    const touchStart = (event: TouchEvent) => {
      if (press || event.touches.length !== 1) return
      const touch = event.changedTouches[0]
      if (touch) startPress("touch", touch.identifier, touch.clientX, touch.clientY)
    }
    const touchMove = (event: TouchEvent) => {
      if (press?.kind !== "touch") return
      const touch = Array.from(event.touches).find(touch => touch.identifier === press?.id)
      if (!touch) return
      pointer = { x: touch.clientX, y: touch.clientY }
      schedule()
    }
    const touchEnd = (event: TouchEvent) => {
      if (press?.kind !== "touch" || Array.from(event.touches).some(touch => touch.identifier === press?.id)) return
      if (event.type === "touchcancel") rest()
      else release()
    }
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !press) rest()
    }
    const layoutChanged = () => { if (pointer) schedule() }
    const visibilityChanged = () => { if (document.hidden) rest() }

    const reset = () => {
      section.removeEventListener("pointerdown", down)
      section.removeEventListener("pointermove", move)
      section.removeEventListener("pointerleave", leave)
      section.removeEventListener("touchstart", touchStart)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel)
      window.removeEventListener("touchmove", touchMove)
      window.removeEventListener("touchend", touchEnd)
      window.removeEventListener("touchcancel", touchEnd)
      window.removeEventListener("scroll", layoutChanged)
      window.removeEventListener("resize", layoutChanged)
      window.removeEventListener("blur", rest)
      document.removeEventListener("visibilitychange", visibilityChanged)
      cancelAnimationFrame(frame)
      window.clearTimeout(releaseTimer)
      frame = lastFrame = 0
      releaseTimer = 0
      press = null
      pointer = null
      pointerChanged = false
      stickers.forEach(sticker => {
        sticker.x = sticker.y = sticker.activity = sticker.targetX = sticker.targetY = sticker.targetActivity = 0
        MATERIAL_PROPERTIES.forEach(property => sticker.element.style.removeProperty(property))
      })
    }
    const syncInputMode = () => {
      reset()
      if (!interactive.matches) return
      // Passive events keep scrolling, pinch zoom and link activation native.
      section.addEventListener("pointerdown", down, { passive: true })
      section.addEventListener("pointermove", move, { passive: true })
      section.addEventListener("pointerleave", leave)
      section.addEventListener("touchstart", touchStart, { passive: true })
      window.addEventListener("pointerup", up, { passive: true })
      window.addEventListener("pointercancel", cancel, { passive: true })
      window.addEventListener("touchmove", touchMove, { passive: true })
      window.addEventListener("touchend", touchEnd, { passive: true })
      window.addEventListener("touchcancel", touchEnd, { passive: true })
      window.addEventListener("scroll", layoutChanged, { passive: true })
      window.addEventListener("resize", layoutChanged, { passive: true })
      window.addEventListener("blur", rest)
      document.addEventListener("visibilitychange", visibilityChanged)
    }

    syncInputMode()
    interactive.addEventListener("change", syncInputMode)
    return () => {
      interactive.removeEventListener("change", syncInputMode)
      reset()
    }
  }, [ref, enabled, tracking])
}
