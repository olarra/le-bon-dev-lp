"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, type RefObject } from "react"
import { MIAU_REVEAL } from "./realisations.content"

gsap.registerPlugin(ScrollTrigger)

export function useShowcaseMotion(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const visual = section.querySelector<HTMLElement>("[data-miau-visual]")
    const group = section.querySelector<HTMLElement>("[data-phone-group]")
    const sides = Array.from(section.querySelectorAll<HTMLElement>("[data-phone-side]"))
    const title = section.querySelector<HTMLElement>("[data-project-heading]")
    const hook = section.querySelector<HTMLElement>("[data-miau-hook]")
    if (!visual || !group || !title || !hook || sides.length !== 2) return

    const media = gsap.matchMedia()
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      compact: "(max-width: 899px)",
    }, context => {
      if (!context.conditions?.motion) return
      const config = MIAU_REVEAL
      const width = () => visual.clientWidth
      const finalSpread = context.conditions.compact ? config.sides.compactSpread : config.sides.to.spread
      const colorStart = { "--project-color-reveal": "0%" }
      const colorEnd = { "--project-color-reveal": "100%" }

      const reveal = gsap.timeline({
        defaults: { duration: 1, ease: config.ease },
        scrollTrigger: {
          trigger: visual,
          start: () => {
            const viewport = window.innerHeight
            const height = visual.offsetHeight
            const top = Math.max(
              viewport * config.range.startBottom - height,
              viewport * (config.range.endCenter + config.range.minimumTravel) - height / 2,
            )
            return `top ${top}px`
          },
          end: `center ${config.range.endCenter * 100}%`,
          scrub: config.scrub,
          invalidateOnRefresh: true,
        },
      })
      reveal.fromTo(group,
        { scale: config.group.scale, y: () => width() * config.group.y },
        { scale: 1, y: 0 }, 0)
      sides.forEach((phone, index) => {
        const direction = index === 0 ? -1 : 1
        reveal.fromTo(phone,
          { x: () => direction * width() * config.sides.from.spread, y: () => width() * config.sides.from.y, scale: config.sides.from.scale },
          { x: () => direction * width() * finalSpread, y: () => width() * config.sides.to.y, scale: config.sides.to.scale }, 0)
      })
      reveal.fromTo(hook, colorStart, colorEnd, 0)
      gsap.fromTo(title, colorStart, {
        ...colorEnd,
        ease: "none",
        scrollTrigger: { trigger: title, start: "top 92%", end: "top 42%", scrub: 0.3 },
      })
    }, section)

    // Fonts and breakpoint changes can alter the local trigger positions.
    let alive = true
    let refreshFrame = 0
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => { if (alive) ScrollTrigger.refresh() })
    }
    const resize = new ResizeObserver(refresh)
    resize.observe(section)
    resize.observe(visual)
    void document.fonts.ready.then(() => { if (alive) refresh() })

    return () => {
      alive = false
      cancelAnimationFrame(refreshFrame)
      resize.disconnect()
      media.revert()
    }
  }, [sectionRef])
}
