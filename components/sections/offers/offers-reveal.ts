import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { OFFERS_REVEAL, createOfferSheenGate, fitOfferPoseDistance } from "./offers-reveal-motion"

export type OfferIconPhase = "paused" | "viewport" | "settled"

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
    if (reduced || !desktop) {
      notify(reduced ? "paused" : "viewport")
      return
    }

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
      clearSheen()
      const bounds = card.getBoundingClientRect()
      if (document.hidden || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
      // Use the supplied POC's second version verbatim for both light layers.
      const frames: Keyframe[] = [
        { transform: "translateX(-130%) skewX(-16deg)", opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.12 },
        { opacity: 1, offset: 0.82 },
        { transform: "translateX(130%) skewX(-16deg)", opacity: 0, offset: 1 },
      ]
      const options: KeyframeAnimationOptions = {
        duration: config.sheenDuration * 1000,
        easing: "cubic-bezier(.28,.1,.28,1)",
        fill: "none",
      }
      sheenAnimations = [sheen.animate(frames, options), rimSheen.animate(frames, options)]
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
        duration: 0.88, ease: "power2.inOut",
      }, 0)
      .fromTo(card, {
        "--offer-shadow-y": `${config.shadow.y}px`,
        "--offer-shadow-blur": `${config.shadow.blur}px`,
        "--offer-shadow-spread": `${config.shadow.spread}px`,
        "--offer-shadow-alpha": config.shadow.alpha,
      }, {
        "--offer-shadow-y": "12px", "--offer-shadow-blur": "22px",
        "--offer-shadow-spread": "-17px", "--offer-shadow-alpha": 0,
        duration: 0.88, ease: "power2.inOut",
      }, 0)
      .to(plane, { y: config.settle, duration: 0.045, ease: "sine.out" }, 0.88)
      .to(plane, { y: 0, duration: 0.075, ease: "sine.inOut" }, 0.925)

    const trigger = ScrollTrigger.create({
      trigger: entry,
      animation: timeline,
      start: `top ${config.startViewport * 100}%`,
      end: () => `top ${Math.max(112, window.innerHeight * config.endViewport)}px`,
      scrub: config.scrub,
      invalidateOnRefresh: true,
      onRefreshInit: () => { refreshing = true; measure() },
      onRefresh: (self) => {
        // A reload below the section or a breakpoint change lands immediately
        // at the correct pose instead of replaying the descent from the top.
        timeline.progress(self.progress, true)
        refreshing = false
        syncLanding(self.progress)
      },
    })
    timeline.progress(trigger.progress, true)
    syncLanding(trigger.progress)

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
