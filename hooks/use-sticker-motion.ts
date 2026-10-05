"use client"

import { useEffect, type RefObject } from "react"
import { setStickerLight, STICKER_LIGHT_PROPERTIES } from "@/lib/sticker-light"

const MATERIAL = {
  tilt: 10,
  travelX: 1.25,
  travelY: 1,
  reachMin: 320,
  reachScale: 3.5,
  reachMax: 480,
  tiltRise: 0.5,
  tiltFade: 0.7,
  shineFade: 0.6,
} as const

// A fixed lamp above the viewport, slightly left. Scrolling carries each visible
// sticker past it: the highlight sweeps across the finish and the sticker leans
// with the motion, in proportion to speed, then settles flat. The shine itself
// decays slowly, so a natural pause between two flicks keeps it softly lit.
const SCROLL = {
  lampX: -0.15,
  sweep: 1.3, // light travel across the viewport; the ridge crosses the sticker in about half of it
  velocity: 0.5, // px/ms for full shine: an ordinary wheel scroll reaches it
  lean: 0.5, // fraction of MATERIAL.tilt
  idleMs: 100,
  glowDecayMs: 700,
} as const

const TOUCH_FEEDBACK_MS = 180
const TOUCH_MARGIN = 20
const VIEWPORT_MARGIN = 80

// Quick to follow, slower to let go.
const FOLLOW_MS = 100
const SETTLE_MS = 260

const clamp = (value: number, min = -1, max = 1) => Math.min(max, Math.max(min, value))
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

const MATERIAL_PROPERTIES = [
  ...STICKER_LIGHT_PROPERTIES,
  "--sticker-rx", "--sticker-ry",
  "--sticker-x", "--sticker-y",
] as const

type StickerMotionOptions = {
  enabled?: boolean
}

type PointerPosition = { x: number; y: number }
type StickerPress = { kind: "touch" | "pen"; id: number; startedAt: number; element: HTMLElement }

