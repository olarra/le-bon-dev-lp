import type { ScrollPathCompletion, ScrollPathLayout } from "@/components/ui/svg-follow-scroll"

/** Finish the tail as the monitor approaches the viewport's reading centre. */
export const THREAD_COMPLETION = {
  anchorIndex: 1,
  viewportLine: 0.65,
  duration: 0.9,
  ease: "power2.out",
} satisfies ScrollPathCompletion

/** The devices are the anchors; the curve changes columns in the empty gap.
 * All Y coordinates are ordered, allowing the drawing tip to track scroll. */
export function buildShowcaseThread({ width: w, height: h, anchors: [miau, studio], compact }: ScrollPathLayout) {
  if (!miau || !studio) return ""
  const mb = miau.y + miau.height
  const sb = studio.y + studio.height
  const gap = Math.max(0, studio.y - mb)
  if (compact) {
    return `M ${w + 20} 0
      C ${w - 8} 60 ${w - 8} ${miau.y * 0.5} ${w - 8} ${miau.y - 32}
      C ${w - 8} ${miau.y + miau.height * 0.06} ${w * 0.8} ${miau.y + miau.height * 0.12} ${w * 0.68} ${miau.y + miau.height * 0.2}
      C ${w * 0.58} ${miau.y + miau.height * 0.42} ${w * 0.55} ${miau.y + miau.height * 0.72} ${w * 0.4} ${mb}
      C ${w * 0.35} ${mb + gap * 0.3} ${w * 0.2} ${studio.y - gap * 0.3} ${w * 0.42} ${studio.y + studio.height * 0.12}
      C ${w * 0.68} ${studio.y + studio.height * 0.35} ${w * 0.3} ${studio.y + studio.height * 0.8} ${w * 0.14} ${sb}
      C ${w * 0.1} ${sb + 14} 8 ${sb + 14} 8 ${sb + 32}
      C 8 ${sb + 80} 8 ${h - 48} -16 ${h - 12}`
  }
  const mx = miau.x + miau.width * 0.55
  const sx = studio.x + studio.width * 0.5
  return `M ${w + 24} 0
    C ${w - 20} 80 ${w - 24} ${miau.y * 0.72} ${mx + miau.width * 0.22} ${miau.y + miau.height * 0.14}
    C ${mx + miau.width * 0.06} ${miau.y + miau.height * 0.38} ${mx + miau.width * 0.24} ${miau.y + miau.height * 0.7} ${mx} ${mb}
    C ${mx - miau.width * 0.05} ${mb + gap * 0.38} ${sx} ${studio.y - gap * 0.38} ${sx} ${studio.y + studio.height * 0.08}
    C ${sx + studio.width * 0.12} ${studio.y + studio.height * 0.32} ${sx + studio.width * 0.18} ${studio.y + studio.height * 0.72} ${sx - studio.width * 0.04} ${sb - studio.height * 0.05}
    C ${sx - studio.width * 0.14} ${sb + (h - sb) * 0.3} ${w * 0.15} ${h - 40} -24 ${h - 12}`
}

// Approximate normalized routes for SSR/no-JS; JS measures the actual artwork.
export const THREAD_FALLBACK = {
  viewBox: "0 0 1200 1800",
  desktop: "M1224 0 C1150 100 1190 380 1020 520 C910 620 1050 840 880 990 C800 1120 360 1120 360 1240 C460 1400 440 1510 360 1580 C290 1680 180 1750 -24 1790",
  mobile: "M1190 0 C1180 450 1170 1050 1190 1800",
} as const
