/** Shared left-to-right surface/rim reflection for entry and CTA replay. */
export function animateOfferSheen(layers: readonly HTMLElement[], duration: number) {
  const frames: Keyframe[] = [
    { transform: "translateX(-130%) skewX(-16deg)", opacity: 0, offset: 0 },
    { opacity: 1, offset: 0.12 },
    { opacity: 1, offset: 0.82 },
    { transform: "translateX(130%) skewX(-16deg)", opacity: 0, offset: 1 },
  ]
  const options: KeyframeAnimationOptions = {
    duration,
    easing: "cubic-bezier(.28,.1,.28,1)",
    fill: "none",
  }
  return layers.map(layer => layer.animate(frames, options))
}

/** Native link interactions keep navigation intact, including touch activation. */
export function bindOfferSheenReplay(card: HTMLElement, play: () => void) {
  const link = card.querySelector<HTMLElement>("[data-offers-sheen-replay]")
  if (!link) return () => {}

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") play()
  }
  const onFocus = (event: FocusEvent) => {
    if (event.target === link) play()
  }
  link.addEventListener("pointerenter", onPointerEnter)
  link.addEventListener("click", play)
  card.addEventListener("focusin", onFocus)

  return () => {
    link.removeEventListener("pointerenter", onPointerEnter)
    link.removeEventListener("click", play)
    card.removeEventListener("focusin", onFocus)
  }
}