/** Light each surface's stickers as scrolling carries them past a fixed lamp; a nearby cursor takes the light over. */
export function useStickerMotion(
  ref: RefObject<HTMLElement | null>,
  { enabled = true }: StickerMotionOptions = {},
) {
  useEffect(() => {
    if (!enabled) return
    const section = ref.current
    if (!section) return

    // Measure the stationary wrapper, never its transformed artwork.
    // x/y tilt the sticker; lx/ly place the light on its finish.
    const stickers = Array.from(section.querySelectorAll<HTMLElement>("[data-metal-sticker]"), element => ({
      element, x: 0, y: 0, lx: 0, ly: 0, activity: 0,
      targetX: 0, targetY: 0, targetLx: 0, targetLy: 0, targetActivity: 0,
    }))
    if (!stickers.length) return
    type Sticker = typeof stickers[number]

    const interactive = window.matchMedia("(prefers-reduced-motion: no-preference)")
    let frame = 0
    let lastFrame = 0
    let inView = false
    let pointer: PointerPosition | null = null
    let lastMousePosition: PointerPosition | null = null
    let press: StickerPress | null = null
    let releaseTimer = 0
    let scrollY = window.scrollY
    let scrollVelocity = 0
    let lastScrollAt = 0
    let glow = 0

    const resetTargets = () => {
      stickers.forEach(sticker => {
        sticker.targetX = sticker.targetY = sticker.targetLx = sticker.targetLy = sticker.targetActivity = 0
      })
    }
    const measure = () => stickers.map(sticker => sticker.element.getBoundingClientRect())
    const isVisible = (rect: DOMRect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 &&
      rect.top < window.innerHeight && rect.right > 0 && rect.left < document.documentElement.clientWidth

    const findTarget = (position: PointerPosition, rects: DOMRect[], startingPress = false) => {
      let nearest: { sticker: Sticker; dx: number; dy: number; distance: number; proximity: number } | undefined

      for (let index = 0; index < stickers.length; index++) {
        const sticker = stickers[index]
        const rect = rects[index]
        if ((press && sticker.element !== press.element) || !isVisible(rect)) continue
        const size = Math.max(rect.width, rect.height)
        const dx = position.x - (rect.left + rect.width / 2)
        const dy = position.y - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy)
        // Each sticker's reach scales with its size; a press must start on or beside it.
        const reach = startingPress
          ? Math.max(44, size / 2 + TOUCH_MARGIN)
          : clamp(size * MATERIAL.reachScale, MATERIAL.reachMin, MATERIAL.reachMax)
        const proximity = distance / reach
        // A held press keeps its icon while the page scrolls it out of reach.
        if ((proximity >= 1 && !press) || (nearest && proximity >= nearest.proximity)) continue
        nearest = { sticker, dx, dy, distance, proximity }
      }
      return nearest
    }

    /** Returns whether the scroll light is still live, so drawing continues until it has faded. */
    const updateTargets = (now: number, elapsed: number) => {
      resetTargets()
      if (!inView) return false
      const rects = measure()
      const height = window.innerHeight

      // The light's position depends only on each sticker's place in the viewport:
      // the highlight travels across it as it moves, reverses with the scroll,
      // and holds where it is when scrolling pauses, instead of springing back.
      const scrolling = lastScrollAt !== 0 && now - lastScrollAt < SCROLL.idleMs
      const energy = scrolling ? Math.min(1, Math.sqrt(Math.abs(scrollVelocity) / SCROLL.velocity)) : 0
      glow = Math.max(energy, glow * Math.exp(-elapsed / SCROLL.glowDecayMs))
      if (glow < 0.002) glow = 0
      const lean = -Math.sign(scrollVelocity) * SCROLL.lean * energy
      for (let index = 0; index < stickers.length; index++) {
        const sticker = stickers[index]
        const rect = rects[index]
        if (!isVisible(rect)) continue
        const ly = clamp((rect.top + rect.height / 2) / height * 2 - 1)
        sticker.targetLx = clamp(SCROLL.lampX + ly * SCROLL.sweep)
        sticker.targetLy = ly
        sticker.targetY = lean
        sticker.targetActivity = glow
      }

      // A nearby cursor takes its icon's light over.
      const claimed = pointer ? findTarget(pointer, rects) : undefined
      if (claimed) {
        const { sticker, dx, dy, distance, proximity } = claimed
        // The tilt grows with the offset, holds, then eases back flat toward the
        // edge of the reach; the shine fades over its outer half. A press stays lit.
        const rise = Math.sin(Math.min(1, proximity / MATERIAL.tiltRise) * Math.PI / 2)
        const amplitude = press ? rise : rise * (1 - smoothstep(MATERIAL.tiltFade, 1, proximity))
        sticker.targetX = sticker.targetLx = (distance ? dx / distance : 0) * amplitude
        sticker.targetY = sticker.targetLy = (distance ? dy / distance : 0) * amplitude
        sticker.targetActivity = Math.max(glow, press ? 1 : 1 - smoothstep(MATERIAL.shineFade, 1, proximity))
      }
      return scrolling || glow > 0
    }

    const draw = (now: number) => {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 1000 / 60
      lastFrame = now
      // Read geometry before writing material variables; held touches keep
      // their own icon while the native page moves underneath them.
      const scrolling = updateTargets(now, elapsed)

      let settled = true
      for (const sticker of stickers) {
        const { targetX, targetY, targetLx, targetLy, targetActivity } = sticker
        if (sticker.x === targetX && sticker.y === targetY && sticker.lx === targetLx &&
            sticker.ly === targetLy && sticker.activity === targetActivity) continue

        const settling = targetActivity < sticker.activity
        const blend = 1 - Math.exp(-elapsed / (settling ? SETTLE_MS : FOLLOW_MS))
        sticker.x += (targetX - sticker.x) * blend
        sticker.y += (targetY - sticker.y) * blend
        sticker.lx += (targetLx - sticker.lx) * blend
        sticker.ly += (targetLy - sticker.ly) * blend
        sticker.activity += (targetActivity - sticker.activity) * blend
        const atRest = Math.abs(targetX - sticker.x) + Math.abs(targetY - sticker.y) +
          Math.abs(targetLx - sticker.lx) + Math.abs(targetLy - sticker.ly) +
          Math.abs(targetActivity - sticker.activity) < 0.001
        if (atRest) {
          sticker.x = targetX
          sticker.y = targetY
          sticker.lx = targetLx
          sticker.ly = targetLy
          sticker.activity = targetActivity
        }
        else settled = false

        const { x, y, lx, ly, element } = sticker
        setStickerLight(element, lx, ly, sticker.activity)
        element.style.setProperty("--sticker-rx", `${-y * MATERIAL.tilt}deg`)
        element.style.setProperty("--sticker-ry", `${x * MATERIAL.tilt}deg`)
        element.style.setProperty("--sticker-x", `${x * MATERIAL.travelX}px`)
        element.style.setProperty("--sticker-y", `${y * MATERIAL.travelY}px`)
      }

      frame = settled && !scrolling ? 0 : requestAnimationFrame(draw)
      if (!frame) lastFrame = 0
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
      const target = findTarget(position, measure(), true)
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
    const scroll = () => {
      const now = performance.now()
      const y = window.scrollY
      if (lastScrollAt) scrollVelocity = (y - scrollY) / Math.max(1, now - lastScrollAt)
      scrollY = y
      lastScrollAt = now
      // The mouse sits still while the page moves beneath it: its icon passes to
      // the scroll light until a real pointer movement returns.
      if (!press) pointer = null
      if (inView) schedule()
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
      scrollY = window.scrollY
      scrollVelocity = 0
      lastScrollAt = 0
      glow = 0
      stickers.forEach(sticker => {
        sticker.x = sticker.y = sticker.lx = sticker.ly = sticker.activity = 0
        sticker.targetX = sticker.targetY = sticker.targetLx = sticker.targetLy = sticker.targetActivity = 0
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
