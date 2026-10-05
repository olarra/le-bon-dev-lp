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

  function render(center: readonly [number, number], travel: number, light: number) {
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
      // The measured path is in card-width units; the shader's frame spans
      // ±1 over the height. The normal rocks as on the blobs, and the lamp is
      // placed by inverting that projection so the light follows the path.
      const aspect = output.size[0] / output.size[1]
      const lightCenter = [(center[0] - 0.5) * 2 * aspect, (center[1] * aspect - 0.5) * 2]
      const tilt = [(travel - 0.5) * 0.32, (0.5 - travel) * 0.24]
      const sx = Math.sin(tilt[1]), cx = Math.cos(tilt[1]), sy = Math.sin(tilt[0]), cy = Math.cos(tilt[0])
      const px = (lightCenter[0] + 1.2 * sy) / cy
      const py = (lightCenter[1] - px * sy * sx - 1.2 * cy * sx) / cx
      shader.set({ params: {
        resolution: output.size,
        tilt,
        pointer: [px, py],
        intensity: 0.95 * light,
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
        resolution: [1, 1], tilt: [0, 0], pointer: [-10, -10],
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
