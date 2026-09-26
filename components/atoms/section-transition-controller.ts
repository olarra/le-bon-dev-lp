import type Lenis from "lenis"
import type { VirtualScrollData } from "lenis"

export const SECTION_TRANSITION = {
  duration: 1,
  gestureGap: 160,
  momentumHold: 1200,
  epsilon: 2,
} as const

const ease = (progress: number) => (1 - Math.cos(Math.PI * progress)) / 2

type SectionTransitionTarget = { start: HTMLElement; end: HTMLElement }

/** Animate the document through Lenis so sticky scenes and ScrollTrigger keep
 * their real scroll positions. Only the gaps between reading ranges snap. */
export function attachSectionTransitions(
  lenis: Lenis,
  targets: readonly SectionTransitionTarget[],
  options: { forwardOnly?: boolean } = {},
) {
  const win = targets[0]?.start.ownerDocument.defaultView
  if (!win) return () => {}

  const previousFilter = lenis.options.virtualScroll
  const config = SECTION_TRANSITION
  let disposed = false
  let lastWheelAt = Number.NEGATIVE_INFINITY
  let lastDelta = 0
  let heldPosition: number | null = null
  let holdUntil = 0
  let direction = 0
  let arrival: Record<string, unknown> | null = null

  const release = () => {
    const ownsArrival = arrival !== null && lenis.userData === arrival
    arrival = null
    heldPosition = null
    holdUntil = 0
    lastWheelAt = Number.NEGATIVE_INFINITY
    lastDelta = 0
    if (ownsArrival && lenis.isScrolling === "smooth") {
      lenis.scrollTo(lenis.actualScroll, { immediate: true })
    }
  }

  const measure = () => {
    const headerClearance = parseFloat(win.getComputedStyle(lenis.rootElement).scrollPaddingTop) || 0
    const clamp = (y: number) => Math.max(0, Math.min(y, lenis.limit))
    return targets.filter(({ start, end }) => start.isConnected && end.isConnected).flatMap(({ start: target, end: lastTarget }, index) => {
      const rect = target.getBoundingClientRect()
      if (!rect.height) return []
      const bottom = lastTarget === target ? rect.bottom : lastTarget.getBoundingClientRect().bottom
      const top = rect.top + win.scrollY
      const heading = target.querySelector<HTMLElement>("header")
      const headingInset = heading
        ? heading.getBoundingClientRect().top - rect.top
        : parseFloat(win.getComputedStyle(target).paddingTop) || 0
      // Existing section padding already supplies most of the header clearance.
      const offset = index === 0 ? 0 : Math.max(0, headerClearance - headingInset)
      const start = clamp(top - offset)
      const end = Math.max(start, clamp(bottom + win.scrollY - win.innerHeight))
      return [{ start, end }]
    }).sort((a, b) => a.start - b.start)
  }

  function belongsToNestedScroll({ event, deltaY }: VirtualScrollData) {
    for (const node of event.composedPath()) {
      if (node === lenis.rootElement) break
      if (!(node instanceof HTMLElement)) continue
      if (node.matches("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
        || lenis.options.prevent?.(node) || node.hasAttribute("data-lenis-prevent")
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
    const { event, deltaX, deltaY } = data
    if (event.type !== "wheel" || event.ctrlKey || event.shiftKey || event.defaultPrevented
      || deltaY === 0 || Math.abs(deltaX) >= Math.abs(deltaY) || !event.cancelable
      || lenis.prefersReducedMotion || lenis.isStopped || lenis.isLocked || !lenis.options.smoothWheel
      || (event as Event & { lenisStopPropagation?: boolean }).lenisStopPropagation
      || belongsToNestedScroll(data)
      // A single entrance must not pull readers back to it from later sections.
      || (options.forwardOnly && deltaY < 0)) {
      release()
      return true
    }

    const nextDirection = Math.sign(deltaY)
    // Do not cancel a navigation link or another component's scroll animation.
    if (arrival && lenis.userData !== arrival) release()
    if (arrival && nextDirection !== direction) release()
    if (!arrival && heldPosition !== null
      && Math.abs(lenis.targetScroll - heldPosition) > config.epsilon) release()

    const now = win.performance.now()
    const newGesture = now - lastWheelAt > config.gestureGap
      || nextDirection !== direction || Math.abs(deltaY) > Math.abs(lastDelta) * 1.6 + 2
    lastWheelAt = now
    lastDelta = deltaY
    const consume = () => { event.preventDefault(); return false }
    // Finish one transition at its own pace, then absorb only residual momentum.
    if (arrival || (heldPosition !== null && !newGesture && now < holdUntil)) return consume()
    heldPosition = null
    direction = nextDirection

    const ranges = measure()
    const from = lenis.targetScroll
    let index = ranges.length - 1
    while (index >= 0 && ranges[index].start > from + config.epsilon) index--
    if (index < 0) return true
    const current = ranges[index]
    const next = ranges[index + 1]
    const previous = ranges[index - 1]
    let destination: number | undefined
    let readingEdge: number | undefined

    if (direction > 0 && next) {
      if (from < current.end - config.epsilon) readingEdge = current.end
      else destination = next.start
    } else if (direction < 0) {
      if (from > current.end + config.epsilon) destination = current.end
      else if (from > current.start + config.epsilon) readingEdge = current.start
      else if (previous) destination = previous.end
    }

    if (readingEdge !== undefined) {
      // A large fling stops at the final reading screen. A fresh gesture can
      // then change sections instead of skipping the remaining text or CTA.
      if ((from + deltaY - readingEdge) * direction >= 0) {
        data.deltaY = readingEdge - from
        heldPosition = readingEdge
        holdUntil = now + config.momentumHold
      }
      return true
    }
    if (destination === undefined || Math.abs(destination - from) <= config.epsilon) return true

    const token = { sectionTransition: true }
    arrival = token
    heldPosition = destination
    holdUntil = now + config.duration * 1000 + config.gestureGap
    lenis.scrollTo(destination, {
      duration: config.duration,
      easing: ease,
      lerp: 0,
      userData: token,
      onComplete: () => { if (arrival === token) arrival = null },
    })
    return consume()
  }

  lenis.options.virtualScroll = filter
  const releases = ["keydown", "pointerdown", "touchstart", "focusin", "resize", "hashchange", "popstate", "pageshow", "blur"] as const
  releases.forEach(event => win.addEventListener(event, release, { passive: true }))

  return () => {
    if (disposed) return
    disposed = true
    releases.forEach(event => win.removeEventListener(event, release))
    if (lenis.options.virtualScroll === filter) lenis.options.virtualScroll = previousFilter
    release()
  }
}
