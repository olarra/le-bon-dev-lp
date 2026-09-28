"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

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

const MATERIAL_PROPERTIES = [
  "--sticker-foil-angle", "--sticker-foil-x", "--sticker-foil-y",
  "--sticker-gloss-x", "--sticker-gloss-y", "--sticker-gloss-angle",
  "--sticker-rx", "--sticker-ry",
  "--sticker-x", "--sticker-y",
  "--sticker-activity",
] as const

/** Track the whole section, but animate only the nearest sticker in its own coordinates. */
export function StickerSurface({ children, ...props }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    // Measure the stationary wrapper, never its transformed artwork.
    const stickers = Array.from(section.querySelectorAll<HTMLElement>("[data-metal-sticker]"), element => ({
      element, x: 0, y: 0, activity: 0, targetX: 0, targetY: 0, targetActivity: 0,
    }))
    if (!stickers.length) return

    const interactive = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    let frame = 0
    let lastFrame = 0
    let pointer: { x: number; y: number } | null = null
    let pointerChanged = false

    const updateTargets = () => {
      stickers.forEach(sticker => { sticker.targetX = sticker.targetY = sticker.targetActivity = 0 })
      if (!pointer) return

      const sectionRect = section.getBoundingClientRect()
      if (pointer.x < sectionRect.left || pointer.x > sectionRect.right ||
          pointer.y < sectionRect.top || pointer.y > sectionRect.bottom) return

      let nearest: typeof stickers[number] | undefined
      let distance: number = MATERIAL.reactionRadius
      let localX = 0
      let localY = 0

      for (const sticker of stickers) {
        const rect = sticker.element.getBoundingClientRect()
        const dx = pointer.x - (rect.left + rect.width / 2)
        const dy = pointer.y - (rect.top + rect.height / 2)
        const candidateDistance = Math.hypot(dx, dy)
        if (candidateDistance < distance) {
          nearest = sticker
          distance = candidateDistance
          localX = dx
          localY = dy
        }
      }
      if (!nearest) return

      // Full response close by, then a soft falloff at the wide area's edge.
      const fade = Math.max(0, (distance - MATERIAL.fadeStart) / (MATERIAL.reactionRadius - MATERIAL.fadeStart))
      const influence = 1 - fade * fade * (3 - 2 * fade)
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
      const blend = 1 - Math.exp(-elapsed / MATERIAL.smoothingMs)
      lastFrame = now
      let settled = true
      for (const sticker of stickers) {
        if (sticker.x === sticker.targetX && sticker.y === sticker.targetY && sticker.activity === sticker.targetActivity) continue

        sticker.x += (sticker.targetX - sticker.x) * blend
        sticker.y += (sticker.targetY - sticker.y) * blend
        sticker.activity += (sticker.targetActivity - sticker.activity) * blend
        const atRest = Math.abs(sticker.targetX - sticker.x) + Math.abs(sticker.targetY - sticker.y) +
          Math.abs(sticker.targetActivity - sticker.activity) < 0.001
        if (atRest) {
          sticker.x = sticker.targetX
          sticker.y = sticker.targetY
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
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const leave = () => { pointer = null; schedule() }
    const layoutChanged = () => { if (pointer) schedule() }

    const reset = () => {
      section.removeEventListener("pointermove", move)
      section.removeEventListener("pointerleave", leave)
      section.removeEventListener("pointercancel", leave)
      window.removeEventListener("scroll", layoutChanged)
      window.removeEventListener("resize", layoutChanged)
      window.removeEventListener("blur", leave)
      cancelAnimationFrame(frame)
      frame = lastFrame = 0
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
      section.addEventListener("pointermove", move, { passive: true })
      section.addEventListener("pointerleave", leave)
      section.addEventListener("pointercancel", leave)
      window.addEventListener("scroll", layoutChanged, { passive: true })
      window.addEventListener("resize", layoutChanged, { passive: true })
      window.addEventListener("blur", leave)
    }

    syncInputMode()
    interactive.addEventListener("change", syncInputMode)
    return () => {
      interactive.removeEventListener("change", syncInputMode)
      reset()
    }
  }, [])

  return (
    <section {...props} ref={ref}>
      {children}
    </section>
  )
}
