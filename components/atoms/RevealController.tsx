"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SCROLL_REVEAL as reveal } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

/** Nearby group members share a beat. An explicit anchor can instead start
 * a whole block together, including its stacked content. */
export function RevealController() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    // Safari's collapsing toolbar changes innerHeight during a touch swipe.
    // Keep trigger positions stable until a real viewport/layout change.
    ScrollTrigger.config({ ignoreMobileResize: true })
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (!items.length) return

    const media = gsap.matchMedia()
    media.add({
      phone: reveal.phone,
      tablet: reveal.tablet,
      desktop: reveal.desktop,
      reduced: "(prefers-reduced-motion: reduce)",
    }, context => {
      const triggers = new Map<HTMLElement, ScrollTrigger>()
      const settle = (target: HTMLElement) => {
        target.dataset.revealDone = ""
        triggers.get(target)?.kill()
        gsap.killTweensOf(target, "transform,x,y,opacity")
        gsap.set(target, { clearProps: "transform,opacity" })
      }

      // A live preference change also completes in-flight entrances. Returning
      // to motion later must never hide content the reader has already seen.
      if (context.conditions?.reduced) {
        items.forEach(settle)
        return
      }

      const viewport = context.conditions?.phone ? reveal.phoneViewport : reveal.viewport
      const poses = new Map<HTMLElement, { x: number; y: number }>()
      const viewports = new Map<HTMLElement, number>()
      const groups = new Map<Element, HTMLElement[]>()
      const anchors = new Map<HTMLElement, HTMLElement>()
      const pending = items.filter(item => !item.hasAttribute("data-reveal-done"))
      pending.forEach(item => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(item).transform)
        poses.set(item, { x: matrix.m41, y: matrix.m42 })
        const customViewport = Number(item.closest<HTMLElement>("[data-reveal-viewport]")?.dataset.revealViewport)
        viewports.set(item, customViewport > 0 && customViewport <= 1 ? customViewport : viewport)
        const group = item.closest("[data-reveal-group]") ?? item
        const peers = groups.get(group) ?? []
        peers.push(item)
        groups.set(group, peers)
      })
      groups.forEach((peers, group) => {
        const anchor = group instanceof HTMLElement && group.hasAttribute("data-reveal-anchor")
          ? group
          : peers.find(item => item.hasAttribute("data-reveal-anchor"))
        if (anchor) peers.forEach(item => anchors.set(item, anchor))
      })

      // Measure the resting position, not the translated server pose. Otherwise
      // rises and side entrances cross different effective trigger lines.
      const top = (target: HTMLElement) => target.getBoundingClientRect().top - (poses.get(target)?.y ?? 0)
      const play = (target: HTMLElement) => context.add(() => {
        if (target.hasAttribute("data-reveal-done")) return
        const peers = groups.get(target.closest("[data-reveal-group]") ?? target) ?? [target]
        const triggerViewport = viewports.get(target) ?? viewport
        const sharedAnchor = anchors.get(target)
        const beat = peers.filter(item => !item.hasAttribute("data-reveal-done")
          && (sharedAnchor || item === target || top(item) <= innerHeight * (triggerViewport + reveal.groupReach)))
        let index = 0
        beat.forEach(item => {
          // Fast jumps / restored positions must not leave an invisible trail.
          if (item.getBoundingClientRect().bottom <= 0) {
            settle(item)
            return
          }
          const pose = poses.get(item)!
          item.dataset.revealDone = ""
          triggers.get(item)?.kill()
          const delay = Math.min(index++ * reveal.stagger, reveal.maxStagger)
          gsap.timeline({
            delay,
            onComplete: () => { gsap.set(item, { clearProps: "transform,opacity" }) },
          })
            .fromTo(item, { x: pose.x, y: pose.y, opacity: 0 }, {
              x: 0, y: 0, duration: reveal.duration, ease: reveal.ease,
            }, 0)
            .to(item, { opacity: 1, duration: reveal.opacityDuration, ease: reveal.opacityEase }, 0)
        })
      })

      pending.forEach(item => {
        // Initial content already at the reading line is restored immediately.
        const anchor = anchors.get(item) ?? item
        const triggerViewport = viewports.get(item) ?? viewport
        if (top(anchor) < innerHeight * triggerViewport) {
          settle(item)
          return
        }
        triggers.set(item, ScrollTrigger.create({
          trigger: item,
          start: () => Math.max(0, Math.min(
            window.scrollY + top(anchor) - innerHeight * triggerViewport,
            ScrollTrigger.maxScroll(window) - 1,
          )),
          once: true,
          onEnter: () => play(item),
        }))
      })

      const onFocus = (event: FocusEvent) => {
        // Keyboard focus must reveal pending content immediately. A pointer
        // press must keep its target in place until the click has completed.
        if (!(event.target instanceof Element) || !event.target.matches(":focus-visible")) return
        const target = event.target.closest<HTMLElement>("[data-reveal]")
        if (target && items.includes(target)) context.add(() => settle(target))
      }
      document.addEventListener("focusin", onFocus)
      return () => { document.removeEventListener("focusin", onFocus) }
    })

    let disposed = false
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => {
      disposed = true
      media.revert()
    }
  }, [pathname])

  return null
}
