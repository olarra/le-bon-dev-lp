import { mountOfferMetal } from "./offers-metal"
import { animateOfferReflection, clearOfferReflection } from "./offers-reflection"

export type OfferShimmerVariant = "original" | "metal"

// The resin sheen's 1.45 s pass, kept for the metal light (offers-metal-sweep.ts).
const METAL_DURATION = 1450

/** Play one reflection after landing, without changing the entrance or scroll. */
export function mountOfferShimmer(card: HTMLElement, variant: OfferShimmerVariant) {
  const layers = Array.from(card.querySelectorAll<HTMLElement>("[data-offers-sheen], [data-offers-rim-sheen]"))
  const forcedColors = window.matchMedia("(forced-colors: active)")
  // The diagonal reflection never creates a GPU context.
  const metal = variant === "metal" ? mountOfferMetal(card) : undefined
  let animations: Animation[] = []
  let disposed = false

  const cancel = () => {
    animations.forEach(animation => animation.cancel())
    animations = []
    metal?.cancel()
  }

  const play = () => {
    cancel()
    if (disposed || document.hidden || forcedColors.matches) return
    const bounds = card.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
    if (metal) metal.play(METAL_DURATION)
    else animations = animateOfferReflection(card, layers)
  }

  const visibility = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) cancel()
  })
  visibility.observe(card)
  let measuredWidth = card.clientWidth
  let measuredHeight = card.clientHeight
  const resize = new ResizeObserver(() => {
    const width = card.clientWidth
    const height = card.clientHeight
    if (width === measuredWidth && height === measuredHeight) return
    measuredWidth = width
    measuredHeight = height
    // A resize ends the current pass; the next play measures the new geometry.
    cancel()
  })
  resize.observe(card)
  const onVisibility = () => { if (document.hidden) cancel() }
  const onColors = () => { if (forcedColors.matches) cancel() }
  document.addEventListener("visibilitychange", onVisibility)
  forcedColors.addEventListener("change", onColors)

  return {
    play,
    cancel,
    dispose() {
      disposed = true
      cancel()
      visibility.disconnect()
      resize.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      forcedColors.removeEventListener("change", onColors)
      metal?.dispose()
      clearOfferReflection(layers)
    },
  }
}
