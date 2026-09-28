"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, type RefObject } from "react"
import { SHOWCASE_THEME_REVEAL } from "./realisations.content"

gsap.registerPlugin(ScrollTrigger)

/** Change only the surface and palette; content geometry and device motion are independent. */
export function useShowcaseTheme(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    const surface = section?.closest<HTMLElement>("[data-showcase-theme]")
    const visual = section?.querySelector<HTMLElement>("[data-miau-visual]")
    if (!section || !surface || !visual) return

    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const config = SHOWCASE_THEME_REVEAL
      const originalTheme = surface.dataset.headerTheme
      const properties = ["--project-theme-progress", "--project-theme-tone"] as const
      const originalStyles = properties.map(property => surface.style.getPropertyValue(property))
      const state = { progress: 0 }

      const render = () => {
        const p = state.progress
        const dark = p < config.foregroundSwitch
        // Fade the dark palette towards white, switch to black when the surface
        // supports it, then restore the light palette. Simultaneously fading
        // light ink to dark ink would make text disappear against mid-grey.
        const tone = dark
          ? 1 - p / config.foregroundSwitch
          : (p - config.foregroundSwitch) / (1 - config.foregroundSwitch)
        const theme = dark ? "dark" : "light"
        surface.style.setProperty("--project-theme-progress", `${p * 100}%`)
        surface.style.setProperty("--project-theme-tone", `${tone * 100}%`)
        if (surface.dataset.headerTheme !== theme) surface.dataset.headerTheme = theme
      }

      const tween = gsap.to(state, {
        progress: 1,
        ease: config.ease,
        onUpdate: render,
        scrollTrigger: {
          trigger: visual,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          invalidateOnRefresh: true,
          onRefresh: trigger => {
            trigger.animation?.totalProgress(trigger.progress)
            render()
          },
        },
      })
      // ScrollTrigger can initialize a restored position with callbacks
      // suppressed. Apply that position explicitly before the first paint.
      tween.totalProgress(tween.scrollTrigger?.progress ?? 0)
      render()

      return () => {
        properties.forEach((property, index) => {
          if (originalStyles[index]) surface.style.setProperty(property, originalStyles[index])
          else surface.style.removeProperty(property)
        })
        if (originalTheme === undefined) delete surface.dataset.headerTheme
        else surface.dataset.headerTheme = originalTheme
      }
    }, section)

    return () => media.revert()
  }, [sectionRef])
}
