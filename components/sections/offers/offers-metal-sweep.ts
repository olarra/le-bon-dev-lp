/** The light's pass over the card, after the resin sheen of commit 751e86b:
 * a tall band leaning 45° that glides from left to right, in card-width units. */
export const SWEEP = {
  lean: 45, // degrees from vertical, leaning like "/" (also set in blob-foil.wgsl)
  margin: 0.25, // beyond the corners where the band starts and ends, in card widths
  ease: [0.28, 0.1, 0.28, 1], // cubic-bezier of the travel, as the CSS sheen
  fadeIn: 0.12, // share of the pass over which the light brightens
  fadeOut: 0.82, // share after which it dims to nothing
} as const

export type OfferSweep = {
  axis: readonly [number, number]
  tall: number
  start: number
  travel: number
  duration: number
}

/** A 45° band through the card centre spans half the card height on each side
 * horizontally, so the travel grows with the card's height: the wipe still runs
 * from the upper-left corner to the lower-right one within the same duration. */
export function measureOfferSweep(width: number, height: number, duration: number): OfferSweep {
  const radians = SWEEP.lean * Math.PI / 180
  const tall = height / width
  const reach = tall / 2 * Math.tan(radians) + SWEEP.margin
  return { axis: [Math.sin(radians), -Math.cos(radians)], tall, start: -reach, travel: 1 + 2 * reach, duration }
}

/** Cubic-bezier timing function, as CSS defines it. */
function bezier(t: number, [x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const at = (s: number, a: number, b: number) => 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s
  let low = 0
  let high = 1
  let s = t
  for (let i = 0; i < 24; i++) {
    s = (low + high) / 2
    if (at(s, x1, x2) < t) low = s
    else high = s
  }
  return at(s, y1, y2)
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function sweepTravel(progress: number) {
  return bezier(clamp(progress), SWEEP.ease)
}

export function sweepCenter(sweep: OfferSweep, travel: number): readonly [number, number] {
  return [sweep.start + sweep.travel * travel, sweep.tall / 2]
}

/** Brightens over the first 12 %, holds, then dims over the last 18 %, each on the same curve. */
export function sweepLight(progress: number) {
  const p = clamp(progress)
  if (p < SWEEP.fadeIn) return bezier(p / SWEEP.fadeIn, SWEEP.ease)
  if (p < SWEEP.fadeOut) return 1
  return 1 - bezier((p - SWEEP.fadeOut) / (1 - SWEEP.fadeOut), SWEEP.ease)
}
