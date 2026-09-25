import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { MORPH_BLOBS, MORPH_PALETTES, MOBILE_MORPH_PALETTES } from "./morph-content"
import { getMorphState, getStackMorphState, MOBILE_STACK_TRANSITIONS } from "./morph-progress"
import { createRenderer, type MorphRenderer } from "./morph-renderer"
import { fitMobileStack, MOBILE_STACK_SPACING } from "./mobile-stack-layout"

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
  const list = find<HTMLElement>("[data-guarantee-cards]")
  const scrollSpace = find<HTMLElement>("[data-guarantee-scroll]")
  const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-copy]"))
  const heading = find<HTMLElement>("[data-guarantee-heading]")
  const header = document.querySelector<HTMLElement>("header[data-scrolled]")
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
  let stackContext: gsap.Context | undefined
  let stackTimeline: gsap.core.Timeline | undefined
  let mobileStack = false
  let stickyTop = 0
  let stackDistance = 1
  const mobileProperties = [
    "--mobile-card-height", "--mobile-scene-height", "--mobile-art-size",
    "--mobile-card-padding", "--mobile-art-gap", "--mobile-sticky-top",
    "--mobile-stack-inset", "--mobile-scroll-distance",
  ]

  function resetMobileLayout() {
    mobileProperties.forEach((property) => root.style.removeProperty(property))
  }

  function configureLayout() {
    stackContext?.revert()
    stackContext = undefined
    stackTimeline = undefined
    mobileStack = false
    if (desktop.matches || reduced.matches) {
      root.dataset.mobileStack = "false"
      resetMobileLayout()
      return
    }

    // Measure natural copy at the standard padding without collapsing an
    // already-sticky scroll reservation during a resize or font refresh.
    root.style.removeProperty("--mobile-card-padding")
    const viewportHeight = Math.min(window.innerHeight, window.visualViewport?.height ?? window.innerHeight)
    // The utility bar above the header has already left by this section.
    const top = header
      ? (parseFloat(getComputedStyle(header).getPropertyValue("--header-base-offset")) || 12) + header.offsetHeight + 12
      : MOBILE_STACK_SPACING.top
    const fit = fitMobileStack({
      viewportHeight,
      viewportWidth: window.innerWidth,
      contentHeight: Math.max(...copies.map((copy) => copy.offsetHeight)),
      cardCount: steps.length,
      top,
    })
    // Keep full-sized text and a static illustration per card when space is short.
    if (!fit) {
      root.dataset.mobileStack = "false"
      resetMobileLayout()
      return
    }

    mobileStack = true
    stickyTop = fit.stickyTop
    const stackInset = fit.shadowSpace + (steps.length - 1) * fit.layerGap
    // Keep the next card just below the current card, rather than below the
    // viewport. The waiting cards form a continuous column with a 24px gap.
    // Their travel still follows the scroll one pixel at a time.
    const entryDistance = fit.cardHeight + 24
    const transitionLength = MOBILE_STACK_TRANSITIONS[0].end - MOBILE_STACK_TRANSITIONS[0].start
    stackDistance = Math.ceil(entryDistance / transitionLength)
    // Restore the last card's reading interval before the sticky scene
    // releases. This is scroll travel with a stationary stack, not padding
    // between cards or a gesture lock; the 24px card gaps stay unchanged.
    const lastArrival = MOBILE_STACK_TRANSITIONS[MOBILE_STACK_TRANSITIONS.length - 1].end
    const finalReadingDistance = Math.max(160, Math.round(fit.cardHeight / 2))
    const reservedDistance = Math.ceil(stackDistance * lastArrival) + finalReadingDistance
    const dimensions = {
      "--mobile-card-height": fit.cardHeight,
      "--mobile-scene-height": fit.sceneHeight,
      "--mobile-art-size": fit.artSize,
      "--mobile-card-padding": fit.padding,
      "--mobile-art-gap": fit.artGap,
      "--mobile-sticky-top": stickyTop,
      "--mobile-stack-inset": stackInset,
      "--mobile-scroll-distance": reservedDistance,
    }
    Object.entries(dimensions).forEach(([property, value]) => root.style.setProperty(property, `${value}px`))
    root.dataset.mobileStack = "true"

    // One normalized scroll playhead drives the real cards and the morph.
    // Empty intervals at the start, middle and end are stationary reading time.
    stackContext = gsap.context(() => {
      // Set the resting initial state outside the timeline so seeking back
      // to exactly zero keeps the incoming cards below the scene.
      gsap.set(steps, { y: (index: number) => index * entryDistance, scale: 1, transformOrigin: "50% 0" })
      stackTimeline = gsap.timeline({ paused: true }).to({}, { duration: 1 }, 0)
      MOBILE_STACK_TRANSITIONS.forEach(({ start, end }, pair) => {
        const duration = end - start
        steps.slice(pair + 1).forEach((step, index) => {
          stackTimeline!.to(step, { y: index * entryDistance, duration, ease: "none" }, start)
        })
        steps.slice(0, pair + 1).forEach((step, index) => {
          const depth = pair + 1 - index
          stackTimeline!.to(step, {
            y: -fit.layerGap * depth, scale: 1 - 0.035 * depth,
            duration, ease: (t: number) => t * t * (3 - 2 * t),
          }, start)
        })
      })
    }, root)
  }

  // Each pair owns a separate, hidden path. Returning to a previously used
  // progress cannot leave the other pair's cached shape on the visible blob.
  const context = gsap.context(() => {
    morphs = shapes.map((path, pair) => gsap.fromTo(path,
      { morphSVG: MORPH_BLOBS[pair] },
      { morphSVG: { shape: MORPH_BLOBS[pair + 1], shapeIndex: "auto" },
        duration: 1, ease: "none", paused: true, immediateRender: false },
    ))
  }, root)
  const colors = [MORPH_PALETTES, MOBILE_MORPH_PALETTES].map((palettes) => [0, 1].map((pair) => [
    gsap.utils.interpolate(palettes[pair][0], palettes[pair + 1][0]),
    gsap.utils.interpolate(palettes[pair][1], palettes[pair + 1][1]),
  ]))

  function update(value: number) {
    if (disposed) return
    const state = mobileStack ? getStackMorphState(value) : getMorphState(value, reduced.matches)
    current = state.progress
    morphs[state.pair].progress(state.blend)
    const path = state.blend === 0 ? MORPH_BLOBS[state.pair]
      : state.blend === 1 ? MORPH_BLOBS[state.pair + 1]
      : shapes[state.pair].getAttribute("d")!
    blob.setAttribute("d", path)
    const palette = colors[mobileStack ? 1 : 0][state.pair]
    stopA.setAttribute("stop-color", palette[0](state.blend))
    stopB.setAttribute("stop-color", palette[1](state.blend))
    fill.style.transform = `scaleY(${state.progress})`
    root.dataset.progress = state.progress.toFixed(4)
    root.dataset.active = String(state.active)
    steps.forEach((step, index) => {
      if (index === state.active) step.setAttribute("aria-current", "step")
      else step.removeAttribute("aria-current")
    })
    stackTimeline?.progress(state.progress, true)
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
    // Short/mobile fallback and reduced motion allocate no GPU scene.
    if (disposed || (!desktop.matches && !mobileStack) || reduced.matches) return
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
      const wasStacked = mobileStack
      configureLayout()
      if (wasStacked !== mobileStack) startRenderer()
      trigger?.refresh()
      trigger?.update()
      update(trigger?.progress ?? current)
    })
  }
  function onPreference() {
    configureLayout()
    startRenderer()
    update(current)
    refresh()
  }
  function onVisibility() {
    if (document.visibilityState === "visible") refresh()
  }

  configureLayout()
  // Measure the scroll reservation, never the sticky scene or moving cards.
  const stackStart = () => scrollSpace.getBoundingClientRect().top + window.scrollY - stickyTop
  const anchor = () => desktop.matches ? "center" : "70%"
  trigger = ScrollTrigger.create({
    trigger: list,
    start: () => mobileStack ? stackStart() : `top+=${steps[0].offsetHeight / 2} ${anchor()}`,
    end: () => mobileStack ? stackStart() + stackDistance : `bottom-=${steps[steps.length - 1].offsetHeight / 2} ${anchor()}`,
    onUpdate: (self) => schedule(self.progress),
    onRefresh: (self) => schedule(self.progress),
  })
  update(trigger.progress)
  startRenderer()
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : undefined
  observer?.observe(root)
  // Natural copy height detects text enlargement even inside a fixed-height card.
  copies.forEach((copy) => observer?.observe(copy))
  observer?.observe(heading)
  if (header) observer?.observe(header)
  const section = root.closest("section")
  if (section) observer?.observe(section)
  desktop.addEventListener("change", onPreference)
  reduced.addEventListener("change", onPreference)
  window.addEventListener("pageshow", refresh)
  window.addEventListener("resize", refresh)
  window.visualViewport?.addEventListener("resize", refresh)
  document.addEventListener("visibilitychange", onVisibility)
  void document.fonts?.ready.then(() => { if (!disposed) refresh() })

  return () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    cancelAnimationFrame(refreshFrame)
    observer?.disconnect()
    trigger?.kill()
    stackContext?.revert()
    stopRenderer()
    context.revert()
    desktop.removeEventListener("change", onPreference)
    reduced.removeEventListener("change", onPreference)
    window.removeEventListener("pageshow", refresh)
    window.removeEventListener("resize", refresh)
    window.visualViewport?.removeEventListener("resize", refresh)
    document.removeEventListener("visibilitychange", onVisibility)
    // Restore the SSR state for React Strict Mode's setup/cleanup/setup.
    root.dataset.renderer = "static"
    root.dataset.active = "0"
    root.dataset.mobileStack = "false"
    resetMobileLayout()
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
