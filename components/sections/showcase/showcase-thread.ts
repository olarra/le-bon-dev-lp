import type { ScrollPathCompletion, ScrollPathLayout } from "@/components/ui/svg-follow-scroll"

/** Finish the tail as the monitor approaches the viewport's reading centre. */
export const THREAD_COMPLETION = {
  anchorIndex: 1,
  viewportLine: 0.65,
  duration: 0.9,
  ease: "power2.out",
} satisfies ScrollPathCompletion

type Point = readonly [number, number]

/** Broad S bends with a shared vertical tangent at each turning point.
 * Alternating the points' X positions makes a visible wave, rather than a
 * diagonal. Half-span handles spread each turn across the available height. */
function roundedWave(points: readonly [Point, ...Point[]]) {
  return `M ${points[0].join(" ")} ${points.slice(1).map((point, index) => {
    const previous = points[index]
    const middleY = (previous[1] + point[1]) / 2
    return `C ${previous[0]} ${middleY}, ${point[0]} ${middleY}, ${point.join(" ")}`
  }).join(" ")}`
}

/** The devices anchor the desktop wave and the two shorter mobile curves.
 * Control points descend in Y, allowing the drawing tip to track scroll. */
export function buildShowcaseThread({ width: w, height: h, anchors: [miau, studio], compact }: ScrollPathLayout) {
  if (!miau || !studio) return ""
  const mb = miau.y + miau.height
  const sb = studio.y + studio.height
  const gap = Math.max(0, studio.y - mb)
  if (compact) {
    const mx = (fraction: number) => miau.x + miau.width * fraction
    const sx = (fraction: number) => studio.x + studio.width * fraction
    const miauTail = Math.min(48, gap * 0.25)
    const studioLead = Math.min(24, gap * 0.25)
    const studioTail = Math.min(56, Math.max(0, h - sb) * 0.65)
    // Leave the stacked copy clear: each subpath stays around its artwork,
    // with short curved entrances and exits inside the content width.
    return [
      `M ${mx(0.82)} ${miau.y - 24}
       C ${mx(1.02)} ${miau.y + miau.height * 0.28},
         ${mx(0.68)} ${mb - miau.height * 0.08},
         ${mx(0.34)} ${mb + miauTail}`,
      `M ${sx(0.64)} ${studio.y - studioLead}
       C ${sx(0.16)} ${studio.y + studio.height * 0.2},
         ${sx(0.14)} ${studio.y + studio.height * 0.78},
         ${sx(0.45)} ${sb + studioTail}`,
    ].join(" ")
  }
  // Bow left above the phones, swing right behind them, then round back left
  // beneath the phones toward the monitor. The turn starts before the devices'
  // bottom edge so the exposed stroke is already curving through the gap.
  return roundedWave([
    [w + 24, 0],
    [miau.x + miau.width * 0.45, miau.y + miau.height * 0.18],
    [miau.x + miau.width * 0.94, miau.y + miau.height * 0.72],
    [studio.x + studio.width * 0.32, studio.y + studio.height * 0.5],
    [-24, h - 12],
  ])
}

// Approximate normalized routes for SSR/no-JS; JS measures the actual artwork.
export const THREAD_FALLBACK = {
  viewBox: "0 0 1200 1800",
  desktop: roundedWave([[1224, 0], [819, 539], [1123, 836], [252, 1400], [-24, 1788]]),
  mobile: [
    "M 960 680 C 1180 810, 820 990, 400 1060",
    "M 740 1500 C 200 1560, 180 1700, 540 1780",
  ].join(" "),
} as const
