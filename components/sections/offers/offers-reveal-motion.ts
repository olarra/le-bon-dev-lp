/** Par-dessus: tunable entry pose, scroll window and landing accents. */
export const OFFERS_REVEAL = {
  distance: 100,
  rotationX: 7,
  rotationZ: -2,
  scale: 1.025,
  perspective: 1400,
  originY: 0.8,
  startViewport: 0.65,
  endCardProgress: 0.95,
  minScrollDistance: 160,
  scrub: 0.9,
  shadow: { y: 36, blur: 58, spread: -10, alpha: 0.22 },
  settle: 1.5,
  headingClearance: 24,
  sheenDuration: 1.45,
  sheenStart: 0.999,
} as const

/** Keep the later start while preserving a usable range on tall viewports. */
export function getOfferRevealBounds(viewportHeight: number, cardHeight: number, cardOffset: number) {
  const end = viewportHeight - cardOffset - cardHeight * OFFERS_REVEAL.endCardProgress
  const start = Math.max(viewportHeight * OFFERS_REVEAL.startViewport, end + OFFERS_REVEAL.minScrollDistance)
  return { start, end }
}

/** Bound every projected corner through the descent, not just translateY.
 * Perspective's origin is aligned with the card's transform origin by the
 * controller. Order matches GSAP: translate -> rotateZ -> rotateX -> scale.
 * No layout space is inserted when the font, card height or viewport changes. */
export function fitOfferPoseDistance(width: number, height: number, clearance: number) {
  const config = OFFERS_REVEAL
  const originY = height * config.originY
  let distance: number = config.distance

  for (let step = 1; step <= 80; step++) {
    const lift = step / 80
    const rx = config.rotationX * lift * Math.PI / 180
    const rz = config.rotationZ * lift * Math.PI / 180
    const scale = 1 + (config.scale - 1) * lift
    for (const x of [-width / 2, width / 2]) {
      for (const y of [-originY, height - originY]) {
        const scaledY = y * scale
        const z = scaledY * Math.sin(rx)
        const rotatedY = x * scale * Math.sin(rz) + scaledY * Math.cos(rx) * Math.cos(rz)
        const perspective = config.perspective / (config.perspective - z)
        const limit = (rotatedY + (originY + Math.max(0, clearance)) / perspective) / lift
        distance = Math.min(distance, limit)
      }
    }
  }

  return Math.max(0, distance - 0.5) // subpixel/rounding clearance
}

/** POC gate: one pass after settling, rearmed only near the reveal's beginning. */
export function createOfferSheenGate() {
  let played = false
  return (progress: number) => {
    if (progress < 0.15) played = false
    if (played || progress < OFFERS_REVEAL.sheenStart) return false
    played = true
    return true
  }
}
