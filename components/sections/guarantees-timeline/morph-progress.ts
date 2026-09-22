export type MorphPair = 0 | 1

/** The approved POC's reading plateaus and smooth transition windows. */
export function getMorphState(value: number, reducedMotion = false) {
  const progress = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
  const pair: MorphPair = progress < 0.5 ? 0 : 1
  const start = pair === 0 ? 0.18 : 0.64
  const t = Math.max(0, Math.min(1, (progress - start) / 0.20))
  const local = t * t * (3 - 2 * t)
  const next = local >= 0.5 ? 1 : 0
  return { progress, pair, active: pair + next, blend: reducedMotion ? next : local }
}
