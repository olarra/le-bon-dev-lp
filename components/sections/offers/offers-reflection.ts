/** A diagonal reflection sized in card pixels, with one clock for face and rim. */
const REFLECTION = {
  angle: 55, // Normal to the highlight: the visible band lies 35° above horizontal.
  fieldWidth: 0.44,
  millisecondsPerWidth: 780,
  minimumDuration: 1600,
  edgeMargin: 4,
  ease: "cubic-bezier(.42,0,.58,1)",
} as const

const GEOMETRY_PROPERTIES = ["width", "height", "margin-left", "margin-top"] as const

export function animateOfferReflection(card: HTMLElement, layers: readonly HTMLElement[]) {
  // Layout dimensions exclude the scale used by the entrance animation.
  const width = card.clientWidth
  const height = card.clientHeight
  if (!width || !height) return []

  const radians = REFLECTION.angle * Math.PI / 180
  const nx = Math.cos(radians)
  const ny = Math.sin(radians)
  const field = width * REFLECTION.fieldWidth
  const length = width * ny + height * nx + REFLECTION.edgeMargin * 2
  // Project all four corners onto the light's normal, then clear the whole band.
  const reach = (width * nx + height * ny + field) / 2 + REFLECTION.edgeMargin
  const duration = Math.max(REFLECTION.minimumDuration, REFLECTION.millisecondsPerWidth * reach * 2 / width)
  const pose = (distance: number) => `translate3d(${nx * distance}px, ${ny * distance}px, 0) rotate(${REFLECTION.angle}deg)`
  const startTime = document.timeline.currentTime

  return layers.flatMap(layer => {
    layer.style.width = `${field}px`
    layer.style.height = `${length}px`
    layer.style.marginLeft = `${-field / 2}px`
    layer.style.marginTop = `${-length / 2}px`

    const movement = layer.animate([
      { transform: pose(-reach) },
      { transform: pose(reach) },
    ], { duration, easing: REFLECTION.ease, fill: "none" })

    // Opacity uses real elapsed time; the travel easing must not compress its fade.
    const light = layer.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.06 },
      { opacity: 1, offset: 0.9 },
      { opacity: 0, offset: 1 },
    ], { duration, easing: "linear", fill: "none" })

    // Both layers and both properties share the document timeline's same frame.
    movement.startTime = light.startTime = startTime
    return [movement, light]
  })
}

export function clearOfferReflection(layers: readonly HTMLElement[]) {
  for (const layer of layers) {
    for (const property of GEOMETRY_PROPERTIES) layer.style.removeProperty(property)
  }
}
