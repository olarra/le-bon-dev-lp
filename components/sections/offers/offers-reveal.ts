import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { OFFERS_REVEAL, createOfferSheenGate, fitOfferPoseDistance, getOfferRevealBounds } from "./offers-reveal-motion"
import { mountMobileOfferReveal } from "./offers-mobile-reveal"
import { animateOfferSheen, bindOfferSheenReplay } from "./offers-sheen"

export type OfferIconPhase = "paused" | "viewport" | "settled" | "mobile-pending"

/** Owns only the ivory reveal. The sage support and background stay still. */
export function mountOffersReveal(section: HTMLElement, onIconPhase: (phase: OfferIconPhase) => void) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  const shouldPlaySheen = createOfferSheenGate()
  let disposed = false
  let lastPhase: OfferIconPhase | undefined
  const notify = (phase: OfferIconPhase) => {
    if (disposed || lastPhase === phase) return
    lastPhase = phase
    onIconPhase(phase)
  }

  media.add({
    desktop: "(min-width: 810px)",
    mobile: "(max-width: 809.98px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, (context) => {
    const { desktop, reduced } = context.conditions!
    if (reduced) {
      notify("paused")
      return
    }
    if (!desktop) return mountMobileOfferReveal(section, settled => notify(settled ? "viewport" : "mobile-pending"))

    const entry = section.querySelector<HTMLElement>("[data-offers-entry]")
    const support = section.querySelector<HTMLElement>("[data-offers-support]")
    const plane = section.querySelector<HTMLElement>("[data-offers-ivory]")
    const card = section.querySelector<HTMLElement>("[data-offers-card]")
    const sheen = section.querySelector<HTMLElement>("[data-offers-sheen]")
    const rimSheen = section.querySelector<HTMLElement>("[data-offers-rim-sheen]")
    const heading = section.querySelector<HTMLElement>("header")
    if (!entry || !support || !plane || !card || !sheen || !rimSheen || !heading) return

    const config = OFFERS_REVEAL
    let active = true
    let refreshing = false
    let refreshFrame = 0
    let sheenAnimations: Animation[] = []
    let distance: number = config.distance
    let startPosition = 0
    let endPosition = 0

    notify("paused")
    gsap.set(support, { perspective: config.perspective })
    gsap.set(plane, { transformOrigin: `50% ${config.originY * 100}%`, force3D: "auto" })
    gsap.set(card, {
      "--offer-shadow-y": "12px", "--offer-shadow-blur": "22px",
      "--offer-shadow-spread": "-17px", "--offer-shadow-alpha": 0,
    })

    const measure = () => {
      // offset metrics ignore the animated card transform. The support itself
      // never moves, so this also works during reverse scroll and refresh.
      const normalTop = support.getBoundingClientRect().top + plane.offsetTop
      const cardOffset = normalTop - entry.getBoundingClientRect().top
      // Land when 95% of the card has crossed the viewport's bottom edge.
      // The remaining 5% stays below the screen, even for cards taller than it.
      const bounds = getOfferRevealBounds(window.innerHeight, plane.offsetHeight, cardOffset)
      startPosition = bounds.start
      endPosition = bounds.end
      const clearance = normalTop - heading.getBoundingClientRect().bottom - config.headingClearance
      distance = fitOfferPoseDistance(plane.offsetWidth, plane.offsetHeight, clearance)
      support.style.perspectiveOrigin = `${plane.offsetLeft + plane.offsetWidth / 2}px ${plane.offsetTop + plane.offsetHeight * config.originY}px`
    }
    // Capture perspective-origin too, before the measured value is assigned.
    gsap.set(support, { perspectiveOrigin: "50% 50%" })
    measure()

    const clearSheen = () => {
      sheenAnimations.forEach(animation => animation.cancel())
      sheenAnimations = []
    }
    const playSheen = () => {
      if (!active || sheenAnimations.some(animation => animation.playState === "running")) return
      const bounds = card.getBoundingClientRect()
      if (document.hidden || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
      clearSheen()
      sheenAnimations = animateOfferSheen([sheen, rimSheen], config.sheenDuration * 1000)
    }
    const syncLanding = (progress: number) => {
      if (!active || refreshing) return
      const settled = progress >= config.sheenStart
      notify(settled ? "settled" : "paused")
      if (!settled && sheenAnimations.length) clearSheen()
      if (shouldPlaySheen(progress)) playSheen()
    }

    const timeline = gsap.timeline({
      paused: true,
      onUpdate() { syncLanding(this.progress()) },
    })
      .fromTo(plane, {
        y: () => -distance, rotationX: config.rotationX,
        rotation: config.rotationZ, scale: config.scale,
      }, {
        y: 0, rotationX: 0, rotation: 0, scale: 1,
        duration: 0.88, ease: "sine.inOut",
      }, 0)
      .fromTo(card, {
        "--offer-shadow-y": `${config.shadow.y}px`,
        "--offer-shadow-blur": `${config.shadow.blur}px`,
        "--offer-shadow-spread": `${config.shadow.spread}px`,
        "--offer-shadow-alpha": config.shadow.alpha,
      }, {
        "--offer-shadow-y": "12px", "--offer-shadow-blur": "22px",
        "--offer-shadow-spread": "-17px", "--offer-shadow-alpha": 0,
        duration: 0.88, ease: "sine.inOut",
      }, 0)
      .to(plane, { y: config.settle, duration: 0.045, ease: "sine.out" }, 0.88)
      .to(plane, { y: 0, duration: 0.075, ease: "sine.inOut" }, 0.925)

    const trigger = ScrollTrigger.create({
      trigger: entry,
      animation: timeline,
      start: () => `top ${startPosition}px`,
      end: () => `top ${endPosition}px`,
      scrub: config.scrub,
      invalidateOnRefresh: true,
      onRefreshInit: () => { refreshing = true; measure() },
      onRefresh: (self) => {
        // Restore the pose at the current scroll position in either direction.
        const progress = self.progress
        timeline.progress(progress, true)
        refreshing = false
        syncLanding(progress)
      },
    })
    const initialProgress = trigger.progress
    timeline.progress(initialProgress, true)
    syncLanding(initialProgress)

    const unbindSheenReplay = bindOfferSheenReplay(card, () => {
      if (timeline.progress() >= config.sheenStart) playSheen()
    })

    const refresh = () => {
      if (!active || refreshFrame) return
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0
        if (active) trigger.refresh()
      })
    }
    const observer = new ResizeObserver(refresh)
    observer.observe(section)
    observer.observe(support)
    void document.fonts?.ready.then(refresh)
    window.addEventListener("pageshow", refresh)
    const onVisibility = () => { if (document.hidden) clearSheen() }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      active = false
      clearSheen()
      unbindSheenReplay()
      observer.disconnect()
      cancelAnimationFrame(refreshFrame)
      window.removeEventListener("pageshow", refresh)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, section)

  return () => {
    disposed = true
    // Reverts perspective, transforms and all decorative style properties;
    // kills this section's timeline/trigger without touching Guarantees.
    media.revert()
  }
}
