import { effect, frame, init, surface, type Effect, type Gpu, type Surface } from "vgpu"
import foil from "./blob-foil.wgsl"

// Scroll steers the tilted material and its lamp together. The live SVG path
// clips the foil; illustrations remain in their existing independent layer.
type BlobSurface = {
  canvas: HTMLCanvasElement
  svg: SVGSVGElement
  shared: boolean
  travel?: number
  output?: Surface
  shader?: Effect
}

export type BlobFoilRenderer = {
  ready: Promise<void>
  render(progress: number): void
  dispose(): void
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const tiltProperties = ["--blob-tilt-y", "--blob-tilt-x", "--blob-perspective"]

export function createBlobFoilRenderer(root: HTMLElement): BlobFoilRenderer {
  const blobs = Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-blob-foil]"))
    .flatMap<BlobSurface>(canvas => {
      const svg = canvas.closest("svg")
      return svg ? [{ canvas, svg, shared: canvas.dataset.blobFoil === "shared" }] : []
    })
  const desktop = window.matchMedia("(min-width: 810px)")
  let gpu: Gpu | undefined
  let initialized = false
  let disposed = false
  let visible = false
  let progress = 0
  let pendingFrame = 0
  let lastFrame = 0
  let removeGpuError = () => {}

  function requestDraw() {
    if (!disposed && initialized && visible && !document.hidden && !pendingFrame) {
      pendingFrame = requestAnimationFrame(draw)
    }
  }

  function draw(now: number) {
    pendingFrame = 0
    if (disposed || !gpu || !visible || document.hidden) return
    const shared = desktop.matches
    const viewportHeight = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const blend = 1 - Math.exp(-10.5 * (lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 1 / 60))
    lastFrame = now
    // Measure the stable slot and untransformed SVG dimensions so the tilt
    // cannot feed back into lighting or continually reallocate the GPU texture.
    const visibleBlobs = blobs.filter(blob => blob.shared === shared).map(blob => ({
      blob,
      rect: (blob.svg.parentElement ?? blob.svg).getBoundingClientRect(),
      width: blob.svg.clientWidth,
      height: blob.svg.clientHeight,
    })).filter(({ rect }) => rect.width > 0 && rect.height > 0 &&
      rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < window.innerWidth)

    if (!visibleBlobs.length) { lastFrame = 0; return }
    let settling = false
    try {
      for (const { blob, rect, width: layoutWidth, height: layoutHeight } of visibleBlobs) {
        const width = Math.max(1, Math.round(layoutWidth * dpr))
        const height = Math.max(1, Math.round(layoutHeight * dpr))
        if (blob.output!.size[0] !== width || blob.output!.size[1] !== height) {
          blob.output!.resize([width, height])
        }
        // The shared desktop blob follows timeline travel. On mobile, each
        // card's own blob catches the light as its illustration moves on screen.
        const target = blob.shared ? progress : clamp(
          (viewportHeight * 0.9 - (rect.top + rect.height / 2)) / (viewportHeight * 0.75),
        )
        let travel = blob.travel ?? target
        travel += (target - travel) * blend
        if (Math.abs(target - travel) > 0.0005) settling = true
        else travel = target
        blob.travel = travel
        const yaw = (travel - 0.5) * 0.32
        const pitch = (0.5 - travel) * 0.24
        blob.svg.style.setProperty("--blob-tilt-y", `${yaw}rad`)
        blob.svg.style.setProperty("--blob-tilt-x", `${pitch}rad`)
        blob.svg.style.setProperty("--blob-perspective", `${Math.max(1, layoutHeight) * 2.25}px`)
        blob.shader!.set({ params: {
          resolution: blob.output!.size,
          tilt: [yaw, pitch],
          pointer: [-1.15 + travel * 2.3, -0.7 + travel * 1.4],
          intensity: 0.95,
        } })
      }
      frame(gpu, current => visibleBlobs.forEach(({ blob }) => current.pass(blob.output!, blob.shader!)))
      visibleBlobs.forEach(({ blob }) => { blob.canvas.style.opacity = "1" })
    } catch {
      dispose()
    }
    // Only finish the short eased settle; there is no autonomous light loop.
    if (settling) requestDraw()
    else lastFrame = 0
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) requestDraw()
    else { cancelAnimationFrame(pendingFrame); pendingFrame = 0; lastFrame = 0 }
  })
  observer.observe(root)
  const resizeObserver = new ResizeObserver(requestDraw)
  blobs.forEach(blob => resizeObserver.observe(blob.svg))

  function onVisibility() {
    if (document.hidden) { cancelAnimationFrame(pendingFrame); pendingFrame = 0; lastFrame = 0 }
    else requestDraw()
  }

  window.addEventListener("scroll", requestDraw, { passive: true })
  window.addEventListener("resize", requestDraw)
  window.addEventListener("pageshow", requestDraw)
  document.addEventListener("visibilitychange", onVisibility)

  function dispose() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(pendingFrame)
    observer.disconnect()
    resizeObserver.disconnect()
    window.removeEventListener("scroll", requestDraw)
    window.removeEventListener("resize", requestDraw)
    window.removeEventListener("pageshow", requestDraw)
    document.removeEventListener("visibilitychange", onVisibility)
    blobs.forEach(blob => {
      blob.canvas.style.removeProperty("opacity")
      tiltProperties.forEach(property => blob.svg.style.removeProperty(property))
    })
    removeGpuError()
    gpu?.dispose()
  }

  const ready = (async () => {
    const context = await init({ powerPreference: "low-power", label: "guarantee-blob-foil" })
    if (disposed) { context.dispose(); return }
    gpu = context
    removeGpuError = context.onError(dispose)
    void context.gpu.lost.then(dispose)
    for (const blob of blobs) {
      blob.output = surface(context, blob.canvas, {
        autoResize: false,
        size: [1, 1],
        alphaMode: "premultiplied",
        clearColor: [0, 0, 0, 0],
      })
      blob.shader = effect(context, foil, {
        label: "blob-holographic-foil",
        set: { params: { resolution: [600, 420], tilt: [0, 0], pointer: [0, 0], intensity: 0.95 } },
      })
    }
    await Promise.all(blobs.map(blob => blob.shader!.compile({ colors: [blob.output!.format] })))
    if (disposed) return
    initialized = true
    requestDraw()
  })().catch((error: unknown) => {
    if (disposed) return
    dispose()
    throw error
  })

  return {
    ready,
    render(value) { progress = clamp(value); requestDraw() },
    dispose,
  }
}
