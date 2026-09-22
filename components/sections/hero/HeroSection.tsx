"use client"

import gsap from "gsap"
import { useEffect, useLayoutEffect, useRef } from "react"
import { WaveBrandCard } from "./WaveBrandCard"
import { BrandBracket } from "@/components/atoms/BrandBracket"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { Breakpoint } from "@/components/atoms/Breakpoint"
import { HalftoneBackground } from "@/components/atoms/HalftoneBackground"
import { ScrollReveal } from "@/components/atoms/ScrollReveal"
import { ShimmerHalftone } from "@/components/atoms/ShimmerHalftone"
import { Ticker } from "@/components/atoms/Ticker"
import { TopBar } from "@/components/layout/TopBar"
import styles from "./hero.module.css"
import { HERO_DOTS_ANIMATED, HERO_HALFTONE, HERO_SHIMMER, HERO_STATIC_DOT_COLOR } from "./hero.background"
import type { Breakpoint as Bp } from "@/lib/breakpoints"
import {
  CTA_HREF,
  CTA_LABEL,
  EYEBROW,
  HIGHLIGHT_AFTER,
  HIGHLIGHT_BEFORE,
  HIGHLIGHT_WORD,
  SECTION_TITLE_EFFECT,
  SECTION_TITLE_LINES,
  SUBTITLE_INTRO,
  TICKER_CONFIG,
  TICKER_DIRECTION,
  TICKER_PATH,
  TICKER_SPEED_PERCENT_PER_SECOND,
  WAVE_CARD_GAP,
  WAVE_CARD_WIDTH,
  getBrandLogos,
} from "./hero.content"

const tickerChildren = getBrandLogos().map((logo) => ({
  key: logo.brandName,
  content: <WaveBrandCard logo={logo} />,
}))

const TICKER_BREAKPOINTS: readonly [Bp, keyof typeof TICKER_CONFIG][] = [
  ["desktop", "desktop"],
  ["tablet", "tablet"],
  ["phone", "phone"],
]

/**
 * "Section - Brands and Statistics": the studio pitch (eyebrow, headline,
 * two-paragraph copy, CTA), a curved wave ticker of brand logos, and four
 * self-animating stat counters.
 */
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)
  // A ref, not state, on purpose: toggling state here re-rendered the whole
  // hero on scroll, and each re-render made Framer's RichText re-apply its
  // inline styles over the GSAP-driven magnetic transforms (title jumping,
  // going dead until a click). Nothing about scrolling re-renders now.
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

  // Magnetic parallax on the spiral + headline, ported from the AURA
  // template's Hero.svelte: a window-level mousemove drives GSAP, the
  // spiral drifts opposite the cursor (slower, "receding"), the title
  // lines drift with it (faster, staggered) - same formula, magnitude and
  // easing as the source. Gated on pointer capability, not viewport width
  // (the template's `innerWidth <= 768` proxy for "touch" also switched it
  // off for a mouse in a narrow window, e.g. responsive-design mode): it
  // runs wherever a fine, hovering pointer exists, and follows changes.
  // Touch devices get the same drift from the finger's position instead.
  useEffect(() => {
    const heading = headingRef.current
    const spiral = spiralRef.current
    if (!heading || !spiral) return
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Plain wrapper divs of our own around each title line (see the JSX),
    // never Framer's RichText wrapper itself: Framer re-applies inline
    // styles to its own element on every render, which would clobber the
    // transform GSAP writes here and desync GSAP's cache from the DOM.
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
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} data-framer-name="Section - Brands and Statistics" id="statistics">
      <div className={styles.utilityRail}>
        <TopBar />
      </div>
      {/* The existing gradient and artwork scroll together with the hero. */}
      <div className={styles.stage}>
        <div className={styles.artwork}>
          {HERO_DOTS_ANIMATED ? (
            <ShimmerHalftone {...HERO_HALFTONE} shimmer={HERO_SHIMMER} pausedRef={dotsPausedRef} className={styles.dotGrid} />
          ) : (
            <HalftoneBackground color={HERO_STATIC_DOT_COLOR} {...HERO_HALFTONE} className={styles.dotGrid} />
          )}

          <ScrollReveal className={styles.tickerContainer}>
            {TICKER_BREAKPOINTS.map(([bp, configKey]) => (
              <Breakpoint key={bp} on={[bp]}>
                <Ticker
                  svgPath={TICKER_PATH.svgPath}
                  viewBox={TICKER_PATH.viewBox}
                  repeat={TICKER_CONFIG[configKey].repeat}
                  scale={TICKER_CONFIG[configKey].scale}
                  itemWidth={WAVE_CARD_WIDTH}
                  itemGap={WAVE_CARD_GAP}
                  speedPercentPerSecond={TICKER_SPEED_PERCENT_PER_SECOND}
                  direction={TICKER_DIRECTION}
                  pausedRef={ribbonPausedRef}
                  children={tickerChildren}
                />
              </Breakpoint>
            ))}
          </ScrollReveal>
        </div>
      </div>

      <div className={styles.flow}>
        <div className={styles.utilitySpacer} aria-hidden="true" />
        <div className={styles.content}>
          <div className={styles.spacerTop} aria-hidden="true" />

          <div className={styles.headingFrame}>
            <ScrollReveal className={styles.headingContainer}>
              {/* display:contents: a ref boundary around the reveal's children
                  without becoming a flex item itself, so .headingAndLabel /
                  .subtitleGroup / .cta keep participating directly in
                  .headingContainer's flex gap as before. */}
              <div ref={headingRef} style={{ display: "contents" }}>
                <div ref={spiralRef} className={styles.spiralField} aria-hidden="true" />

                <div className={styles.headingAndLabel} data-framer-name="Heading and Label">
                  <p className={styles.eyebrow}>{EYEBROW}</p>
                  {SECTION_TITLE_LINES.map((line) => (
                    <div key={line} className={styles.titleLine}>
                      <AnimatedHeading
                        as="h2"
                        text={line}
                        effect={SECTION_TITLE_EFFECT}
                        className={styles.titleWrapper}
                        textClassName={styles.title}
                        textAlign="center"
                      />
                    </div>
                  ))}
                </div>

                <p className={styles.subtitle}>{SUBTITLE_INTRO}</p>

                <a href={CTA_HREF} className={styles.ctaButton}>
                  {CTA_LABEL}
                  <svg
                    className={styles.ctaArrow}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>

                <div className={styles.highlight}>
                  <BrandBracket side="open" className={styles.highlightBracket} />
                  <p className={styles.highlightText}>
                    {HIGHLIGHT_BEFORE}
                    <mark className={styles.highlightMark}>
                      <svg className={styles.highlightStroke} viewBox="0 0 180 40" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M8 12C48 4 112 4 171 8L175 29C124 25 61 29 8 35L3 20Z" fill="currentColor" />
                        <path d="M13 33C61 27 119 25 169 28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {HIGHLIGHT_WORD}
                    </mark>
                    {HIGHLIGHT_AFTER}
                  </p>
                  <BrandBracket side="close" className={styles.highlightBracket} />
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className={styles.spacerMid} aria-hidden="true" />
          {/* Reserves the ribbon's room in the flow; the ribbon itself is in .stage. */}
          <div className={styles.tickerGhost} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
