import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"
import { createGeneratorEasing, spring } from "motion"
import type Lenis from "lenis"
import { GUARANTEE_ENTRANCE as entrance } from "./guarantees-timeline.content"

/** Layout coordinates exclude both the entrance transforms and the mobile
 * cards' sticky offset, including when a refresh happens halfway through it. */
function layoutTop(element: HTMLElement, section: HTMLElement) {
  let top = section.getBoundingClientRect().top + window.scrollY
  for (let node: HTMLElement | null = element; node && node !== section; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop
  }
  return top
}

// Leave room around the guarantee copy titles during their lateral entrance.
const textClip = {
  left: "inset(-18% 100% -18% 0%)",
  open: "inset(-18% -6% -18% -6%)",
}

/** One-shot entrances on outer artwork wrappers and text. The inner morph,
 * foil and card stack continue to own their respective transforms. */
export function mountGuaranteesEntrance(root: HTMLElement, lenis?: Lenis) {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  const revealEase = CustomEase.create("guarantee-reveal", entrance.ease)
  const media = gsap.matchMedia()

  media.add({
    desktop: "(min-width: 810px)",
    mobile: "(max-width: 809.98px)",
    reduced: "(prefers-reduced-motion: reduce)",
  }, (context) => {
    const { desktop, reduced } = context.conditions!
    const section = root.closest<HTMLElement>("section") ?? root
    const label = root.querySelector<HTMLElement>("[data-guarantee-label]")
    const title = root.querySelector<HTMLElement>("[data-guarantee-title]")
    const intro = root.querySelector<HTMLElement>("[data-guarantee-intro]")
    const art = root.querySelector<HTMLElement>("[data-guarantee-art-slot]")
    const visualColumn = root.querySelector<HTMLElement>("[data-guarantee-visual]")
    const mobileArt = root.querySelector<HTMLElement>("[data-guarantee-mobile-art]")
    const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-guarantee-copy]"))
    const anchors = [label, intro, art, mobileArt, ...copies].filter((element): element is HTMLElement => !!element)
    if (reduced) {
      anchors.forEach(element => { element.dataset.guaranteeEntered = "" })
      return
    }

    let active = true
    let ready = false
    let frame = 0
    const triggers: ScrollTrigger[] = []
    const pending = new Set<() => void>()
    const viewport = desktop ? entrance.startViewport : entrance.mobileStartViewport
    // Sample Motion's physical springs as GSAP eases: one timeline still owns
    // the entrance, with the reference's stiffness and damping values.
    const lift = createGeneratorEasing(entrance.artSpring, 100, spring)
    const floatLayer = desktop ? art?.querySelector<HTMLElement>("[data-guarantee-art-float]") : null
    const floating = floatLayer ? gsap.to(floatLayer, {
      y: -entrance.artFloatDistance,
      rotation: entrance.artFloatRotation,
      duration: entrance.artFloatDuration / 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      paused: true,
    }) : undefined
    let artEntered = false
    let artVisible = false
    const syncFloat = () => {
      floating?.paused(!active || !artEntered || !artVisible || document.hidden)
    }
    const floatObserver = floating ? new IntersectionObserver(([entry]) => {
      artVisible = entry.isIntersecting
      syncFloat()
    }) : undefined
    if (art) floatObserver?.observe(art)
    if (floating) document.addEventListener("visibilitychange", syncFloat)

    const stage = (anchor: HTMLElement, items: HTMLElement[], options: {
      viewport?: number
      delay?: number
      distance?: number
      artwork?: HTMLElement
      endAt?: HTMLElement
      waitForSnap?: boolean
      onComplete?: () => void
    } = {}) => {
      const triggerViewport = options.viewport ?? viewport
      const start = () => Math.max(0, layoutTop(anchor, section) - window.innerHeight * triggerViewport)
      // Preserve completed entrances across breakpoint/Lenis changes, but let
      // visible content animate on a fresh mount at a restored scroll position.
      if (anchor.hasAttribute("data-guarantee-entered")) {
        options.onComplete?.()
        return
      }

      let started = false
      const artwork = options.artwork?.querySelector<HTMLElement>("[data-guarantee-art-entrance]")
      const reveal = gsap.timeline({ paused: true, onComplete: () => {
        if (!active) return
        anchor.dataset.guaranteeEntered = ""
        options.onComplete?.()
      } })
      if (artwork) {
        // Blob, foil and illustration rise and settle together. The parent
        // owns the separate floating transform after this entrance completes.
        reveal.fromTo(artwork, {
          y: entrance.artDistance,
          scale: entrance.artScale,
          rotation: entrance.artRotation,
        }, {
          y: 0, scale: 1, rotation: 0, duration: lift.duration, ease: lift.ease,
        }, entrance.artDelay).fromTo(artwork, { opacity: 0 }, {
          opacity: 1, duration: entrance.artFadeDuration, ease: "power1.inOut",
        }, entrance.artFadeDelay)
      }
      const delay = options.delay ?? entrance.copyDelay
      items.forEach((item, index) => {
        const at = delay + index * entrance.copyStagger
        if (item.tagName === "H3") {
          const distance = desktop ? entrance.copyDistance : entrance.mobileDistance
          reveal.fromTo(item, {
            x: -distance,
            y: entrance.textRise,
            clipPath: textClip.left,
          }, {
            x: 0, y: 0, clipPath: textClip.open,
            duration: entrance.titleDuration, ease: revealEase,
          }, at)
        } else {
          reveal.fromTo(item, { y: options.distance ?? entrance.textRise }, {
            y: 0, duration: entrance.duration, ease: revealEase,
          }, at)
        }
        reveal.fromTo(item, { opacity: 0 }, {
          opacity: 1, duration: entrance.fadeDuration, ease: "power1.inOut",
        }, at)
      })
      if (items.length) reveal.set(items, { clearProps: "opacity,transform,clipPath" })
      if (artwork) reveal.set(artwork, { clearProps: "opacity,transform" })

      const play = () => {
        if (!active || !ready || started || anchor.hasAttribute("data-guarantee-entered")) return
        if (options.waitForSnap && lenis?.userData.sectionTransition && lenis.isScrolling === "smooth"
          && section.getBoundingClientRect().top > window.innerHeight * entrance.snapStart) {
          pending.add(play)
          return
        }
        pending.delete(play)
        started = true
        reveal.play()
      }
      const finish = () => {
        if (!active || !ready) return
        pending.delete(play)
        anchor.dataset.guaranteeEntered = ""
        reveal.progress(1).pause()
      }
      const syncPosition = (self: ScrollTrigger) => {
        if (!active || !ready) return
        const rect = anchor.getBoundingClientRect()
        // A sticky illustration may still be visible after its original
        // layout position has passed. Give the actual reading area priority.
        if (rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight * triggerViewport) play()
        else if (self.scroll() >= self.end) finish()
        else if (self.scroll() >= self.start) play()
      }
      triggers.push(ScrollTrigger.create({
        trigger: anchor,
        start,
        end: () => {
          const last = options.endAt ?? anchor
          return layoutTop(last, section) + last.offsetHeight
        },
        onEnter: play,
        onEnterBack: play,
        onLeaveBack: () => pending.delete(play),
        onLeave: syncPosition,
        onRefresh: syncPosition,
      }))
    }

    if (label) stage(label, Array.from(label.children) as HTMLElement[], {
      viewport: 0.8, distance: 12, delay: entrance.badgeDelay,
    })
    if (intro) stage(intro, Array.from(intro.children) as HTMLElement[], {
      distance: 12, delay: entrance.introDelay,
    })

    if (desktop) {
      // The sticky artwork stays visible through all three rows. Its entrance
      // must still play when a reload lands beside the second or third copy.
      if (art) stage(art, [], {
        artwork: art, endAt: visualColumn ?? art, waitForSnap: true,
        onComplete: () => { artEntered = true; syncFloat() },
      })
      copies.forEach((copy, index) => stage(copy, Array.from(copy.children) as HTMLElement[], {
        waitForSnap: index === 0,
      }))
    } else {
      // On phones the illustration and text occupy different reading positions.
      // Later cards already enter through the stack: keep their copy readable.
      if (mobileArt) stage(mobileArt, [], {
        artwork: mobileArt, waitForSnap: true,
      })
      if (copies[0]) stage(copies[0], Array.from(copies[0].children) as HTMLElement[])
    }

    const detachScroll = lenis?.on("scroll", () => pending.forEach(play => play()))
    const refresh = () => {
      if (!active || !ready || frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (active) triggers.forEach(trigger => trigger.refresh())
      })
    }
    const revealAfterLoad = () => {
      if (!active || ready || frame) return
      // pageshow can precede native scroll restoration. Wait for the next
      // layout frame before an early refresh is allowed to finish an entrance.
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!active) return
        ready = true
        triggers.forEach(trigger => trigger.refresh())
      })
    }
    // The morph configures the phone stack after this layout effect. Observe
    // that layout as well as font changes without refreshing unrelated sections.
    const observer = new ResizeObserver(refresh)
    observer.observe(root)
    if (title) observer.observe(title)
    copies.forEach(copy => observer.observe(copy))
    void document.fonts?.ready.then(refresh)
    window.addEventListener("pageshow", revealAfterLoad)
    window.addEventListener("pageshow", refresh)
    // Client navigation or late hydration may mount after pageshow already ran.
    if (document.readyState === "complete") revealAfterLoad()
    return () => {
      active = false
      pending.clear()
      detachScroll?.()
      floatObserver?.disconnect()
      document.removeEventListener("visibilitychange", syncFloat)
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("pageshow", revealAfterLoad)
      window.removeEventListener("pageshow", refresh)
    }
  }, root)

  return () => media.revert()
}
