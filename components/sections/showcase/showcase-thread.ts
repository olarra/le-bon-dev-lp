import type { ScrollPathCompletion, ScrollPathLayout } from "@/components/ui/svg-follow-scroll"

/** Finish the tail as the monitor approaches the viewport's reading centre. */
export const THREAD_COMPLETION = {
  anchorIndex: 1,
  viewportLine: 0.65,
  duration: 0.9,
  ease: "power2.out",
} satisfies ScrollPathCompletion

/** The devices anchor the desktop thread and the two shorter mobile curves.
 * All Y coordinates are ordered, allowing the drawing tip to track scroll. */
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
    return `M ${mx(0.82)} ${miau.y - 24}
      C ${mx(0.95)} ${miau.y - 8} ${mx(0.88)} ${miau.y + miau.height * 0.12} ${mx(0.68)} ${miau.y + miau.height * 0.2}
      C ${mx(0.56)} ${miau.y + miau.height * 0.4} ${mx(0.64)} ${miau.y + miau.height * 0.68} ${mx(0.45)} ${mb - miau.height * 0.04}
      C ${mx(0.4)} ${mb + miauTail * 0.18} ${mx(0.27)} ${mb + miauTail * 0.55} ${mx(0.34)} ${mb + miauTail}
      M ${sx(0.64)} ${studio.y - studioLead}
      C ${sx(0.45)} ${studio.y - studioLead * 0.6} ${sx(0.28)} ${studio.y + studio.height * 0.04} ${sx(0.4)} ${studio.y + studio.height * 0.16}
      C ${sx(0.68)} ${studio.y + studio.height * 0.4} ${sx(0.62)} ${studio.y + studio.height * 0.74} ${sx(0.4)} ${sb - studio.height * 0.05}
      C ${sx(0.32)} ${sb + studioTail * 0.18} ${sx(0.28)} ${sb + studioTail * 0.55} ${sx(0.45)} ${sb + studioTail}`
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
  mobile: "M960 680 C1140 700 1000 720 800 780 C640 850 760 910 560 980 C520 1010 360 1030 400 1060 M740 1500 C500 1510 340 1515 470 1550 C820 1610 730 1680 480 1720 C350 1740 330 1770 540 1780",
} as const
