export const MOBILE_STACK_SPACING = {
  top: 96,
  headingToArt: 20,
  artToCard: 24,
  layer: 16,
  bottom: 24,
} as const

type Measurements = {
  viewportHeight: number
  introHeight: number
  titleHeight: number
  cardHeight: number
  cardCount: number
}

/** Keep readable text at its natural size; spend only the remaining height
 * on artwork. If even the compact composition cannot fit, use normal flow. */
export function fitMobileStack(measurements: Measurements) {
  const { viewportHeight, introHeight, titleHeight, cardHeight, cardCount } = measurements
  if (!Number.isInteger(cardCount) || !Object.values(measurements).every((value) => Number.isFinite(value) && value > 0)) return null
  const { top, headingToArt, artToCard, layer, bottom } = MOBILE_STACK_SPACING
  const reserved = top + headingToArt + artToCard + layer * (cardCount - 1) + cardHeight + bottom
  const preferredArt = Math.min(240, viewportHeight * 0.27)

  for (const mode of ["full", "compact"] as const) {
    const headingHeight = mode === "full" ? introHeight : titleHeight
    const artSize = Math.floor(Math.min(preferredArt, viewportHeight - reserved - headingHeight))
    if (artSize >= 140) return { mode, headingHeight, artSize }
  }
  return null
}
