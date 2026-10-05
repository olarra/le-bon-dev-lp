import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { FEATURE_FLAG_OFFERS_METAL_SHIMMER_ENABLED } from "@/lib/feature-flags"
import { mountOfferShimmer } from "./offers-shimmer"

// The recorded reference keeps the fade and rise visible through the same beat.
// Distances grow with the viewport so a large display does not swallow the rise.
const ENTRANCE = {
  headingTrigger: 0.85,
  trigger: 0.6,
  mobileTrigger: 0.68,
  rise: { viewport: 0.13, min: 120, max: 190 },
  mobileRise: { viewport: 0.12, min: 72, max: 104 },
  riseDuration: 1.25,
  supportFade: 0.85,
  cardDelay: 0.2,
  cardScale: 1.12,
  mobileCardScale: 1.07,
  cardDuration: 1.05,
  cardFade: 0.8,
} as const

/** One timed entrance in normal document flow; scrolling never drives or waits for it. */
export function mountOffersEntrance(section: HTMLElement) {
  gsap.registerPlugin(CustomEase)
  // Gentle acceleration leaves real travel to see once the surfaces become opaque.
  const entranceEase = CustomEase.create("offers-entrance", "0.22,0.1,0.22,1")
  const headingEase = CustomEase.create("offers-heading", "0.22,0.8,0.3,1")
  const find = (selector: string) => section.querySelector<HTMLElement>(selector)!
  const heading = find("[data-offers-heading]")
  const entry = find("[data-offers-entry]")
  const support = find("[data-offers-support]")
  const shell = find("[data-offers-shell]")
  const website = find('[data-offer-kind="website"]')
  const application = find('[data-offer-kind="applications"]')
  const applicationPlane = find("[data-offers-ivory]")
  const landingShadow = find("[data-offers-landing-shadow]")
  const media = gsap.matchMedia()
  let headingSeen = false
  let sectionSeen = false
  let applicationSeen = false

  media.add({
    desktop: "(min-width: 810px)",
    mobile: "(max-width: 809.98px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, context => {
    if (context.conditions!.reduced) {
      headingSeen = sectionSeen = applicationSeen = true
      section.setAttribute("data-offers-ready", "")
      return
    }
    const mobile = context.conditions!.mobile
    const trigger = mobile ? ENTRANCE.mobileTrigger : ENTRANCE.trigger
    const distance = mobile ? ENTRANCE.mobileRise : ENTRANCE.rise
    const rise = gsap.utils.clamp(distance.min, distance.max, window.innerHeight * distance.viewport)
    const title = gsap.fromTo(heading, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.65, ease: headingEase, paused: true,
    })
    const scene = gsap.timeline({ paused: true })
    const card = mobile ? gsap.timeline({ paused: true }) : scene
    const rising = mobile ? [shell, website] : support

    gsap.set(rising, { y: rise })
    gsap.set([shell, website, application], { opacity: 0 })
    gsap.set(landingShadow, { opacity: 1 })
    gsap.set(application, {
      scale: mobile ? ENTRANCE.mobileCardScale : ENTRANCE.cardScale,
      // Its own entrance is a recession in depth; the support owns the shared rise.
      y: 0,
      // Tall cards recede around their visible upper edge, not an offscreen centre.
      transformOrigin: "50% 12%",
    })
    scene.to(rising, { y: 0, duration: ENTRANCE.riseDuration, ease: entranceEase }, 0)
    // The light card is one object: its surface and content appear together.
    scene.to([shell, website], { opacity: 1, duration: ENTRANCE.supportFade, ease: "sine.inOut" }, 0)

    // On narrow screens the second card gets its entrance when it becomes visible.
    const cardStart = mobile ? 0 : ENTRANCE.cardDelay
    card.to(application, { opacity: 1, duration: ENTRANCE.cardFade, ease: "sine.inOut" }, cardStart)
    card.to(application, {
      scale: 1, duration: ENTRANCE.cardDuration, ease: entranceEase,
    }, cardStart)
    // Fade a prepainted shadow instead of repainting a large blur every frame.
    card.to(landingShadow, { opacity: 0, duration: ENTRANCE.cardDuration, ease: entranceEase }, cardStart)

    let active = true
    let ready = false
    let restoreFrame = 0
    const shimmer = mountOfferShimmer(application, FEATURE_FLAG_OFFERS_METAL_SHIMMER_ENABLED ? "metal" : "original")
    // The reflection has its own clock and begins only after the card is settled.
    card.eventCallback("onComplete", shimmer.play)
    const pending = new Set<{ observe: () => void; check: () => void; disconnect: () => void }>()
    const clearPending = () => {
      pending.forEach(entrance => entrance.disconnect())
      pending.clear()
    }

    const reveal = (target: HTMLElement, animation: gsap.core.Animation, seen: boolean, markSeen: () => void, viewport: number = trigger) => {
      if (seen) {
        markSeen()
        animation.progress(1, true).pause()
        return
      }
      let observer: IntersectionObserver | undefined
      const check = () => {
        if (!active || !ready || !pending.has(entrance)) return
        const bounds = target.getBoundingClientRect()
        if (bounds.top >= window.innerHeight * viewport) return
        observer?.disconnect()
        pending.delete(entrance)
        markSeen()
        if (bounds.bottom <= 0) animation.progress(1, true).pause()
        else animation.play()
      }
      const observe = () => {
        observer?.disconnect()
        // The stationary layout anchor determines the start, not the animated surface.
        observer = new IntersectionObserver(check, {
          rootMargin: `0px 0px -${Math.round(window.innerHeight * (1 - viewport))}px 0px`,
        })
        observer.observe(target)
        check()
      }
      const entrance = { observe, check, disconnect: () => observer?.disconnect() }
      pending.add(entrance)
      observe()
    }
    reveal(heading, title, headingSeen, () => { headingSeen = true }, ENTRANCE.headingTrigger)
    reveal(entry, scene, sectionSeen, () => {
      sectionSeen = true
      if (!mobile) applicationSeen = true
    })
    if (mobile) reveal(applicationPlane, card, applicationSeen, () => { applicationSeen = true })

    const checkPending = () => { if (active) pending.forEach(entrance => entrance.check()) }
    const resize = () => { pending.forEach(entrance => entrance.observe()) }
    const afterRestoration = () => {
      if (!active || ready || restoreFrame) return
      restoreFrame = requestAnimationFrame(() => {
        restoreFrame = 0
        ready = true
        checkPending()
      })
    }
    // A reload inside the offers should play there, after native scroll restoration.
    window.addEventListener("pageshow", afterRestoration)
    window.addEventListener("resize", resize, { passive: true })
    void document.fonts?.ready.then(checkPending)
    if (document.readyState === "complete") afterRestoration()

    // Keyboard navigation can reach either offer immediately, even during its fade.
    const finish = (event: FocusEvent) => {
      // Navigation links focus the section on arrival; that must not cut its entrance short.
      if (!(event.target instanceof Element) || !event.target.closest("[data-offer-kind]")) return
      clearPending()
      headingSeen = sectionSeen = applicationSeen = true
      title.progress(1, true).pause()
      scene.progress(1, true).pause()
      card.progress(1, true).pause()
    }
    section.addEventListener("focusin", finish)
    section.setAttribute("data-offers-ready", "")

    return () => {
      active = false
      shimmer.dispose()
      clearPending()
      cancelAnimationFrame(restoreFrame)
      window.removeEventListener("pageshow", afterRestoration)
      window.removeEventListener("resize", resize)
      section.removeEventListener("focusin", finish)
    }
  }, section)

  return {
    dispose() {
      media.revert()
      section.removeAttribute("data-offers-ready")
    },
  }
}
