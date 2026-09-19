"use client"

import gsap from "gsap"
import { useEffect, useRef } from "react"
import { WaveBrandCard } from "./WaveBrandCard"
import { BrandBracket } from "@/components/atoms/BrandBracket"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { Breakpoint } from "@/components/atoms/Breakpoint"
import { HalftoneBackground } from "@/components/atoms/HalftoneBackground"
import { ScrollReveal } from "@/components/atoms/ScrollReveal"
import { Ticker } from "@/components/atoms/Ticker"
import { TopBar } from "@/components/layout/TopBar"
import styles from "./hero.module.css"
import { HERO_HALFTONE } from "./hero.background"
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

/** Keep in sync with --push-gap in hero.module.css (pinned mode). */
const HERO_PUSH_GAP = 24

/** Extra travel on top of the native push, as a fraction of the contact-to-cover distance. Mirrors the `-0.1` in the CSS keyframes. */
const HERO_EXIT_TRAVEL = 0.1

/** Same curve as the CSS `linear(0, 0.55 20%, 0.85 45%, 1)`: front-loaded, most of the lift right after contact. */
const EXIT_EASE_POINTS: readonly [number, number][] = [
  [0, 0],
  [0.2, 0.55],
  [0.45, 0.85],
  [1, 1],
]

function exitEase(progress: number): number {
  for (let i = 1; i < EXIT_EASE_POINTS.length; i++) {
    const [x0, y0] = EXIT_EASE_POINTS[i - 1]
    const [x1, y1] = EXIT_EASE_POINTS[i]
    if (progress <= x1) return y0 + ((progress - x0) / (x1 - x0)) * (y1 - y0)
  }
  return 1
}

