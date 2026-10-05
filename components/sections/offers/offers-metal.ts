import type { OfferMetalRenderer } from "./offers-metal-renderer"
import { measureOfferSweep, sweepCenter, sweepLight, sweepTravel, type OfferSweep } from "./offers-metal-sweep"

// The CSS fallback places the same highlight inside a frame rotated to the
// light's travel: the controller supplies that frame's size and the centre.
const FINISH_PROPERTIES = ["--finish-span", "--finish-band", "--finish-length", "--finish-x", "--finish-y", "--finish-light"] as const

function placeFinish(finish: HTMLElement, width: number, height: number, sweep: OfferSweep, center: readonly [number, number], light: number) {
  const [ax, ay] = sweep.axis
  const rx = center[0] - 0.5
  const ry = center[1] - height / width / 2
  const along = rx * ax + ry * ay
  const across = -rx * ay + ry * ax
  // A square on the card diagonal still covers the card once rotated.
  const span = Math.hypot(width, height)
  finish.style.setProperty("--finish-span", `${span}px`)
  finish.style.setProperty("--finish-band", `${width * 1.4}px`)
  finish.style.setProperty("--finish-length", `${span}px`)
  finish.style.setProperty("--finish-x", `${span / 2 + along * width}px`)
  finish.style.setProperty("--finish-y", `${span / 2 + across * width}px`)
  finish.style.setProperty("--finish-light", String(light))
}

/** Prepare WebGPU near the card, then play one bounded reflection after landing. */
export function mountOfferMetal(card: HTMLElement) {
  const canvas = card.querySelector<HTMLCanvasElement>("[data-offers-metal-canvas]")!
  const finish = card.querySelector<HTMLElement>("[data-metal-finish]")!
  const forcedColors = window.matchMedia("(forced-colors: active)")
  let renderer: OfferMetalRenderer | undefined
  let preparation: Promise<void> | undefined
  let ready = false
  let disposed = false
  let frame = 0

  const cancel = () => {
    cancelAnimationFrame(frame)
    frame = 0
    delete card.dataset.offersMetal
    FINISH_PROPERTIES.forEach(property => finish.style.removeProperty(property))
  }
  const failed = () => {
    if (disposed) return
    ready = false
    // The running clock switches to the existing sticker finish on its next
    // frame. Initialization failures simply leave that finish available.
    delete card.dataset.offersMetal
  }

  const prepare = () => {
    if (preparation) return preparation
    if (disposed || forcedColors.matches || !navigator.gpu) return Promise.resolve()
    preparation = import("./offers-metal-renderer").then(async ({ createOfferMetalRenderer }) => {
      if (disposed) return
      renderer = createOfferMetalRenderer(canvas, card, failed)
      const initialized = await renderer.ready
      if (!disposed) ready = initialized
    }).catch(failed)
    return preparation
  }

  const play = (baseDuration: number) => {
    cancel()
    if (disposed || document.hidden || forcedColors.matches) return
    const bounds = card.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
    // Layout dimensions exclude the entrance scale; the path and its duration
    // follow the card actually on screen.
    const width = card.clientWidth
    const height = card.clientHeight
    if (!width || !height) return
    const sweep = measureOfferSweep(width, height, baseDuration)
    prepare()
    // Choose the renderer once per pass; late initialization waits for the next pass.
    let useGpu = ready && !!renderer
    const startedAt = performance.now()
    const draw = (now: number) => {
      frame = 0
      const progress = Math.min(1, (now - startedAt) / sweep.duration)
      if (progress >= 1) { cancel(); return }
      // The band glides left to right on the resin sheen's curve and envelope.
      const travel = sweepTravel(progress)
      const center = sweepCenter(sweep, travel)
      const light = sweepLight(progress)
      if (useGpu && ready && renderer?.render(center, travel, light)) {
        if (card.dataset.offersMetal !== "webgpu") card.dataset.offersMetal = "webgpu"
      } else {
        useGpu = false
        placeFinish(finish, width, height, sweep, center, light)
        if (card.dataset.offersMetal !== "sticker") card.dataset.offersMetal = "sticker"
      }
      frame = requestAnimationFrame(draw)
    }
    draw(startedAt)
  }

  const visibility = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) prepare()
    else cancel()
  })
  visibility.observe(card)
  const onVisibility = () => { if (document.hidden) cancel() }
  const onColors = () => { if (forcedColors.matches) cancel() }
  document.addEventListener("visibilitychange", onVisibility)
  forcedColors.addEventListener("change", onColors)

  return {
    play,
    cancel,
    dispose() {
      disposed = true
      cancel()
      visibility.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      forcedColors.removeEventListener("change", onColors)
      renderer?.dispose()
    },
  }
}
