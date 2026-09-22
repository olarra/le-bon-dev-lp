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

/** On mobile, each morph finishes as the incoming card reaches its stack. */
export function getStackMorphState(value: number, reducedMotion = false) {
  return stateForWindows(value, reducedMotion, [0.25, 0.75], 0.25)
}
