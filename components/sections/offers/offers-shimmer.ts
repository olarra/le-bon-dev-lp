import { mountOfferMetal } from "./offers-metal"
import { animateOfferReflection, clearOfferReflection } from "./offers-reflection"

export type OfferShimmerVariant = "original" | "metal"

const METAL_DURATION = 650

/** Select one reflection after landing, without changing the entrance or scroll. */
export function mountOfferShimmer(card: HTMLElement, initialVariant: OfferShimmerVariant) {
  const layers = Array.from(card.querySelectorAll<HTMLElement>("[data-offers-sheen], [data-offers-rim-sheen]"))
  const forcedColors = window.matchMedia("(forced-colors: active)")
  let variant = initialVariant
  let metal = variant === "metal" ? mountOfferMetal(card) : undefined
  let animations: Animation[] = []
  let disposed = false
  let playRequest = 0

  const cancel = () => {
    playRequest += 1
    animations.forEach(animation => animation.cancel())
    animations = []
    metal?.cancel()
  }

  const setVariant = (next: OfferShimmerVariant) => {
    if (disposed || next === variant) return
    cancel()
    metal?.dispose()
    variant = next
    // The diagonal reflection never creates a GPU context.
    metal = variant === "metal" ? mountOfferMetal(card) : undefined
  }

  const play = (prepareMetal = false) => {
    cancel()
    if (disposed || document.hidden || forcedColors.matches) return
    const bounds = card.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
    if (variant === "metal" && metal) {
      const current = metal
      const request = playRequest
      if (prepareMetal) {
        // A first comparison should show the GPU material when available,
        // instead of racing its initialization and always selecting the fallback.
        void current.prepare().then(() => {
          if (!disposed && request === playRequest) current.play(METAL_DURATION)
        })
      } else current.play(METAL_DURATION)
    } else animations = animateOfferReflection(card, layers)
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
    // A resize ends the current pass; the next play measures the new projection.
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
    setVariant,
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
