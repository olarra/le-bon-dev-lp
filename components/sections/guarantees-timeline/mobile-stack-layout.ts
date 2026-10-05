export const MOBILE_STACK_SPACING = {
  top: 96,
  layerGap: 16, // each pinned card sits this far below the previous one, leaving its top edge visible
  cardGap: 24, // flow gap between cards, so one scrolled pixel moves an incoming card by one pixel
  shadowSpace: 18,
  bottom: 16,
  border: 1,
  minArtSize: 110,
  maxArtSize: 210,
  tail: 0, // extra scroll with the completed stack pinned before it leaves with the page
} as const

type Measurements = {
  viewportHeight: number
  viewportWidth: number
  contentHeight: number
  cardCount: number
  top?: number
}

/** Fit one complete card below the header. Copy keeps its measured natural
 * height; if smaller artwork and spacing are insufficient, use normal flow. */
export function fitMobileStack(measurements: Measurements) {
  const { viewportHeight, viewportWidth, contentHeight, cardCount, top = MOBILE_STACK_SPACING.top } = measurements
  if (!Number.isInteger(cardCount)
    || ![viewportHeight, viewportWidth, contentHeight, cardCount].every(value => Number.isFinite(value) && value > 0)
    || !Number.isFinite(top) || top < 0
    || viewportWidth >= viewportHeight) return null

  const { layerGap, cardGap, shadowSpace, bottom, border, minArtSize, maxArtSize } = MOBILE_STACK_SPACING
  const layersHeight = layerGap * (cardCount - 1)
  const availableCardHeight = viewportHeight - top - bottom - 2 * shadowSpace - layersHeight
  const naturalContentHeight = Math.ceil(contentHeight)
  const preferredArtSize = Math.min(maxArtSize, Math.max(160, Math.round(viewportWidth * 0.52)))

  for (const { padding, artGap } of [{ padding: 20, artGap: 8 }, { padding: 16, artGap: 8 }]) {
    const fixedCardHeight = 2 * (padding + border) + artGap + naturalContentHeight
    const artSize = Math.floor(Math.min(preferredArtSize, availableCardHeight - fixedCardHeight))
    if (artSize < minArtSize) continue

    const cardHeight = fixedCardHeight + artSize
    return {
      artSize,
      padding,
      artGap,
      cardHeight,
      // The complete pinned pile with its shadows: the last card and the
      // visible edges of the cards beneath it.
      sceneHeight: cardHeight + 2 * shadowSpace + layersHeight,
      stickyTop: top,
      layerGap,
      cardGap,
      shadowSpace,
    }
  }
  return null
}
