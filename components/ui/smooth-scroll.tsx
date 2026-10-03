"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { useEffect, type ReactNode } from "react"

const navigationEase = (progress: number) => (1 - Math.cos(Math.PI * progress)) / 2

/** Section padding already reserves space below the fixed header. Subtract
 * only the missing clearance, as the existing section transitions do. */
function sectionDestination(target: HTMLElement) {
  const rect = target.getBoundingClientRect()
  const clearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const style = getComputedStyle(target)
  const heading = target.matches("section") ? target.querySelector<HTMLElement>("header") : null
  const inset = heading
    ? heading.getBoundingClientRect().top - rect.top
    : parseFloat(style.paddingTop) || 0
  const offset = Math.max(0, clearance - inset)
  const margin = parseFloat(style.scrollMarginTop) || 0
  return Math.max(0, rect.top + window.scrollY - offset - margin)
}

/** Keep URL fragments and keyboard focus in sync with the animated scroll. */
function SectionNavigation() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    let mounted = true
    const targetFor = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))) }
      catch { return null }
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return
      const url = new URL(link.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return
      const target = targetFor(url.hash)
      if (!target) return
      event.preventDefault()
      if (location.hash !== url.hash) history.pushState(null, "", url.href)
      const destination = Math.min(sectionDestination(target), lenis.limit)
      const distance = Math.abs(destination - lenis.animatedScroll)
      lenis.scrollTo(destination, {
        duration: Math.min(1.5, Math.max(0.9, 0.8 + distance / window.innerHeight * 0.1)),
        easing: navigationEase,
        lerp: 0,
        immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onComplete: () => {
          if (!mounted || !target.isConnected) return
          const previous = target.getAttribute("tabindex")
          target.setAttribute("tabindex", "-1")
          target.focus({ preventScroll: true })
          if (previous === null) target.removeAttribute("tabindex")
          else target.setAttribute("tabindex", previous)
        },
      })
    }
    const restoreFragment = () => {
      const target = targetFor(location.hash)
      if (target) lenis.scrollTo(sectionDestination(target), { immediate: true })
    }
    // Also handle direct /en#section visits and native history navigation.
    restoreFragment()
    document.addEventListener("click", onClick)
    window.addEventListener("hashchange", restoreFragment)
    return () => {
      mounted = false
      document.removeEventListener("click", onClick)
      window.removeEventListener("hashchange", restoreFragment)
    }
  }, [lenis])
  return null
}

/** Smooth the document's native scroll without adding a scrolling container. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        // SectionNavigation prevents the browser's immediate jump first.
        anchors: false,
        allowNestedScroll: true,
        respectReducedMotion: true,
      }}
    >
      <SectionNavigation />
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
