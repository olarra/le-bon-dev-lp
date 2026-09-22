import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import { getMorphState } from "./morph-progress"
import { createRenderer, type MorphRenderer } from "./morph-renderer"

/** Adapted from the approved POC controller; owns only this section's resources. */
export function mountGuaranteesMorph(root: HTMLElement, assets: readonly string[]) {
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)
  const find = <T extends Element>(selector: string) => {
    const element = root.querySelector<T>(selector)
    if (!element) throw new Error(`Missing guarantees element: ${selector}`)
    return element
  }
  const canvas = find<HTMLCanvasElement>("[data-guarantee-canvas]")
  const blob = find<SVGPathElement>("[data-guarantee-blob]")
  const stopA = find<SVGStopElement>("[data-stop-a]")
  const stopB = find<SVGStopElement>("[data-stop-b]")
  const fill = find<HTMLElement>("[data-guarantee-fill]")
  const shapes = Array.from(root.querySelectorAll<SVGPathElement>("[data-morph-shape]"))
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-step]"))
  const desktop = window.matchMedia("(min-width: 810px)")
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  let disposed = false
  let current = 0
  let frame = 0
  let refreshFrame = 0
  let trigger: ScrollTrigger | undefined
  let renderer: MorphRenderer | undefined
  let rendererLoad: AbortController | undefined
  let morphs: gsap.core.Tween[] = []

  // Each pair owns a separate, hidden path. Returning to a previously used
  // progress cannot leave the other pair's cached shape on the visible blob.
  const context = gsap.context(() => {
    morphs = shapes.map((path, pair) => gsap.fromTo(path,
      { morphSVG: MORPH_BLOBS[pair] },
      { morphSVG: { shape: MORPH_BLOBS[pair + 1], shapeIndex: "auto" },
        duration: 1, ease: "none", paused: true, immediateRender: false },
    ))
  }, root)
  const colors = [0, 1].map((pair) => [
    gsap.utils.interpolate(MORPH_PALETTES[pair][0], MORPH_PALETTES[pair + 1][0]),
    gsap.utils.interpolate(MORPH_PALETTES[pair][1], MORPH_PALETTES[pair + 1][1]),
  ])

  function update(value: number) {
    if (disposed) return
    const state = getMorphState(value, reduced.matches)
    current = state.progress
    morphs[state.pair].progress(state.blend)
    const path = state.blend === 0 ? MORPH_BLOBS[state.pair]
      : state.blend === 1 ? MORPH_BLOBS[state.pair + 1]
      : shapes[state.pair].getAttribute("d")!
    blob.setAttribute("d", path)
    stopA.setAttribute("stop-color", colors[state.pair][0](state.blend))
    stopB.setAttribute("stop-color", colors[state.pair][1](state.blend))
    fill.style.transform = `scaleY(${state.progress})`
    root.dataset.progress = state.progress.toFixed(4)
    root.dataset.active = String(state.active)
    steps.forEach((step, index) => {
      if (index === state.active) step.setAttribute("aria-current", "step")
      else step.removeAttribute("aria-current")
    })
    renderer?.render(state.pair, state.blend, 1)
  }

  function schedule(value: number) {
    if (disposed) return
    current = value
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(current) })
  }

  function stopRenderer() {
    rendererLoad?.abort()
    rendererLoad = undefined
    renderer?.dispose()
    renderer = undefined
    if (!disposed) root.dataset.renderer = "static"
  }

  function startRenderer() {
    stopRenderer()
    // Mobile keeps one static visual per article; reduced motion never
    // allocates a GPU scene or briefly displays a warped intermediate frame.
    if (disposed || !desktop.matches || reduced.matches) return
    const load = new AbortController()
    rendererLoad = load
    void createRenderer(canvas, assets, {
      signal: load.signal,
      onUnavailable: () => {
        if (disposed || rendererLoad !== load) return
        root.dataset.renderer = "static"
        renderer?.dispose()
        renderer = undefined
      },
    }).then((instance) => {
      if (disposed || load.signal.aborted || rendererLoad !== load) {
        instance.dispose()
        return
      }
      renderer = instance
      update(current)
      if (renderer === instance) root.dataset.renderer = "webgl"
    }).catch(() => {
      if (!disposed && rendererLoad === load) root.dataset.renderer = "static"
    })
  }

  function refresh() {
    if (disposed || refreshFrame) return
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0
      if (disposed) return
      trigger?.refresh()
      trigger?.update()
      update(trigger?.progress ?? current)
    })
  }
  function onPreference() {
    startRenderer()
    update(current)
    refresh()
  }
  function onVisibility() {
    if (document.visibilityState === "visible") refresh()
  }

  const anchor = () => desktop.matches ? "center center" : "center 70%"
  trigger = ScrollTrigger.create({
    trigger: steps[0], start: anchor,
    endTrigger: steps[steps.length - 1], end: anchor,
    onUpdate: (self) => schedule(self.progress),
    onRefresh: (self) => schedule(self.progress),
  })
  update(trigger.progress)
  startRenderer()
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : undefined
  observer?.observe(root)
  steps.forEach((step) => observer?.observe(step))
  const section = root.closest("section")
  if (section) observer?.observe(section)
  desktop.addEventListener("change", onPreference)
  reduced.addEventListener("change", onPreference)
  window.addEventListener("pageshow", refresh)
  document.addEventListener("visibilitychange", onVisibility)
  void document.fonts?.ready.then(() => { if (!disposed) refresh() })

  return () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    cancelAnimationFrame(refreshFrame)
    observer?.disconnect()
    trigger?.kill()
    stopRenderer()
    context.revert()
    desktop.removeEventListener("change", onPreference)
    reduced.removeEventListener("change", onPreference)
    window.removeEventListener("pageshow", refresh)
    document.removeEventListener("visibilitychange", onVisibility)
    // Restore the SSR state for React Strict Mode's setup/cleanup/setup.
    root.dataset.renderer = "static"
    root.dataset.active = "0"
    delete root.dataset.progress
    blob.setAttribute("d", MORPH_BLOBS[0])
    stopA.setAttribute("stop-color", MORPH_PALETTES[0][0])
    stopB.setAttribute("stop-color", MORPH_PALETTES[0][1])
    fill.style.removeProperty("transform")
    steps.forEach((step, index) => {
      if (index === 0) step.setAttribute("aria-current", "step")
      else step.removeAttribute("aria-current")
    })
  }
}
