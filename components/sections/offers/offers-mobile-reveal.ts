import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { OFFERS_REVEAL } from "./offers-reveal-motion"
import { animateOfferSheen, bindOfferSheenReplay } from "./offers-sheen"

export const MOBILE_OFFER_REVEAL = {
  distance: 36,
  duration: 0.65,
  startViewport: 0.75,
  sheenViewport: 0.25,
  sheenDuration: OFFERS_REVEAL.sheenDuration * 1000,
} as const

/** Mobile slide/fade followed by a separate, viewport-positioned reflection.
 * Called inside the parent's GSAP matchMedia context, which owns the animations. */
export function mountMobileOfferReveal(section: HTMLElement, onSettled: (settled: boolean) => void) {
  const slot = section.querySelector<HTMLElement>("[data-offers-ivory]")
  const card = section.querySelector<HTMLElement>("[data-offers-card]")
  const sheen = section.querySelector<HTMLElement>("[data-offers-sheen]")
  const rimSheen = section.querySelector<HTMLElement>("[data-offers-rim-sheen]")
  if (!slot || !card || !sheen || !rimSheen) return

  let active = true
  let revealed = false
  let played = false
  let scrollDirection = 1
  let refreshing = false
  let frame = 0
  let animations: Animation[] = []
  const cancel = () => { animations.forEach(animation => animation.cancel()); animations = [] }
  const replaySheen = () => {
    if (!active || refreshing || !revealed || document.hidden
      || animations.some(animation => animation.playState === "running")) return
    const bounds = card.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return
    cancel()
    animations = animateOfferSheen([sheen, rimSheen], MOBILE_OFFER_REVEAL.sheenDuration)
  }
  const playSheen = () => {
    if (!active || refreshing || !revealed || played || scrollDirection < 0 || document.hidden) return
    // The reference shows the card's top around the first quarter of the screen.
    // This threshold is independent of both card height and entrance duration.
    if (slot.getBoundingClientRect().top > innerHeight * MOBILE_OFFER_REVEAL.sheenViewport) return
    const bounds = sheen.parentElement!.getBoundingClientRect()
    // A restored position or a fast swipe can skip the visible header entirely.
    // Do not consume the reflection while that area is above the viewport.
    if (bounds.top < 0 || bounds.top >= innerHeight) return
    played = true
    replaySheen()
  }

  onSettled(false)
  gsap.set(card, {
    boxShadow: "inset 0 2px 2px #fff, inset 0 -3px 4px #a9b89855, 0 8px 16px rgba(32,48,24,.13)",
  })
  // A timed entrance stays visible even when the user pauses their scroll.
  // Once revealed, the content stays readable when scrolling back.
  const reveal = gsap.fromTo(card, {
    y: MOBILE_OFFER_REVEAL.distance,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: MOBILE_OFFER_REVEAL.duration,
    ease: "power2.out",
    paused: true,
    onComplete: () => {
      if (!active) return
      revealed = true
      onSettled(true)
      playSheen()
    },
  })
  const trigger = ScrollTrigger.create({
    trigger: slot,
    start: `top ${MOBILE_OFFER_REVEAL.startViewport * 100}%`,
    end: "bottom top",
    onEnter: () => reveal.play(),
    onEnterBack: () => reveal.play(),
    onUpdate: self => { scrollDirection = self.direction; playSheen() },
    onRefreshInit: () => { refreshing = true },
    onRefresh: self => {
      // Restoring a page or changing breakpoints must not hide visible content.
      if (self.scroll() >= self.start && reveal.progress() === 0) reveal.progress(1).pause()
      refreshing = false
      playSheen()
    },
  })
  if (trigger.scroll() >= trigger.start) reveal.progress(1).pause()
  playSheen()

  const refresh = () => {
    if (!active || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (active) trigger.refresh()
    })
  }
  const observer = new ResizeObserver(refresh)
  observer.observe(section)
  observer.observe(slot)
  void document.fonts?.ready.then(refresh)
  const onVisibility = () => { if (document.hidden) cancel() }
  const onFocus = () => { if (!revealed) reveal.progress(1).pause() }
  document.addEventListener("visibilitychange", onVisibility)
  card.addEventListener("focusin", onFocus)
  const unbindSheenReplay = bindOfferSheenReplay(card, replaySheen)
  window.addEventListener("pageshow", refresh)
  return () => {
    active = false
    cancel()
    unbindSheenReplay()
    observer.disconnect()
    cancelAnimationFrame(frame)
    document.removeEventListener("visibilitychange", onVisibility)
    card.removeEventListener("focusin", onFocus)
    window.removeEventListener("pageshow", refresh)
  }
}
