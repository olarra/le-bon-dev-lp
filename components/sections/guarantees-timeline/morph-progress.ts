export type MorphPair = 0 | 1

function stateForWindows(value: number, reducedMotion: boolean, starts: [number, number], duration: number) {
  const progress = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
  const pair: MorphPair = progress < 0.5 ? 0 : 1
  const t = Math.max(0, Math.min(1, (progress - starts[pair]) / duration))
  const local = t * t * (3 - 2 * t)
  const next = local >= 0.5 ? 1 : 0
  return { progress, pair, active: pair + next, blend: reducedMotion ? next : local }
}

/** The approved POC's reading plateaus and smooth transition windows. */
export function getMorphState(value: number, reducedMotion = false) {
  return stateForWindows(value, reducedMotion, [0.18, 0.64], 0.20)
}

/** Each card beneath the top of the pile recedes by this much per covering card. */
export const MOBILE_STACK_DEPTH_SCALE = 0.08

export type StackGeometry = {
  /** Scroll between two consecutive cards pinning: card height plus the flow gap. */
  entryDistance: number
  /** Whole scroll range of the pile, from the first pin to the last one plus any tail. */
  distance: number
  cardCount: number
}

/** Sticky cards in normal flow: a card's arrival follows the scroll linearly
 * from the previous card's pin to its own, and every card beneath it recedes
 * from its top edge by the same amount. Nothing depends on earlier frames. */
export function getStackState(value: number, { entryDistance, distance, cardCount }: StackGeometry) {
  const progress = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
  const count = Number.isInteger(cardCount) && cardCount > 0 ? cardCount : 0
  const scroll = progress * Math.max(0, distance)
  const spacing = Math.max(1, entryDistance)
  const arrivals = Array.from({ length: count }, (_, index) => index === 0
    ? 1
    : Math.max(0, Math.min(1, (scroll - (index - 1) * spacing) / spacing)))
  const scales = arrivals.map((_, index) => 1 - MOBILE_STACK_DEPTH_SCALE
    * arrivals.slice(index + 1).reduce((depth, arrival) => depth + arrival, 0))
  const active = Math.max(0, arrivals.filter(arrival => arrival >= 0.5).length - 1)
  return { progress, arrivals, scales, active }
}
