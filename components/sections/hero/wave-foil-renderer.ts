import { effect, frame, init, surface, type Effect, type Gpu, type Surface } from "vgpu"
import foil from "./wave-foil.wgsl"

// Adapted from vgpu's Holographic Card. Original source and MIT license:
// /holographic-card. One device/pipeline cache serves the whole moving ribbon.
const LIGHT = { reach: 420, minReach: 220, edgeFeather: 64, fadeIn: 110, fadeOut: 240, maxDpr: 2, frameMs: 1000 / 60 }
type Pointer = { x: number; y: number }
type Card = {
  canvas: HTMLCanvasElement
  origin: HTMLElement
  xAxis: HTMLElement
  yAxis: HTMLElement
  width: number
  height: number
  activity: number
  radius: number
  light: [number, number]
  direction: [number, number]
  output?: Surface
  shader?: Effect
}

/** Resolve the pointer in the card's actual rotated/scaled plane. The probes
 * work with CSS offset-path in Firefox as well as Chromium and Safari. */
function readLight(card: Card, pointer: Pointer, reach: number) {
  const origin = card.origin.getBoundingClientRect()
  const x = card.xAxis.getBoundingClientRect()
  const y = card.yAxis.getBoundingClientRect()
  const ax = x.left - origin.left, ay = x.top - origin.top
  const bx = y.left - origin.left, by = y.top - origin.top
  const determinant = ax * by - ay * bx
  if (Math.abs(determinant) < 1) return null

  const cx = origin.left + (ax + bx) / 2, cy = origin.top + (ay + by) / 2
  const rx = (Math.abs(ax) + Math.abs(bx)) / 2, ry = (Math.abs(ay) + Math.abs(by)) / 2
  if (cx + rx < 0 || cx - rx > innerWidth || cy + ry < 0 || cy - ry > innerHeight) return null

  const dx = pointer.x - origin.left, dy = pointer.y - origin.top
  const u = (dx * by - dy * bx) / determinant
  const v = (ax * dy - ay * dx) / determinant
  const width = Math.hypot(ax, ay), height = Math.hypot(bx, by)
  const distance = Math.hypot(
    Math.max(0, Math.abs(u - 0.5) - 0.5) * width,
    Math.max(0, Math.abs(v - 0.5) - 0.5) * height,
  )
  // This only fades the surface into the render loop at the field's edge.
  // The shader owns the broad pixel-level falloff, avoiding two attenuations
  // that made the light disappear before the pointer reached a card.
  const proximity = Math.min(1, Math.max(0, (reach - distance) / LIGHT.edgeFeather))
  return {
    activity: proximity * proximity * (3 - 2 * proximity),
    radius: reach * 2 / height,
    light: [(u - 0.5) * 2 * card.width / card.height, (v - 0.5) * 2] as [number, number],
    // Keep the lamp's reflection direction in screen space while the foil rotates.
    direction: [(0.72 * ax + 0.52 * ay) / width, (0.72 * bx + 0.52 * by) / height] as [number, number],
  }
}

