"use client"

import gsap from "gsap"
import { useEffect, useLayoutEffect, useRef } from "react"
import styles from "./hero.module.css"

export function useHeroMotion() {
  const heroRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)
  // Animation visibility changes must not re-render the headline.
  const ribbonPausedRef = useRef(false)
  // Rest the decorative animation once the hero has scrolled out of view.
  const dotsPausedRef = useRef(false)
  const heroOffscreenRef = useRef(false)

  // The hero scrolls normally. Only observe visibility to pause its existing
  // artwork, and measure the utility strip to retain the approved spacing.
  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const topBar = document.getElementById("hero-topbar")
    const ribbon = hero.getElementsByClassName(styles.tickerContainer)[0]
    const measure = () => {
      if (topBar) hero.style.setProperty("--hero-topbar-height", `${topBar.offsetHeight}px`)
    }
    const resize = new ResizeObserver(measure)
    if (topBar) resize.observe(topBar)
    measure()

    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) {
          dotsPausedRef.current = !entry.isIntersecting
          heroOffscreenRef.current = !entry.isIntersecting
        }
        if (entry.target === ribbon) ribbonPausedRef.current = !entry.isIntersecting
      })
    })
    visibility.observe(hero)
    if (ribbon) visibility.observe(ribbon)

    return () => {
      resize.disconnect()
      visibility.disconnect()
      hero.style.removeProperty("--hero-topbar-height")
      dotsPausedRef.current = false
      ribbonPausedRef.current = false
      heroOffscreenRef.current = false
    }
  }, [])

  // Cursor and touch parallax share the same motion settings.
  useEffect(() => {
    const heading = headingRef.current
    const spiral = spiralRef.current
    if (!heading || !spiral) return
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const titleLines = Array.from(heading.getElementsByClassName(styles.titleLine))
    if (titleLines.length === 0) return

    const drift = (clientX: number, clientY: number) => {
      if (reducedMotion.matches || heroOffscreenRef.current) return
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      gsap.to(spiral, { x: x * -1, y: y * -1, duration: 2, ease: "power2.out" })
      gsap.to(titleLines, { x, y, duration: 1.5, ease: "power2.out", stagger: 0.01 })
    }
    const handleMouseMove = (e: MouseEvent) => drift(e.clientX, e.clientY)

    // Touch: the finger stands in for the cursor. It has to react on
    // touchstart, not only touchmove - a tap or a press never moves, and a
    // drag is a pan that scrolls the hero by far more than the drift, so
    // move-only would never be seen. Touching nudges the composition toward
    // the finger at once, dragging keeps it following, and everything eases
    // back to rest when the last finger lifts (unlike a mouse, no pointer
    // position remains to follow). Passive listeners, so scrolling is never
    // delayed by them.
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) drift(touch.clientX, touch.clientY)
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return
      gsap.to(spiral, { x: 0, y: 0, duration: 2, ease: "power2.out" })
      gsap.to(titleLines, { x: 0, y: 0, duration: 1.5, ease: "power2.out", stagger: 0.01 })
    }

    const sync = () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (finePointer.matches) window.addEventListener("mousemove", handleMouseMove)
    }
    sync()
    finePointer.addEventListener("change", sync)
    window.addEventListener("touchstart", handleTouch, { passive: true })
    window.addEventListener("touchmove", handleTouch, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true })
    return () => {
      finePointer.removeEventListener("change", sync)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouch)
      window.removeEventListener("touchmove", handleTouch)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchcancel", handleTouchEnd)
      gsap.killTweensOf([spiral, ...titleLines])
      gsap.set([spiral, ...titleLines], { clearProps: "transform" })
    }
  }, [])

  return { heroRef, headingRef, spiralRef, ribbonPausedRef, dotsPausedRef }
}
