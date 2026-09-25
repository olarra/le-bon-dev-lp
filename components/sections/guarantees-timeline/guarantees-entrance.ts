import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type Lenis from "lenis"
import { GUARANTEE_ENTRANCE as entrance } from "./guarantees-timeline.content"

/** First desktop appearance only. The artwork container owns the entrance;
 * its PNG/canvas/blob children remain entirely controlled by the morph. */
export function mountGuaranteesEntrance(root: HTMLElement, lenis?: Lenis) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  let seen = false

  media.add("(min-width: 810px) and (prefers-reduced-motion: no-preference)", () => {
    const firstStep = root.querySelector<HTMLElement>("[data-guarantee-step]")
    const art = root.querySelector<HTMLElement>("[data-guarantee-art-entrance]")
    const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-copy]")).slice(0, 2)
    if (!firstStep || !art || !copies.length || seen) return
    // A restored page in the middle of the timeline must show its active art
    // immediately, including when returning from the mobile breakpoint.
    if (firstStep.getBoundingClientRect().top < 0) {
      seen = true
      return
    }

    // Both texts join the arrival sequence, even if the second is below the
    // fold. Its visibility must not depend on another scroll gesture.
    const reveal = gsap.timeline({
      paused: true,
      defaults: { duration: entrance.duration, ease: "power2.out" },
    })
      .fromTo(art, { scale: entrance.artScale, y: entrance.artDistance }, {
        scale: 1, y: 0, ease: "back.out(1.2)",
      }, entrance.artDelay)
      .fromTo(art, { opacity: 0 }, {
        opacity: 1, duration: entrance.artFadeDuration,
      }, entrance.artDelay)
      .fromTo(copies, { opacity: 0, y: entrance.copyDistance }, {
        opacity: 1, y: 0, stagger: entrance.copyStagger,
      }, entrance.copyDelay)

    let pending = false
    const playWhenSettled = () => {
      if (!pending || seen) return
      // Lenis emits its final scroll event after resetting isScrolling, at
      // the snap destination. Crossing the viewport threshold only queues us.
      if (lenis?.userData.sectionTransition && lenis.isScrolling === "smooth") return
      const { top, bottom } = firstStep.getBoundingClientRect()
      if (top >= window.innerHeight || bottom <= 0) return
      pending = false
      seen = true
      reveal.play()
    }
    const detachScroll = lenis?.on("scroll", playWhenSettled)

    ScrollTrigger.create({
      trigger: firstStep,
      start: entrance.start,
      end: "bottom top",
      once: true,
      onEnter: () => {
        pending = true
        playWhenSettled()
      },
      onLeaveBack: () => { pending = false },
      // Finish immediately if a fast scroll passes the first guarantee.
      onLeave: () => { pending = false; seen = true; reveal.totalProgress(1) },
    })

    return () => detachScroll?.()
  }, root)

  return () => media.revert()
}
