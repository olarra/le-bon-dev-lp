import { effect, frame, init, surface, type Effect, type Gpu, type Surface } from "vgpu"
// Reuse the blob light with its smooth green finish selected for the offers.
import foil from "../guarantees-timeline/blob-foil.wgsl"

export type OfferMetalRenderer = ReturnType<typeof createOfferMetalRenderer>

/** One transparent surface, drawn only while its owner advances the sweep. */
export function createOfferMetalRenderer(canvas: HTMLCanvasElement, card: HTMLElement, onFailure: () => void) {
  let gpu: Gpu | undefined
  let output: Surface | undefined
  let shader: Effect | undefined
  let initialized = false
  let disposed = false
  let needsMeasure = true
  let removeGpuError = () => {}

  const resized = () => { needsMeasure = true }
  const resizeObserver = new ResizeObserver(resized)
  resizeObserver.observe(card)
  window.addEventListener("resize", resized)

  function dispose() {
    if (disposed) return
    disposed = true
    initialized = false
    resizeObserver.disconnect()
    window.removeEventListener("resize", resized)
    removeGpuError()
    gpu?.dispose()
  }

  function fail() {
    if (disposed) return
    dispose()
    onFailure()
  }

  function render(travel: number, intensity: number) {
    if (disposed || !initialized || !gpu || !output || !shader) return false
    try {
      if (needsMeasure) {
        // Layout sizes ignore the entrance scale, avoiding texture reallocations
        // while the card recedes. Bound resolution on long mobile cards as well.
        const width = Math.max(1, card.clientWidth)
        const height = Math.max(1, card.clientHeight)
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_500_000 / (width * height)))
        output.resize([Math.max(1, Math.round(width * dpr)), Math.max(1, Math.round(height * dpr))])
        needsMeasure = false
      }
      // Retain the blob's lamp path and reflection, with no engraved pattern.
      shader.set({ params: {
        resolution: output.size,
        tilt: [(travel - 0.5) * 0.32, (0.5 - travel) * 0.24],
        pointer: [-1.15 + travel * 2.3, -0.7 + travel * 1.4],
        intensity: 0.95 * intensity,
        engraving: 0,
        green: 1,
        spread: 0.42,
      } })
      frame(gpu, current => current.pass(output!, shader!))
      return true
    } catch {
      fail()
      return false
    }
  }

  const ready = (async () => {
    const context = await init({ powerPreference: "low-power", label: "offer-metal" })
    if (disposed) { context.dispose(); return false }
    gpu = context
    removeGpuError = context.onError(fail)
    void context.gpu.lost.then(fail)
    output = surface(context, canvas, {
      autoResize: false,
      size: [1, 1],
      alphaMode: "premultiplied",
      clearColor: [0, 0, 0, 0],
    })
    shader = effect(context, foil, {
      label: "offer-green-metal",
      set: { params: {
        resolution: [1, 1], tilt: [0, 0], pointer: [-1.15, -0.7],
        intensity: 0, engraving: 0, green: 1, spread: 0.42,
      } },
    })
    await shader.compile({ colors: [output.format] })
    if (disposed) return false
    initialized = true
    return true
  })().catch((error: unknown) => {
    if (disposed) return false
    fail()
    throw error
  })

  return { ready, render, dispose }
}