export function createWaveFoilRenderer(canvases: HTMLCanvasElement[]) {
  const cards = canvases.flatMap<Card>(canvas => {
    const parent = canvas.parentElement
    const origin = parent?.querySelector<HTMLElement>("[data-foil-origin]")
    const xAxis = parent?.querySelector<HTMLElement>("[data-foil-x]")
    const yAxis = parent?.querySelector<HTMLElement>("[data-foil-y]")
    return origin && xAxis && yAxis ? [{
      canvas, origin, xAxis, yAxis, width: canvas.clientWidth, height: canvas.clientHeight,
      activity: 0, radius: 1, light: [0, 0], direction: [0.72, 0.52],
    }] : []
  })
  const tracks = [...new Set(canvases.flatMap(canvas => {
    const track = canvas.closest<HTMLElement>("[data-ticker]")
    return track ? [track] : []
  }))]
  const visibleTracks = new Set<HTMLElement>()
  let disposed = false
  let initialized = false
  let gpu: Gpu | undefined
  let removeGpuError = () => {}
  let pointer: Pointer | null = null
  let pressed: number | null = null
  let animationFrame = 0
  let lastFrame = 0

  const hide = () => {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
    lastFrame = 0
    cards.forEach(card => { card.activity = 0; card.canvas.style.opacity = "0" })
  }
  const requestDraw = () => {
    if (!disposed && initialized && !document.hidden && visibleTracks.size && !animationFrame) {
      animationFrame = requestAnimationFrame(draw)
    }
  }
  const nearRibbon = (position: Pointer, reach: number) => tracks.some(track => {
    if (!visibleTracks.has(track)) return false
    const rect = track.getBoundingClientRect()
    return position.x >= rect.left - reach && position.x <= rect.right + reach &&
      position.y >= rect.top - reach && position.y <= rect.bottom + reach
  })

  function draw(now: number) {
    animationFrame = 0
    if (disposed || !gpu || document.hidden || !visibleTracks.size) return
    if (lastFrame && now - lastFrame < LIGHT.frameMs - 1) { requestDraw(); return }
    const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : LIGHT.frameMs
    lastFrame = now
    const reach = Math.min(LIGHT.reach, Math.max(LIGHT.minReach, innerWidth * 0.32))
    const nearby = pointer && nearRibbon(pointer, reach) ? pointer : null
    // Read every position before writing styles. Even a stationary pointer needs
    // fresh coordinates because the ticker keeps moving beneath the light.
    const lighting = cards.map(card => nearby ? readLight(card, nearby, reach) : null)
    const lit: Card[] = []
    cards.forEach((card, index) => {
      const next = lighting[index]
      const target = next?.activity ?? 0
      const duration = target > card.activity ? LIGHT.fadeIn : LIGHT.fadeOut
      card.activity += (target - card.activity) * (1 - Math.exp(-elapsed / duration))
      if (card.activity < 0.002 && target === 0) {
        card.activity = 0
        card.canvas.style.opacity = "0"
        return
      }
      if (next && target > 0) {
        card.light = next.light
        card.direction = next.direction
        card.radius = next.radius
      }
      card.canvas.style.opacity = "1"
      card.shader?.set({ params: {
        resolution: card.output!.size, pointer: card.light,
        direction: card.direction, hover: card.activity, radius: card.radius,
      } })
      lit.push(card)
    })
    if (lit.length) {
      try {
        frame(gpu, current => lit.forEach(card => current.pass(card.output!, card.shader!)))
      } catch {
        dispose()
        return
      }
    }
    // Keep tracking the moving ribbon while a nearby pointer is stationary.
    // Outside that area, stop completely once the last reflection has faded.
    if (nearby || lit.length) requestDraw()
    else lastFrame = 0
  }

  const move = (event: PointerEvent) => {
    if (!event.isPrimary || (event.pointerType !== "mouse" && event.pointerId !== pressed)) return
    pointer = { x: event.clientX, y: event.clientY }
    requestDraw()
  }
  const down = (event: PointerEvent) => {
    if (!event.isPrimary) return
    pressed = event.pointerId
    move(event)
  }
  const leave = () => { pointer = null; pressed = null; requestDraw() }
  const up = (event: PointerEvent) => {
    if (event.pointerId === pressed) pressed = null
    if (event.pointerType !== "mouse") leave()
  }
  const out = (event: PointerEvent) => { if (!event.relatedTarget) leave() }
  const visibilityChanged = () => {
    if (document.hidden) { pointer = null; pressed = null; hide() }
    else requestDraw()
  }
  const resize = () => {
    if (disposed) return
    const dpr = Math.min(window.devicePixelRatio || 1, LIGHT.maxDpr)
    cards.forEach(card => {
      card.width = Math.max(1, card.canvas.clientWidth)
      card.height = Math.max(1, card.canvas.clientHeight)
      card.output?.resize([Math.round(card.width * dpr), Math.round(card.height * dpr)])
    })
    requestDraw()
  }
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const track = entry.target as HTMLElement
      if (entry.isIntersecting) visibleTracks.add(track)
      else visibleTracks.delete(track)
    })
    if (visibleTracks.size) requestDraw()
    else hide()
  })
  tracks.forEach(track => visibility.observe(track))
  window.addEventListener("pointermove", move, { passive: true })
  window.addEventListener("pointerdown", down, { passive: true })
  window.addEventListener("pointerup", up, { passive: true })
  window.addEventListener("pointercancel", leave, { passive: true })
  window.addEventListener("pointerout", out, { passive: true })
  window.addEventListener("blur", leave)
  window.addEventListener("scroll", requestDraw, { passive: true })
  window.addEventListener("resize", resize)
  document.addEventListener("visibilitychange", visibilityChanged)

  function dispose() {
    if (disposed) return
    disposed = true
    hide()
    visibility.disconnect()
    window.removeEventListener("pointermove", move)
    window.removeEventListener("pointerdown", down)
    window.removeEventListener("pointerup", up)
    window.removeEventListener("pointercancel", leave)
    window.removeEventListener("pointerout", out)
    window.removeEventListener("blur", leave)
    window.removeEventListener("scroll", requestDraw)
    window.removeEventListener("resize", resize)
    document.removeEventListener("visibilitychange", visibilityChanged)
    removeGpuError()
    gpu?.dispose()
  }

  const ready = (async () => {
    const context = await init({ powerPreference: "low-power", label: "hero-wave-foil" })
    if (disposed) { context.dispose(); return }
    gpu = context
    removeGpuError = context.onError(dispose)
    void context.gpu.lost.then(dispose)
    const dpr = Math.min(window.devicePixelRatio || 1, LIGHT.maxDpr)
    for (const card of cards) {
      card.output = surface(context, card.canvas, {
        // Keep texture resolution independent of the animated card pose and
        // cap it at twice its untransformed layout dimensions.
        autoResize: false,
        size: [Math.round(card.width * dpr), Math.round(card.height * dpr)],
        alphaMode: "premultiplied", clearColor: [0, 0, 0, 0],
      })
      card.shader = effect(context, foil, {
        label: "wave-holographic-foil",
        set: { params: { resolution: card.output.size, pointer: [0, 0], direction: [0.72, 0.52], hover: 0, radius: 1 } },
      })
    }
    await Promise.all(cards.map(card => card.shader!.compile({ colors: [card.output!.format] })))
    if (disposed) return
    initialized = true
    requestDraw()
  })().catch((error: unknown) => {
    if (disposed) return
    dispose()
    throw error
  })

  return { ready, dispose }
}
