import { effect, frame, init, surface, type Effect, type Gpu, type Surface } from "vgpu"
import foil from "./blob-foil.wgsl"
import cardFoil from "./card-foil.wgsl"
import { MOBILE_STACK_TRANSITIONS } from "./morph-progress"

// SVG clips the transparent blob foil; mobile cards render the full metal material.
type FoilSurface = {
  canvas: HTMLCanvasElement
  element: SVGSVGElement | HTMLElement
  anchor: Element
  isCard: boolean
  shared: boolean
  index: number
  cornerRadius: number
  travel?: number
  output?: Surface
  shader?: Effect
}

export type BlobFoilRenderer = {
  ready: Promise<void>
  render(): void
  dispose(): void
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const tiltProperties = ["--blob-tilt-y", "--blob-tilt-x", "--blob-perspective"]
const CARD_LIGHT_OVERSHOOT = 0.68

export function createBlobFoilRenderer(root: HTMLElement): BlobFoilRenderer {
  const desktop = window.matchMedia("(min-width: 810px)")
  const steps = Array.from(root.querySelectorAll("[data-guarantee-step]"))
  const scrollSpace = root.querySelector<HTMLElement>("[data-guarantee-scroll]")
  const surfaces = Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-blob-foil], [data-card-foil]"))
    .flatMap<FoilSurface>(canvas => {
      const isCard = canvas.hasAttribute("data-card-foil")
      const element = isCard ? canvas.closest<HTMLElement>("[data-guarantee-card]") : canvas.closest("svg")
      return element ? [{
        canvas, element, isCard,
        anchor: isCard ? element : element.parentElement ?? element,
        shared: canvas.dataset.blobFoil === "shared",
        index: steps.indexOf(canvas.closest("[data-guarantee-step]")!),
        cornerRadius: isCard ? parseFloat(getComputedStyle(element).borderTopLeftRadius) : 0,
      }] : []
    })
    // The controller recreates the renderer at breakpoint changes.
    .filter(item => item.shared === desktop.matches)
  let gpu: Gpu | undefined
  let initialized = false
  let disposed = false
  let visible = false
  let pendingFrame = 0
  let lastFrame = 0
  let removeGpuError = () => {}

  function sharedBlobTravel(viewportHeight: number) {
    const first = steps[0].getBoundingClientRect()
    const last = steps[steps.length - 1].getBoundingClientRect()
    const start = first.top + first.height / 2
    // The morph ends at the last row's centre; keep the light moving through
    // the rest of that row, until its bottom reaches the reading position.
    return clamp((viewportHeight / 2 - start) / Math.max(1, last.bottom - start))
  }

  function cardTravel(index: number, rect: DOMRect, viewportHeight: number) {
    if (root.dataset.mobileStack !== "true" || !scrollSpace) {
      // In normal flow, finish when the bottom has entered the reading area.
      return clamp((viewportHeight * 0.95 - rect.top) / (rect.height + viewportHeight * 0.3))
    }
    const lastArrival = MOBILE_STACK_TRANSITIONS[MOBILE_STACK_TRANSITIONS.length - 1].end
    const distance = parseFloat(root.style.getPropertyValue("--mobile-scroll-distance")) / lastArrival
    const top = parseFloat(root.style.getPropertyValue("--mobile-sticky-top"))
    const inset = parseFloat(root.style.getPropertyValue("--mobile-stack-inset"))
    // Use the same scroll coordinates as the stack, without clamping at its
    // end: the last reflection can fade as the completed pile scrolls away.
    const position = (top - scrollSpace.getBoundingClientRect().top) / distance
    // Keep the first card's sweep speed. For incoming cards, align the lamp
    // reaching the bottom edge with their arrival, not its exit off the metal.
    const firstStart = (top + inset - viewportHeight * 0.95) / distance
    const firstEnd = MOBILE_STACK_TRANSITIONS[0].start - 0.04
    const sweepLength = firstEnd - firstStart
    const halfHeight = 0.64 * rect.height / rect.width
    const exitFraction = CARD_LIGHT_OVERSHOOT / (2 * (halfHeight + CARD_LIGHT_OVERSHOOT))
    const end = index === 0 ? firstEnd
      : MOBILE_STACK_TRANSITIONS[index - 1].end + sweepLength * exitFraction
    const start = end - sweepLength
    return clamp((position - start) / sweepLength)
  }

  function requestDraw() {
    if (!disposed && initialized && visible && !document.hidden && !pendingFrame) {
      pendingFrame = requestAnimationFrame(draw)
    }
  }

  function draw(now: number) {
    pendingFrame = 0
    if (disposed || !gpu || !visible || document.hidden) return
    const viewportHeight = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, desktop.matches ? 2 : 1.5)
    const blend = 1 - Math.exp(-10.5 * (lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 1 / 60))
    lastFrame = now
    // Layout dimensions exclude the stack's scale and the blob's tilt, so
    // movement cannot continually reallocate the GPU texture.
    const visibleSurfaces = surfaces.map(item => ({
      item,
      rect: item.anchor.getBoundingClientRect(),
      width: item.element.clientWidth,
      height: item.element.clientHeight,
    })).filter(({ rect }) => rect.width > 0 && rect.height > 0 &&
      rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < window.innerWidth)

    if (!visibleSurfaces.length) { lastFrame = 0; return }
    let settling = false
    try {
      for (const { item, rect, width: layoutWidth, height: layoutHeight } of visibleSurfaces) {
        const width = Math.max(1, Math.round(layoutWidth * dpr))
        const height = Math.max(1, Math.round(layoutHeight * dpr))
        if (item.output!.size[0] !== width || item.output!.size[1] !== height) {
          item.output!.resize([width, height])
        }
        const target = item.isCard ? cardTravel(item.index, rect, viewportHeight)
          : item.shared ? sharedBlobTravel(viewportHeight) : clamp(
            (viewportHeight * 0.9 - (rect.top + rect.height / 2)) / (viewportHeight * 0.75),
          )
        let travel = item.travel ?? target
        if (item.isCard && root.dataset.mobileStack === "true") {
          // Follow the cards directly, without a separate delayed catch-up.
          travel = target
        } else {
          travel += (target - travel) * blend
          if (item.isCard) travel = Math.max(target - 0.045, Math.min(target + 0.045, travel))
        }
        if (Math.abs(target - travel) > 0.0005) settling = true
        else travel = target
        item.travel = travel
        const yaw = (travel - 0.5) * 0.32
        const pitch = (0.5 - travel) * 0.24
        // Cards keep their stack alignment; their material still reflects
        // the moving lamp and changing normal in the shader.
        if (!item.isCard) {
          item.element.style.setProperty("--blob-tilt-y", `${yaw}rad`)
          item.element.style.setProperty("--blob-tilt-x", `${pitch}rad`)
          item.element.style.setProperty("--blob-perspective", `${Math.max(1, layoutHeight) * 2.25}px`)
        }
        item.shader!.set({ params: {
          resolution: item.output!.size,
          tilt: [yaw, pitch],
          // A card spans ±0.64 horizontally. Continue beyond its actual height
          // so the reflection crosses the lower corners and fades off the metal.
          pointer: item.isCard
            ? [(travel - 0.5) * 0.48, (travel * 2 - 1) * (0.64 * layoutHeight / layoutWidth + CARD_LIGHT_OVERSHOOT)]
            : [-1.15 + travel * 2.3, -0.7 + travel * 1.4],
          intensity: 0.95,
          ...(item.isCard ? { radius: item.cornerRadius * 1.28 / layoutWidth } : {}),
        } })
      }
      frame(gpu, current => visibleSurfaces.forEach(({ item }) => current.pass(item.output!, item.shader!)))
      visibleSurfaces.forEach(({ item }) => { item.canvas.style.opacity = "1" })
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
  surfaces.forEach(item => resizeObserver.observe(item.element))

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
    surfaces.forEach(item => {
      item.canvas.style.removeProperty("opacity")
      tiltProperties.forEach(property => item.element.style.removeProperty(property))
    })
    removeGpuError()
    gpu?.dispose()
  }

  const ready = (async () => {
    const context = await init({ powerPreference: "low-power", label: "guarantee-foil" })
    if (disposed) { context.dispose(); return }
    gpu = context
    removeGpuError = context.onError(dispose)
    void context.gpu.lost.then(dispose)
    for (const item of surfaces) {
      item.output = surface(context, item.canvas, {
        autoResize: false,
        size: [1, 1],
        alphaMode: "premultiplied",
        clearColor: [0, 0, 0, 0],
      })
      const metal = parseInt(getComputedStyle(item.element).getPropertyValue("--metal-base").trim().slice(1) || "122219", 16)
      item.shader = effect(context, item.isCard ? cardFoil : foil, {
        label: item.isCard ? "holographic-guarantee-card" : "holographic-foil",
        set: { params: {
          resolution: [600, 420], tilt: [0, 0], pointer: [0, 0], intensity: 0.95,
          ...(item.isCard ? { material: [(metal >> 16 & 255) / 255, (metal >> 8 & 255) / 255, (metal & 255) / 255], radius: 0.1 } : {}),
        } },
      })
    }
    await Promise.all(surfaces.map(item => item.shader!.compile({ colors: [item.output!.format] })))
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
    render: requestDraw,
    dispose,
  }
}
