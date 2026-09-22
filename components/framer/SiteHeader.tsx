"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { BrandLogo } from "@/components/atoms/BrandLogo"
import styles from "./SiteHeader.module.css"

const NAVIGATION = [
  { href: "#sites-vitrines", label: "Sites vitrines" },
  { href: "#saas-mobile", label: "SaaS & mobile" },
  { href: "#le-studio", label: "Le studio" },
]

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const navigationRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [ready, setReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    const header = headerRef.current
    const navigation = navigationRef.current
    if (!header || !navigation) return

    const topBar = document.getElementById("hero-topbar")
    const hero = document.getElementById("statistics")
    const themedSections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"))
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let topBarHeight = 0
    let scrollFrame = 0
    let wasScrolled = false
    let previousSurface = ""

    // Measure the actual links, including after the local font loads.
    const measureNavigation = () => {
      header.style.setProperty("--navigation-width", `${navigation.getBoundingClientRect().width}px`)
    }
    const measureTopBar = () => {
      // The wrapper stays full height while its inner surface fades away.
      topBarHeight = topBar?.getBoundingClientRect().height ?? 0
    }
    const updateScroll = () => {
      const heroVisibleBottom = hero?.getBoundingClientRect().bottom ?? null

      // Follow the section actually beneath the fixed navigation, including
      // the return to the light offers surface at the end of the guarantees.
      const headerRect = header.getBoundingClientRect()
      const sampleY = headerRect.top + headerRect.height / 2
      const surface = themedSections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= sampleY && rect.bottom > sampleY
      })?.dataset.headerTheme ?? "light"
      if (surface !== previousSurface) {
        previousSurface = surface
        header.dataset.surface = surface
      }

      // Retain the full-size navigation until the hero leaves the viewport.
      // A small hysteresis keeps it steady when reversing at that boundary.
      const y = window.scrollY
      const nextScrolled = heroVisibleBottom === null
        ? (wasScrolled ? y >= 32 : y > 80)
        : (wasScrolled ? heroVisibleBottom < 48 : heroVisibleBottom <= 0)
      if (nextScrolled !== wasScrolled) {
        wasScrolled = nextScrolled
        setScrolled(nextScrolled)
      }

      // The utility strip now scrolls with the hero. Follow its actual edge
      // so the fixed navigation moves up as soon as that strip leaves.
      const visibleBar = topBar
        ? Math.min(topBarHeight, Math.max(0, topBar.getBoundingClientRect().bottom))
        : 0
      header.style.setProperty("--topbar-offset", `${visibleBar}px`)
      if (topBar) {
        topBar.inert = visibleBar === 0
      }
    }
    const scheduleUpdate = () => {
      if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0
          updateScroll()
        })
      }
    }
    const measureLayout = () => {
      measureNavigation()
      measureTopBar()
      scheduleUpdate()
    }

    // Initialize before paint, including when restoring a scrolled page.
    measureNavigation()
    measureTopBar()
    updateScroll()
    const observer = new ResizeObserver(measureLayout)
    observer.observe(navigation)
    if (topBar) observer.observe(topBar)
    if (hero) observer.observe(hero)
    themedSections.forEach((section) => observer.observe(section))

    const readyFrame = requestAnimationFrame(() => {
      measureTopBar()
      updateScroll()
      setReady(true)
    })
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", measureLayout)
    window.addEventListener("pageshow", measureLayout)
    reducedMotion.addEventListener("change", scheduleUpdate)
    return () => {
      cancelAnimationFrame(readyFrame)
      cancelAnimationFrame(scrollFrame)
      observer.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", measureLayout)
      window.removeEventListener("pageshow", measureLayout)
      reducedMotion.removeEventListener("change", scheduleUpdate)
      delete header.dataset.surface
    }
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1100px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [menuOpen])

  function closeMenu() {
    if (!menuOpen) return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled}
      data-ready={ready}
      data-menu-open={menuOpen}
      onBlur={(event) => {
        // This is a non-modal disclosure: Tab can leave it naturally.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setMenuOpen(false)
        }
      }}
    >
      <div className={styles.envelope} aria-hidden="true" />
      <a className={styles.logo} href="#statistics" aria-label="Le bon dev — accueil" onClick={closeMenu}>
        <BrandLogo placement="header" />
      </a>
      <button
        ref={menuButtonRef}
        className={styles.menuButton}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="header-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Fermer" : "Menu"}
        <span className={styles.menuIcon} aria-hidden="true"><span /><span /></span>
      </button>
      <div id="header-menu" className={styles.menuPanel}>
        <nav ref={navigationRef} className={styles.navigation} aria-label="Navigation principale">
          {NAVIGATION.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
        <a className={styles.contact} href="#contact" onClick={closeMenu}>
          <span>Parlons de votre projet</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  )
}
