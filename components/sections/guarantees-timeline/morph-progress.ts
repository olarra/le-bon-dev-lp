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

/** Short reading gaps let a natural scroll start moving the next card sooner. */
export const MOBILE_STACK_TRANSITIONS = [
  { start: 0.06, end: 0.46 },
  { start: 0.50, end: 0.90 },
] as const

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

/** Keep the old artwork through the beginning of an arrival, then morph with it. */
export function getStackMorphState(value: number, reducedMotion = false) {
  const progress = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
  const localProgress = MOBILE_STACK_TRANSITIONS.map(({ start, end }) => (progress - start) / (end - start))
  const arrivals = localProgress.map((value) => Math.max(0, Math.min(1, value))) as [number, number]
  const pair: MorphPair = progress < 0.5 ? 0 : 1
  const blend = smoothstep((localProgress[pair] - 0.55) / 0.45)
  const next = blend >= 0.5 ? 1 : 0

  return { progress, pair, active: pair + next, blend: reducedMotion ? next : blend, arrivals }
}
