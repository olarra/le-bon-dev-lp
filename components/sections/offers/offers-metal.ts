import type { OfferMetalRenderer } from "./offers-metal-renderer"
import { clearStickerLight, setStickerLight } from "@/lib/sticker-light"

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
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
    clearStickerLight(finish)
    finish.style.removeProperty("opacity")
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

  const play = (duration: number) => {
    cancel()
    if (disposed || document.hidden || forcedColors.matches) return
    const bounds = card.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
    prepare()
    // Choose the renderer once per pass; late initialization waits for replay.
    let useGpu = ready && !!renderer
    const startedAt = performance.now()
    const draw = (now: number) => {
      frame = 0
      const progress = Math.min(1, (now - startedAt) / duration)
      if (progress >= 1) { cancel(); return }
      // Ease-out sine: reach the visible face promptly, then soften the exit.
      const travel = Math.sin(progress * Math.PI / 2)
      const intensity = smooth(progress / 0.08) * smooth((1 - progress) / 0.18)
      if (useGpu && ready && renderer?.render(travel, intensity)) {
        card.dataset.offersMetal = "webgpu"
      } else {
        useGpu = false
        setStickerLight(finish, -1 + travel * 2, -0.7 + travel * 1.4, 1)
        finish.style.opacity = String(intensity)
        card.dataset.offersMetal = "sticker"
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
    prepare,
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
