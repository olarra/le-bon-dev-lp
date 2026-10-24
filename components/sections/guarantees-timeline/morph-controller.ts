import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import { getMorphState, getStackState } from "./morph-progress"
import { createRenderer, type MorphRenderer } from "./morph-renderer"
import { fitMobileStack, MOBILE_STACK_SPACING } from "./mobile-stack-layout"
import type { BlobFoilRenderer } from "./blob-foil-renderer"

/** Adapted from the approved POC controller; owns only this section's resources. */
export function mountGuaranteesMorph(root: HTMLElement, assets: readonly string[]) {
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)
  const find = <T extends Element>(selector: string) => {
    const element = root.querySelector<T>(selector)
    if (!element) throw new Error(`Missing guarantees element: ${selector}`)
    return element
  }
  const canvas = find<HTMLCanvasElement>("[data-guarantee-canvas]")
  const blob = find<SVGPathElement>("[data-guarantee-visual] [data-morph-path]")
  const colorStops = Array.from(root.querySelectorAll<SVGStopElement>("[data-guarantee-visual] [data-blob-fill] stop"))
  const fill = find<HTMLElement>("[data-guarantee-fill]")
  const shapes = Array.from(root.querySelectorAll<SVGPathElement>("[data-morph-shape]"))
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-step]"))
  const cards = steps.map((step) => {
    const card = step.querySelector<HTMLElement>("[data-guarantee-card]")
    if (!card) throw new Error("Missing guarantee card")
    return card
  })
  const list = find<HTMLElement>("[data-guarantee-cards]")
  const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-copy]"))
  const heading = find<HTMLElement>("[data-guarantee-heading]")
  const header = document.querySelector<HTMLElement>("header[data-scrolled]")
  const desktop = window.matchMedia("(min-width: 810px)")
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  const contrast = window.matchMedia("(forced-colors: active)")
  // Safari changes innerHeight and visualViewport.height as its bars collapse.
  // The small viewport unit keeps the sticky pile's geometry fixed during a swipe.
  const viewportProbe = document.createElement("div")
  viewportProbe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none"
  document.body.appendChild(viewportProbe)
  const smallViewportHeight = () => Math.round(viewportProbe.getBoundingClientRect().height)
    || Math.min(window.innerHeight, window.visualViewport?.height ?? window.innerHeight)
  let viewportWidth = window.innerWidth
  let viewportHeight = smallViewportHeight()
  let disposed = false
  let current = 0
  let frame = 0
  let refreshFrame = 0
  let trigger: ScrollTrigger | undefined
  let renderer: MorphRenderer | undefined
  let rendererLoad: AbortController | undefined
  let foil: BlobFoilRenderer | undefined
  let foilRevision = 0
  let resourcesReady = typeof IntersectionObserver === "undefined"
  let morphs: gsap.core.Tween[] = []
  let mobileStack = false
  let stickyTop = 0
  let entryDistance = 1
  let stackDistance = 1
  const mobileProperties = [
    "--mobile-card-height", "--mobile-art-size", "--mobile-card-padding",
    "--mobile-art-gap", "--mobile-sticky-top", "--mobile-layer-gap",
    "--mobile-card-gap", "--mobile-stack-tail", "--mobile-viewport-height",
  ]

  function resetMobileLayout() {
    mobileProperties.forEach((property) => root.style.removeProperty(property))
    gsap.set(steps, { clearProps: "transform" })
    gsap.set(cards, { clearProps: "transform" })
  }

  function configureLayout() {
    mobileStack = false
    if (desktop.matches || reduced.matches) {
      root.dataset.mobileStack = "false"
      resetMobileLayout()
      return
    }

    // Measure natural copy at the standard padding without collapsing an
    // already-sticky scroll reservation during a resize or font refresh.
    root.style.removeProperty("--mobile-card-padding")
    const viewportHeight = smallViewportHeight()
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
    // Sticky cards in normal flow, each pinned one layer gap below the
    // previous one. The flow gap keeps one scrolled pixel moving an incoming
    // card by one pixel; the stack releases as soon as the last card has pinned.
    entryDistance = fit.cardHeight + fit.cardGap
    stackDistance = (steps.length - 1) * entryDistance + MOBILE_STACK_SPACING.tail
    const dimensions = {
      "--mobile-card-height": fit.cardHeight,
      "--mobile-art-size": fit.artSize,
      "--mobile-card-padding": fit.padding,
      "--mobile-art-gap": fit.artGap,
      "--mobile-sticky-top": stickyTop,
      "--mobile-layer-gap": fit.layerGap,
      "--mobile-card-gap": fit.cardGap,
      "--mobile-stack-tail": MOBILE_STACK_SPACING.tail,
      "--mobile-viewport-height": viewportHeight,
    }
    Object.entries(dimensions).forEach(([property, value]) => root.style.setProperty(property, `${value}px`))
    root.dataset.mobileStack = "true"
    // Never transform the sticky element itself: Safari can shift its pinning
    // during fast reverse scrolls. Only its visual card recedes.
    gsap.set(steps, { clearProps: "transform" })
    gsap.set(cards, { scale: 1 })
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

  const colors = MORPH_PALETTES.slice(0, -1).map((palette, pair) => palette.map((color, index) =>
    gsap.utils.interpolate<string>(color, MORPH_PALETTES[pair + 1][index]),
  ))

  function update(value: number) {
    if (disposed) return
    let progress: number
    let active: number
    if (mobileStack) {
      const stack = getStackState(value, { entryDistance, distance: stackDistance, cardCount: steps.length })
      progress = stack.progress
      active = stack.active
      // Covered cards recede from their top edge as the next card slides over.
      // The foil derives the same arrivals from scroll geometry directly.
      cards.forEach((card, index) => gsap.set(card, { scale: stack.scales[index] }))
    } else {
      const state = getMorphState(value, reduced.matches)
      progress = state.progress
      active = state.active
      if (desktop.matches) {
        morphs[state.pair].progress(state.blend)
        const path = state.blend === 0 ? MORPH_BLOBS[state.pair]
          : state.blend === 1 ? MORPH_BLOBS[state.pair + 1]
          : shapes[state.pair].getAttribute("d")!
        // The shared desktop fill, foil clip and rim follow this live path.
        blob.setAttribute("d", path)
        colorStops.forEach((stop, index) => {
          stop.setAttribute("stop-color", colors[state.pair][index](state.blend))
        })
        fill.style.transform = `scaleY(${state.progress})`
        renderer?.render(state.pair, state.blend, 1)
      }
    }
    current = progress
    root.dataset.progress = progress.toFixed(4)
    root.dataset.active = String(active)
    steps.forEach((step, index) => {
      if (index === active) step.setAttribute("aria-current", "step")
      else step.removeAttribute("aria-current")
    })
    foil?.render()
  }

  function schedule(value: number) {
    if (disposed) return
    // ScrollTrigger already updates on the scroll frame. Native sticky cards
    // must recede on that frame too, especially when the gesture reverses.
    if (mobileStack) {
      update(value)
      return
    }
    current = value
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0
      update(current)
    })
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
    // Mobile cards use their own images; only desktop needs the morph renderer.
    if (disposed || !resourcesReady || !desktop.matches || reduced.matches) return
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

  function stopFoil() {
    ++foilRevision
    foil?.dispose()
    foil = undefined
  }

  function startFoil() {
    stopFoil()
    if (disposed || !resourcesReady || reduced.matches || contrast.matches || !navigator.gpu) return
    const revision = foilRevision
    void import("./blob-foil-renderer").then(({ createBlobFoilRenderer }) => {
      if (disposed || revision !== foilRevision) return
      foil = createBlobFoilRenderer(root)
      foil.render()
      // The dark SVG/CSS material remains visible if WebGPU cannot start.
      return foil.ready
    }).catch(() => {})
  }

  function refresh() {
    if (disposed || refreshFrame) return
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0
      if (disposed) return
      configureLayout()
      trigger?.refresh()
      trigger?.update()
      update(trigger?.progress ?? current)
    })
  }
  function onPreference() {
    configureLayout()
    startRenderer()
    startFoil()
    update(trigger?.progress ?? current)
    refresh()
  }
  function onVisibility() {
    if (document.visibilityState === "visible") refresh()
  }
  function onViewportResize() {
    const width = window.innerWidth
    const height = smallViewportHeight()
    if (width === viewportWidth && height === viewportHeight) return
    viewportWidth = width
    viewportHeight = height
    refresh()
  }

  configureLayout()
  // The list's own box ignores its sticky children: progress starts when the
  // first card pins below the header.
  const stackStart = () => list.getBoundingClientRect().top + window.scrollY - stickyTop
  const anchor = () => desktop.matches ? "center" : "70%"
  trigger = ScrollTrigger.create({
    trigger: list,
    start: () => mobileStack ? stackStart() : `top+=${steps[0].offsetHeight / 2} ${anchor()}`,
    end: () => mobileStack ? stackStart() + stackDistance : `bottom-=${steps[steps.length - 1].offsetHeight / 2} ${anchor()}`,
    onUpdate: (self) => schedule(self.progress),
    onRefresh: (self) => schedule(self.progress),
  })
  update(trigger.progress)
  // The static artwork covers the entrance while GPU resources warm up nearby.
  const resourceObserver = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
    if (disposed || !entries.some(entry => entry.isIntersecting)) return
    resourcesReady = true
    resourceObserver?.disconnect()
    startRenderer()
    startFoil()
  }, { rootMargin: "400px 0px" }) : undefined
  resourceObserver?.observe(list)
  startRenderer()
  startFoil()
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
  contrast.addEventListener("change", startFoil)
  window.addEventListener("pageshow", refresh)
  window.addEventListener("resize", onViewportResize)
  document.addEventListener("visibilitychange", onVisibility)
  void document.fonts?.ready.then(() => { if (!disposed) refresh() })

  return () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    cancelAnimationFrame(refreshFrame)
    observer?.disconnect()
    resourceObserver?.disconnect()
    trigger?.kill()
    stopRenderer()
    stopFoil()
    context.revert()
    desktop.removeEventListener("change", onPreference)
    reduced.removeEventListener("change", onPreference)
    contrast.removeEventListener("change", startFoil)
    window.removeEventListener("pageshow", refresh)
    window.removeEventListener("resize", onViewportResize)
    document.removeEventListener("visibilitychange", onVisibility)
    viewportProbe.remove()
    // Restore the SSR state for React Strict Mode's setup/cleanup/setup.
    root.dataset.renderer = "static"
    root.dataset.active = "0"
    root.dataset.mobileStack = "false"
    resetMobileLayout()
    delete root.dataset.progress
    blob.setAttribute("d", MORPH_BLOBS[0])
    colorStops.forEach((stop, index) => stop.setAttribute("stop-color", MORPH_PALETTES[0][index]))
    fill.style.removeProperty("transform")
    steps.forEach((step, index) => {
      if (index === 0) step.setAttribute("aria-current", "step")
      else step.removeAttribute("aria-current")
    })
  }
}
