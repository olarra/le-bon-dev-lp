import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type Lenis from "lenis"
import { GUARANTEE_ENTRANCE as entrance } from "./guarantees-timeline.content"

/** Layout coordinates exclude both the entrance transforms and the mobile
 * scene's sticky offset, including when a refresh happens halfway through it. */
function layoutTop(element: HTMLElement, section: HTMLElement) {
  let top = section.getBoundingClientRect().top + window.scrollY
  for (let node: HTMLElement | null = element; node && node !== section; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop
  }
  return top
}

/** Timed reading beats. Card stacking and illustration morphing keep their
 * own transforms; this controller touches only art wrappers and copy children. */
export function mountGuaranteesEntrance(root: HTMLElement, lenis?: Lenis) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()

  media.add({
    desktop: "(min-width: 810px)",
    mobile: "(max-width: 809.98px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, (context) => {
    const { desktop, reduced } = context.conditions!
    const section = root.closest<HTMLElement>("section") ?? root
    const label = root.querySelector<HTMLElement>("[data-guarantee-label]")
    const intro = root.querySelector<HTMLElement>("[data-guarantee-intro]")
    const art = root.querySelector<HTMLElement>("[data-guarantee-art-entrance]")
    const mobileArt = root.querySelector<HTMLElement>("[data-guarantee-mobile-art]")
    const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-copy]"))
    const anchors = [label, intro, mobileArt, ...copies].filter((element): element is HTMLElement => !!element)
    if (reduced) {
      anchors.forEach(element => { element.dataset.guaranteeEntered = "" })
      return
    }

    let active = true
    let frame = 0
    const triggers: ScrollTrigger[] = []
    const pending = new Set<() => void>()
    const viewport = desktop ? entrance.startViewport : entrance.mobileStartViewport

    const stage = (anchor: HTMLElement, items: HTMLElement[], options: {
      viewport?: number
      delay?: number
      distance?: number
      artwork?: HTMLElement[]
      waitForSnap?: boolean
    } = {}) => {
      const start = () => Math.max(0, layoutTop(anchor, section) - window.innerHeight * (options.viewport ?? viewport))
      // Progressive enhancement: restored/read content and no-JS content are
      // already visible. Once a beat starts, breakpoint changes never hide it.
      if (anchor.hasAttribute("data-guarantee-entered") || window.scrollY >= start()) {
        anchor.dataset.guaranteeEntered = ""
        return
      }

      const artwork = options.artwork ?? []
      const reveal = gsap.timeline({ paused: true })
      if (artwork.length) {
        reveal.fromTo(artwork, {
          y: desktop ? entrance.artDistance : entrance.mobileDistance,
          scale: entrance.artScale,
        }, {
          y: 0, scale: 1, duration: entrance.artDuration, ease: "power3.out",
        }, 0).fromTo(artwork, { opacity: 0 }, {
          opacity: 1, duration: entrance.fadeDuration, ease: "power1.inOut",
        }, 0)
      }
      const delay = options.delay ?? (artwork.length && items.length ? entrance.copyDelay : 0)
      if (items.length) {
        reveal.fromTo(items, {
          y: options.distance ?? (desktop ? entrance.copyDistance : entrance.mobileDistance),
        }, {
          y: 0, duration: entrance.duration, ease: "power3.out", stagger: entrance.copyStagger,
        }, delay).fromTo(items, { opacity: 0 }, {
          opacity: 1, duration: entrance.fadeDuration, ease: "power1.inOut", stagger: entrance.copyStagger,
        }, delay)
      }
      reveal.set([...artwork, ...items], { clearProps: "opacity,transform" })

      const play = () => {
        if (!active || anchor.hasAttribute("data-guarantee-entered")) return
        if (options.waitForSnap && lenis?.userData.sectionTransition && lenis.isScrolling === "smooth"
          && section.getBoundingClientRect().top > window.innerHeight * entrance.snapStart) {
          pending.add(play)
          return
        }
        pending.delete(play)
        anchor.dataset.guaranteeEntered = ""
        reveal.play()
      }
      const finish = () => {
        pending.delete(play)
        anchor.dataset.guaranteeEntered = ""
        reveal.progress(1).pause()
      }
      triggers.push(ScrollTrigger.create({
        trigger: anchor,
        start,
        end: () => layoutTop(anchor, section) + anchor.offsetHeight,
        onEnter: play,
        onEnterBack: play,
        onLeaveBack: () => pending.delete(play),
        onLeave: finish,
        onRefresh: self => {
          if (self.scroll() >= self.end) finish()
          else if (self.scroll() >= self.start && reveal.progress() === 0) play()
        },
      }))
    }

    if (label) stage(label, Array.from(label.children) as HTMLElement[], {
      viewport: 0.8, distance: 12, delay: entrance.badgeDelay,
    })
    if (intro) stage(intro, Array.from(intro.children) as HTMLElement[], {
      distance: 12, delay: entrance.introDelay,
    })

    if (desktop) {
      copies.forEach((copy, index) => stage(copy, Array.from(copy.children) as HTMLElement[], {
        artwork: index === 0 && art ? [art] : [],
        waitForSnap: index === 0,
      }))
    } else {
      // On phones the illustration and text occupy different reading positions.
      // Later cards already enter through the stack: keep their copy readable.
      if (mobileArt) stage(mobileArt, [], {
        artwork: art ? [art, mobileArt] : [mobileArt], waitForSnap: true,
      })
      if (copies[0]) stage(copies[0], Array.from(copies[0].children) as HTMLElement[])
    }

    const detachScroll = lenis?.on("scroll", () => pending.forEach(play => play()))
    const refresh = () => {
      if (!active || frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (active) triggers.forEach(trigger => trigger.refresh())
      })
    }
    // The morph configures the phone stack after this layout effect. Observe
    // that layout as well as font changes without refreshing unrelated sections.
    const observer = new ResizeObserver(refresh)
    observer.observe(root)
    copies.forEach(copy => observer.observe(copy))
    void document.fonts?.ready.then(refresh)
    window.addEventListener("pageshow", refresh)
    return () => {
      active = false
      pending.clear()
      detachScroll?.()
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("pageshow", refresh)
    }
  }, root)

  return () => media.revert()
}
