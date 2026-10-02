"use client"

import { useEffect, type RefObject } from "react"

const MATERIAL = {
  angle: 210,
  angleRangeX: 140,
  angleRangeY: 75,
  originX: 50,
  originY: 42,
  originRange: 30,
  tilt: 10,
  travelX: 1.25,
  travelY: 1,
  smoothingMs: 110,
  falloffDistance: 420,
} as const

const TOUCH_FEEDBACK_MS = 180
const TOUCH_MARGIN = 20
const VIEWPORT_MARGIN = 80

const RESPONSES = {
  follow: { direction: 1, smoothingMs: MATERIAL.smoothingMs },
  counter: { direction: -0.65, smoothingMs: 140 },
} as const

const MATERIAL_PROPERTIES = [
  "--sticker-foil-angle", "--sticker-foil-x", "--sticker-foil-y",
  "--sticker-gloss-x", "--sticker-gloss-y", "--sticker-gloss-angle",
  "--sticker-rx", "--sticker-ry",
  "--sticker-x", "--sticker-y",
  "--sticker-activity",
] as const

type StickerMotionOptions = {
  enabled?: boolean
}

type PointerPosition = { x: number; y: number }
type StickerPress = { kind: "touch" | "pen"; id: number; startedAt: number; element: HTMLElement }

