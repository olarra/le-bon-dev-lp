import type Lenis from "lenis"
import type { VirtualScrollData } from "lenis"

const GESTURE_GAP_MS = 120
const NEW_GESTURE_DELTA_FACTOR = 1.6
const MAX_HOLD_MS = 1200
const BOUNDARY_EPSILON = 1

/** Limit Lenis's destination before it schedules its animation, rather than
 * correcting the browser's position against an already running smooth scroll. */
export function attachSectionStop(lenis: Lenis, targets: readonly HTMLElement[]) {
  const win = targets[0]?.ownerDocument.defaultView
  if (!win) return () => {}

  const previousFilter = lenis.options.virtualScroll
  let disposed = false
  let lastWheelAt = Number.NEGATIVE_INFINITY
  let lastDelta = 0
  let holdUntil = 0
  let heldBoundary: number | null = null

  const release = () => {
    const ownsArrival = heldBoundary !== null && Math.abs(lenis.targetScroll - heldBoundary) <= BOUNDARY_EPSILON
    holdUntil = 0
    heldBoundary = null
    lastWheelAt = Number.NEGATIVE_INFINITY
    lastDelta = 0
    // A key, touch or scrollbar drag can interrupt the smooth arrival too.
    // Cancel only our pending arrival; never lock or stop the global scroller.
    if (ownsArrival && lenis.isScrolling === "smooth") {
      lenis.scrollTo(lenis.actualScroll, { immediate: true })
    }
  }

  function belongsToNestedScroll({ event, deltaY }: VirtualScrollData) {
    for (const node of event.composedPath()) {
      if (node === lenis.rootElement) break
      if (!(node instanceof HTMLElement)) continue
      if (lenis.options.prevent?.(node) || node.hasAttribute("data-lenis-prevent")
        || node.hasAttribute("data-lenis-prevent-wheel") || node.hasAttribute("data-lenis-prevent-vertical")) return true
      if (!lenis.options.allowNestedScroll || node.scrollHeight <= node.clientHeight) continue
      const style = win!.getComputedStyle(node)
      if (!["auto", "scroll", "overlay"].includes(style.overflowY)) continue
      const canScroll = deltaY > 0 ? node.scrollTop < node.scrollHeight - node.clientHeight : node.scrollTop > 0
      if (canScroll || ["contain", "none"].includes(style.overscrollBehaviorY)) return true
    }
    return false
  }

  const filter = (data: VirtualScrollData) => {
    if (disposed) return previousFilter?.(data) ?? true
    if (previousFilter?.(data) === false) {
      release()
      return false
    }
    if (heldBoundary !== null && Math.abs(lenis.targetScroll - heldBoundary) > BOUNDARY_EPSILON) release()
    const { event, deltaX, deltaY } = data
    if (event.type !== "wheel" || event.ctrlKey || event.shiftKey || event.defaultPrevented
      || deltaY <= 0 || Math.abs(deltaX) >= deltaY || !event.cancelable
      || lenis.prefersReducedMotion || lenis.isStopped || lenis.isLocked || !lenis.options.smoothWheel
      || (event as Event & { lenisStopPropagation?: boolean }).lenisStopPropagation
      || belongsToNestedScroll(data)) {
      release()
      return true
    }

    const now = win.performance.now()
    const newGesture = now - lastWheelAt > GESTURE_GAP_MS
      || deltaY > lastDelta * NEW_GESTURE_DELTA_FACTOR + 2
    lastWheelAt = now
    // Preserve the original normalized delta, not the shortened boundary delta.
    lastDelta = deltaY
    if (holdUntil && !newGesture && now < holdUntil) {
      event.preventDefault()
      return false
    }
    holdUntil = 0
    heldBoundary = null

    const from = lenis.targetScroll
    const destination = from + deltaY
    let boundary = Number.POSITIVE_INFINITY
    for (const target of targets) {
      if (!target.isConnected) continue
      const top = target.getBoundingClientRect().top + win.scrollY
      if (top > from + BOUNDARY_EPSILON && top <= destination && top <= lenis.limit) boundary = Math.min(boundary, top)
    }
    if (Number.isFinite(boundary)) {
      data.deltaY = boundary - from
      heldBoundary = boundary
      holdUntil = now + MAX_HOLD_MS
    }
    return true
  }

  lenis.options.virtualScroll = filter
  const releases = ["keydown", "pointerdown", "touchstart", "resize", "hashchange", "popstate", "pageshow", "blur"] as const
  releases.forEach((event) => win.addEventListener(event, release, { passive: true }))

  return () => {
    if (disposed) return
    disposed = true
    releases.forEach((event) => win.removeEventListener(event, release))
    if (lenis.options.virtualScroll === filter) lenis.options.virtualScroll = previousFilter
    release()
  }
}
