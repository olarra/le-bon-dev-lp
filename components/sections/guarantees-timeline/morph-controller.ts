import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import { getMorphState, getStackMorphState } from "./morph-progress"
import { createRenderer, type MorphRenderer } from "./morph-renderer"
import { fitMobileStack } from "./mobile-stack-layout"

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
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-card]"))
  const heading = find<HTMLElement>("[data-guarantee-heading]")
  const headingContent = heading.firstElementChild as HTMLElement
  const titleSlot = find<HTMLElement>("[data-guarantee-title-slot]")
  const desktop = window.matchMedia("(min-width: 810px)")
  const stackViewport = window.matchMedia("(max-width: 809.98px) and (min-height: 640px)")
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  let disposed = false
  let current = 0
  let frame = 0
  let refreshFrame = 0
  let trigger: ScrollTrigger | undefined
  let renderer: MorphRenderer | undefined
  let rendererLoad: AbortController | undefined
  let morphs: gsap.core.Tween[] = []
  let mobileStack = false
  let cardTop = 0
  let stackDistance = 1
  const mobileProperties = ["--mobile-card-height", "--mobile-intro-height", "--mobile-heading-height", "--mobile-art-size"]

  function resetMobileLayout() {
    mobileProperties.forEach((property) => root.style.removeProperty(property))
    delete root.dataset.mobileHeading
  }

  function configureLayout() {
    mobileStack = stackViewport.matches && !reduced.matches
    root.dataset.mobileStack = String(mobileStack)
    resetMobileLayout()
    if (mobileStack) {
      const height = Math.max(...cards.map((card) => card.offsetHeight))
      // Read natural text sizes, not the animated/transformed bounds. In
      // compact mode the heading column stretches through the whole scene.
      const introHeight = Array.from(headingContent.children).reduce((sum, element) => {
        const style = getComputedStyle(element)
        return sum + (element as HTMLElement).offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
      }, 0)
      const fit = fitMobileStack({
        viewportHeight: Math.min(window.innerHeight, window.visualViewport?.height ?? window.innerHeight),
        introHeight,
        titleHeight: titleSlot.offsetHeight,
        cardHeight: height,
        cardCount: cards.length,
      })
      if (!fit) {
        // Preserve text size and normal document flow when space is too short.
        mobileStack = false
        root.dataset.mobileStack = "false"
      } else {
        root.dataset.mobileHeading = fit.mode
        root.style.setProperty("--mobile-card-height", `${height}px`)
        root.style.setProperty("--mobile-intro-height", `${introHeight}px`)
        root.style.setProperty("--mobile-heading-height", `${fit.headingHeight}px`)
        root.style.setProperty("--mobile-art-size", `${fit.artSize}px`)
        cardTop = parseFloat(getComputedStyle(steps[0]).top)
        const gap = parseFloat(getComputedStyle(root).getPropertyValue("--mobile-stack-gap"))
        const rowGap = parseFloat(getComputedStyle(list).rowGap)
        stackDistance = steps.slice(0, -1).reduce((sum, step) => sum + step.offsetHeight + rowGap - gap, 0)
      }
    }
    if (!mobileStack) cards.forEach((card) => card.style.removeProperty("transform"))
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
  const colors = [0, 1].map((pair) => [
    gsap.utils.interpolate(MORPH_PALETTES[pair][0], MORPH_PALETTES[pair + 1][0]),
    gsap.utils.interpolate(MORPH_PALETTES[pair][1], MORPH_PALETTES[pair + 1][1]),
  ])

  function update(value: number) {
    if (disposed) return
    const state = mobileStack ? getStackMorphState(value) : getMorphState(value, reduced.matches)
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
    if (mobileStack) cards.forEach((card, index) => {
      const coveredBy = Math.max(0, state.pair + state.blend - index)
      card.style.transform = `perspective(900px) rotateX(${coveredBy * 2}deg) scale(${1 - coveredBy * 0.045})`
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
  // The list stays in normal flow even when its cards stick. Reading sticky
  // card positions here would make scroll bounds drift after each refresh.
  const anchor = () => desktop.matches ? "center" : "70%"
  trigger = ScrollTrigger.create({
    trigger: list,
    start: () => mobileStack ? `top ${cardTop}px` : `top+=${steps[0].offsetHeight / 2} ${anchor()}`,
    end: () => mobileStack ? `+=${stackDistance}` : `bottom-=${steps[steps.length - 1].offsetHeight / 2} ${anchor()}`,
    snap: {
      snapTo: (value: number, self?: ScrollTrigger) => {
        if (!mobileStack || reduced.matches || !self) return value
        const nearest = gsap.utils.snap([0, 0.5, 1], value)
        // Settle only near a reading position, in the direction of travel.
        // Touch/wheel input remains native; no gesture is intercepted.
        return Math.abs(nearest - value) <= 0.1 && (nearest - value) * self.direction >= 0 ? nearest : value
      },
      inertia: false,
      directional: false,
      delay: 0.18,
      duration: { min: 0.18, max: 0.3 },
      ease: "power2.out",
    },
    onUpdate: (self) => schedule(self.progress),
    onRefresh: (self) => schedule(self.progress),
  })
  update(trigger.progress)
  startRenderer()
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : undefined
  observer?.observe(root)
  steps.forEach((step) => observer?.observe(step))
  cards.forEach((card) => observer?.observe(card))
  Array.from(headingContent.children).forEach((element) => observer?.observe(element))
  const section = root.closest("section")
  if (section) observer?.observe(section)
  desktop.addEventListener("change", onPreference)
  stackViewport.addEventListener("change", onPreference)
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
    stopRenderer()
    context.revert()
    desktop.removeEventListener("change", onPreference)
    stackViewport.removeEventListener("change", onPreference)
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
    cards.forEach((card) => card.style.removeProperty("transform"))
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