/** Follow the cursor across each surface with its nearest sticker; scrolling stays quiet. */
export function useStickerMotion(
  ref: RefObject<HTMLElement | null>,
  { enabled = true }: StickerMotionOptions = {},
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
    let inView = false
    let pointer: PointerPosition | null = null
    let lastMousePosition: PointerPosition | null = null
    let press: StickerPress | null = null
    let releaseTimer = 0

    const resetTargets = () => {
      stickers.forEach(sticker => { sticker.targetX = sticker.targetY = sticker.targetActivity = 0 })
    }

    const findTarget = (position: PointerPosition, startingPress = false) => {
      const width = document.documentElement.clientWidth
      const height = window.innerHeight
      let nearest: {
        sticker: typeof stickers[number]
        dx: number; dy: number; distance: number; centerSoftness: number
      } | undefined

      for (const sticker of stickers) {
        if (press && sticker.element !== press.element) continue
        const rect = sticker.element.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 ||
            rect.top >= height || rect.right <= 0 || rect.left >= width) continue
        const dx = position.x - (rect.left + rect.width / 2)
        const dy = position.y - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy)
        const radius = startingPress
          ? Math.max(44, Math.max(rect.width, rect.height) / 2 + TOUCH_MARGIN)
          : Infinity
        if (distance >= radius || (nearest && distance >= nearest.distance)) continue
        nearest = { sticker, dx, dy, distance, centerSoftness: Math.max(32, Math.max(rect.width, rect.height) * 0.6) }
      }
      return nearest
    }

    const updateTargets = () => {
      resetTargets()
      if (!pointer || !inView) return
      const target = findTarget(pointer)
      if (!target) return

      const { sticker, dx, dy, distance, centerSoftness } = target
      // Distant cursor positions still produce a gentle response anywhere
      // inside this section or card, without a proximity cutoff.
      const influence = press ? 1 : 0.55 + 0.45 / (1 + (distance / MATERIAL.falloffDistance) ** 2)
      const directionLength = Math.hypot(distance, centerSoftness)
      sticker.targetX = dx / directionLength * influence
      sticker.targetY = dy / directionLength * influence
      sticker.targetActivity = influence
    }

    const draw = (now: number) => {
      // Read geometry before writing material variables; held touches keep
      // their own icon while the native page moves underneath them.
      updateTargets()

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
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const layoutChanged = () => { if (pointer && inView) schedule() }
    const rest = () => {
      window.clearTimeout(releaseTimer)
      releaseTimer = 0
      press = null
      pointer = null
      schedule()
    }
    const startPress = (kind: StickerPress["kind"], id: number, x: number, y: number) => {
      if (!inView) return
      const position = { x, y }
      const target = findTarget(position, true)
      if (!target) return
      window.clearTimeout(releaseTimer)
      releaseTimer = 0
      resetTargets()
      press = { kind, id, startedAt: performance.now(), element: target.sticker.element }
      pointer = position
      schedule()
    }
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        move(event)
        return
      }
      if (event.pointerType !== "pen" || !event.isPrimary || press) return
      startPress("pen", event.pointerId, event.clientX, event.clientY)
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      if (event.pointerType === "mouse") {
        if (press) return
        // Layout changes can produce pointer events without a real movement.
        // They must not restart the effect beneath a stationary mouse after scroll.
        if (event.type === "pointermove" && lastMousePosition?.x === event.clientX &&
            lastMousePosition.y === event.clientY) return
        lastMousePosition = { x: event.clientX, y: event.clientY }
        window.clearTimeout(releaseTimer)
        releaseTimer = 0
      } else if (press?.kind !== "pen" || event.pointerId !== press.id) return
      pointer = { x: event.clientX, y: event.clientY }
      layoutChanged()
    }
    const wheel = () => {
      if (!press && pointer) rest()
    }
    const scroll = () => {
      if (press) layoutChanged()
      else if (pointer) rest()
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
      layoutChanged()
    }
    const touchEnd = (event: TouchEvent) => {
      if (press?.kind !== "touch" || Array.from(event.touches).some(touch => touch.identifier === press?.id)) return
      if (event.type === "touchcancel") rest()
      else release()
    }
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !press) rest()
    }
    const visibilityChanged = () => { if (document.hidden) rest() }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      schedule()
    }, { rootMargin: `${VIEWPORT_MARGIN}px` })
    const resizeObserver = new ResizeObserver(layoutChanged)

    const reset = () => {
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      section.removeEventListener("pointerdown", down)
      section.removeEventListener("pointermove", move)
      section.removeEventListener("pointerleave", leave)
      window.removeEventListener("wheel", wheel)
      section.removeEventListener("touchstart", touchStart)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel)
      window.removeEventListener("touchmove", touchMove)
      window.removeEventListener("touchend", touchEnd)
      window.removeEventListener("touchcancel", touchEnd)
      window.removeEventListener("scroll", scroll, true)
      window.removeEventListener("resize", layoutChanged)
      window.removeEventListener("blur", rest)
      document.removeEventListener("visibilitychange", visibilityChanged)
      cancelAnimationFrame(frame)
      window.clearTimeout(releaseTimer)
      frame = lastFrame = 0
      inView = false
      releaseTimer = 0
      press = null
      pointer = null
      lastMousePosition = null
      stickers.forEach(sticker => {
        sticker.x = sticker.y = sticker.activity = sticker.targetX = sticker.targetY = sticker.targetActivity = 0
        MATERIAL_PROPERTIES.forEach(property => sticker.element.style.removeProperty(property))
      })
    }
    const syncInputMode = () => {
      reset()
      if (!interactive.matches) return
      visibilityObserver.observe(section)
      resizeObserver.observe(section)
      // Passive events keep scrolling, pinch zoom and link activation native.
      section.addEventListener("pointerdown", down, { passive: true })
      section.addEventListener("pointermove", move, { passive: true })
      section.addEventListener("pointerleave", leave)
      window.addEventListener("wheel", wheel, { passive: true })
      section.addEventListener("touchstart", touchStart, { passive: true })
      window.addEventListener("pointerup", up, { passive: true })
      window.addEventListener("pointercancel", cancel, { passive: true })
      window.addEventListener("touchmove", touchMove, { passive: true })
      window.addEventListener("touchend", touchEnd, { passive: true })
      window.addEventListener("touchcancel", touchEnd, { passive: true })
      window.addEventListener("scroll", scroll, { passive: true, capture: true })
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
  }, [ref, enabled])
}