/**
 * "Section - Brands and Statistics": the studio pitch (eyebrow, headline,
 * two-paragraph copy, CTA), a curved wave ticker of brand logos, and four
 * self-animating stat counters.
 */
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const spacerTopRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)
  // A ref, not state, on purpose: toggling state here re-rendered the whole
  // hero on scroll, and each re-render made Framer's RichText re-apply its
  // inline styles over the GSAP-driven magnetic transforms (title jumping,
  // going dead until a click). Nothing about scrolling re-renders now.
  const ribbonCoveredRef = useRef(false)

  // Rest offset of the heading block, for its position: sticky `top` in
  // pinned mode (hero.module.css): with `top` equal to where it already
  // sits, sticking begins on the first pixel of scroll with no jump. Read
  // off the static spacer above it (never transformed, never sticky) as
  // layout offsets, so neither ScrollReveal's transform nor the sticky
  // shift itself can skew the reading. Re-measured only when layout
  // changes - nothing here runs per scroll.
  useEffect(() => {
    const hero = heroRef.current
    const content = contentRef.current
    const spacer = spacerTopRef.current
    if (!hero || !content || !spacer) return
    // The ScrollReveal wrapper around the heading block (no ref forwarding).
    const heading = content.getElementsByClassName(styles.headingContainer)[0] as HTMLElement | undefined
    const measure = () => {
      const top = content.offsetTop + spacer.offsetTop + spacer.offsetHeight
      hero.style.setProperty("--heading-top", `${top}px`)
      // Rest bottom of the block: where the incoming section makes contact,
      // i.e. where its accelerated exit animation starts (see the CSS).
      hero.style.setProperty("--heading-bottom", `${top + (heading?.offsetHeight ?? 0)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    observer.observe(spacer)
    if (heading) observer.observe(heading)
    if (content.parentElement) observer.observe(content.parentElement)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  // Cover progress for the blur (pinned mode): #page-body slides over the
  // sticky stage, and its top edge tells how much of the stage is gone.
  // Written as a CSS variable from one rAF-throttled scroll handler, no
  // render per pixel - the only state is the ribbon-covered flag, which
  // pauses the ticker (it would otherwise keep animating twelve cards under
  // an opaque section). Text position is NOT handled here: that's native
  // position: sticky, so it can't lag behind the scroll.
  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    if (!hero || !stage) return
    const pageBody = document.getElementById("page-body")
    const ribbon = stage.getElementsByClassName(styles.tickerContainer)[0] ?? null
    const heading = hero.getElementsByClassName(styles.headingContainer)[0] as HTMLElement | undefined
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    // The heading's accelerated exit is a CSS scroll-driven animation
    // (hero.module.css, @supports block). Firefox doesn't ship those yet
    // (caniuse: 159+), so where they're missing the same animation is
    // replicated here: identical range, easing and travel, written
    // unquantised straight to the element's `translate` once per frame.
    // Never both - the CSS path wins wherever it exists.
    const nativeExit = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")
    const pinned = window.matchMedia("(min-height: 700px)")
    let frame = 0
    let lastCover = -1

    const updateExitFallback = (stageHeight: number) => {
      if (!heading || nativeExit) return
      if (!pinned.matches || reducedMotion.matches) {
        if (heading.style.getPropertyValue("translate")) heading.style.removeProperty("translate")
        return
      }
      const headingBottom = Number.parseFloat(hero.style.getPropertyValue("--heading-bottom")) || 0
      // Contact: the incoming edge (stageHeight - scrollY) meets the block's
      // rest bottom plus its air; full cover: the edge reaches the top.
      const contact = stageHeight - headingBottom - HERO_PUSH_GAP
      const progress = Math.min(1, Math.max(0, (window.scrollY - contact) / (stageHeight - contact || 1)))
      if (progress <= 0) {
        if (heading.style.getPropertyValue("translate")) heading.style.removeProperty("translate")
        return
      }
      const travel = HERO_EXIT_TRAVEL * (headingBottom + HERO_PUSH_GAP)
      heading.style.setProperty("translate", `0 ${(-travel * exitEase(progress)).toFixed(2)}px`)
    }

    const update = () => {
      frame = 0
      const stageRect = stage.getBoundingClientRect()
      const edge = pageBody ? pageBody.getBoundingClientRect().top : stageRect.bottom
      updateExitFallback(stageRect.height)
      // Pause once the ribbon itself is under the incoming section (or off
      // screen), not just when the whole hero is - it's at the bottom, so
      // that's early in the slide-over. Read by the Ticker's frame loop.
      ribbonCoveredRef.current = ribbon ? ribbon.getBoundingClientRect().top >= edge : edge <= 0
      // 0 while untouched, 1 once ~70% of the stage is covered so the blur
      // has fully landed before it disappears. Quantised so identical frames
      // don't restyle; 0 under reduced motion.
      const fraction = reducedMotion.matches ? 0 : 1 - Math.min(1, Math.max(0, edge / (stageRect.height || 1)))
      const cover = Math.round(Math.min(1, fraction / 0.7) * 50) / 50
      if (cover !== lastCover) {
        lastCover = cover
        hero.style.setProperty("--hero-cover", String(cover))
        hero.dataset.covering = cover > 0 ? "true" : "false"
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    reducedMotion.addEventListener("change", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      reducedMotion.removeEventListener("change", schedule)
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

    // Plain wrapper divs of our own around each title line (see the JSX),
    // never Framer's RichText wrapper itself: Framer re-applies inline
    // styles to its own element on every render, which would clobber the
    // transform GSAP writes here and desync GSAP's cache from the DOM.
    const titleLines = Array.from(heading.getElementsByClassName(styles.titleLine))
    if (titleLines.length === 0) return

    const drift = (clientX: number, clientY: number) => {
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
      {/* Backdrop stage: pinned and blurred in pinned mode (see the CSS). The
          ribbon lives here so it gets covered along with the texture, while
          the text in .flow below is pushed instead. */}
      <div ref={stageRef} className={styles.stage}>
        <HalftoneBackground color="var(--hero-dots)" {...HERO_HALFTONE} className={styles.dotGrid} />

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
                pausedRef={ribbonCoveredRef}
                children={tickerChildren}
              />
            </Breakpoint>
          ))}
        </ScrollReveal>
      </div>

      <div className={styles.flow}>
        <TopBar />
        <div ref={contentRef} className={styles.content}>
          <div ref={spacerTopRef} className={styles.spacerTop} aria-hidden="true" />

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

          <div className={styles.spacerMid} aria-hidden="true" />
          {/* Reserves the ribbon's room in the flow; the ribbon itself is in .stage. */}
          <div className={styles.tickerGhost} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
