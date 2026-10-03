import { gsap } from "gsap"
import type { AnimationControls } from "motion/react"
/** Content starts at the card's top, independently of the original card pose. */
export function mountOffersContentEntrance(
  section: HTMLElement,
  headingControls: AnimationControls,
) {
  const media = gsap.matchMedia()
  const seen = new WeakSet<HTMLElement>()
  let headingSeen = false

  media.add({
    desktop: "(min-width: 810px)",
    mobile: "(max-width: 809.98px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, context => {
    const { desktop, reduced } = context.conditions!
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-offer-kind]"))
    const heading = section.querySelector<HTMLElement>("#offres-title")
    let headingPending = !!heading && !headingSeen
    const finishHeading = () => {
      headingPending = false
      headingSeen = true
      headingControls.stop()
      headingControls.set("visible")
    }
    if (reduced) {
      finishHeading()
      cards.forEach(card => seen.add(card))
      section.setAttribute("data-offers-ready", "")
      return
    }
    headingControls.set(headingPending ? "hidden" : "visible")

    let active = true
    let frame = 0
    const finishAll: (() => void)[] = []
    const pending = new Set<{ anchor: HTMLElement; cards: HTMLElement[]; play: (immediate: boolean) => void }>()
    const groups = desktop ? [cards] : cards.map(card => [card])
    for (const group of groups) {
      const fresh = group.filter(card => !seen.has(card))
      const anchor = desktop
        ? section.querySelector<HTMLElement>("[data-offers-entry]")
        : fresh[0]?.closest<HTMLElement>("[data-offers-ivory]") ?? fresh[0]
      if (!fresh.length) continue
      if (!anchor) continue
      const timeline = gsap.timeline({ paused: true })
      const animated: HTMLElement[] = []
      const beat = (items: HTMLElement[], at: number, distance: number, duration: number, scale = 1) => {
        if (!items.length) return
        animated.push(...items)
        // CSS hides the server-rendered content until every starting pose is
        // installed, including beats that begin later in this timeline.
        gsap.set(items, { opacity: 0, y: distance, scale })
        // Opacity and travel share the full duration and curve: the rise stays
        // perceptible as the content becomes readable, instead of settling early.
        timeline.to(items, {
          opacity: 1, y: 0, scale: 1, duration, ease: "power1.inOut",
        }, at)
      }
      fresh.forEach((card, index) => {
        const select = (selector: string) => Array.from(card.querySelectorAll<HTMLElement>(selector))
        const offset = desktop ? index * 0.16 : 0
        beat(select("[data-offers-icon]"), offset + 0.04, desktop ? 16 : 12, 0.9, 0.98)
        beat(select("[data-offers-badge]"), offset + 0.08, 0, 0.9)
        // The whole left column leads the right by 160 ms. Within each column,
        // titles, promises, audience and features remain one coherent block.
        beat(select('[data-offers-text="intro"] > *, [data-offers-text="details"] > *'),
          offset + 0.08, desktop ? 32 : 24, 0.95)
        // The bottom overlaps the left block rather than waiting for the right.
        beat(select("[data-offers-aftercare], [data-offers-price]"), 0.12, desktop ? 24 : 18, 0.95)
        beat(select("[data-offers-action]"), 0.18, desktop ? 16 : 12, 0.95)
      })
      timeline.set(animated, { clearProps: "opacity,transform" })
      const entry = {
        anchor,
        cards: fresh,
        play(immediate: boolean) {
          pending.delete(entry)
          fresh.forEach(card => seen.add(card))
          if (immediate) timeline.progress(1).pause()
          else timeline.play()
        },
      }
      pending.add(entry)
      finishAll.push(() => entry.play(true))
    }
    section.setAttribute("data-offers-ready", "")

    const sync = () => {
      frame = 0
      if (!active) return
      if (headingPending && heading) {
        const bounds = heading.getBoundingClientRect()
        if (bounds.top <= innerHeight * 0.8) {
          headingPending = false
          headingSeen = true
          if (bounds.bottom <= 0) finishHeading()
          else void headingControls.start("visible")
        }
      }
      for (const entry of pending) {
        const bounds = entry.anchor.getBoundingClientRect()
        if (bounds.top <= innerHeight * 0.9) {
          // Refreshing anywhere inside a card replays its full sequence.
          // Only cards entirely above the viewport settle without playback.
          entry.play(entry.cards.every(card => card.getBoundingClientRect().bottom <= 0))
        }
      }
    }
    const schedule = () => {
      if (active && (pending.size || headingPending) && !frame) frame = requestAnimationFrame(sync)
    }
    const onFocus = () => {
      finishHeading()
      finishAll.forEach(finish => finish())
    }
    // The anchor is outside the card's pose animation.
    // Reading its live position also covers large scroll jumps,
    // font changes and the Guarantees layout settling above this section.
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("pageshow", schedule)
    section.addEventListener("focusin", onFocus)
    void document.fonts?.ready.then(schedule)
    sync()

    return () => {
      active = false
      headingControls.stop()
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("pageshow", schedule)
      section.removeEventListener("focusin", onFocus)
    }
  }, section)

  return () => {
    media.revert()
    section.removeAttribute("data-offers-ready")
  }
}
