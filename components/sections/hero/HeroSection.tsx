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

/**
 * "Section - Brands and Statistics": the studio pitch (eyebrow, headline,
 * two-paragraph copy, CTA), a curved wave ticker of brand logos, and four
 * self-animating stat counters.
 */
export function HeroSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)

  // Magnetic parallax on the spiral + headline, ported from the AURA
  // template's Hero.svelte: a window-level mousemove drives GSAP, the
  // spiral drifts opposite the cursor (slower, "receding"), the title
  // lines drift with it (faster, staggered) - same formula, magnitude and
  // easing as the source, disabled under the same 768px width there too.
  useEffect(() => {
    const heading = headingRef.current
    const spiral = spiralRef.current
    if (!heading || !spiral || window.innerWidth <= 768) return

    const titleLines = Array.from(heading.getElementsByClassName(styles.titleWrapper))
    if (titleLines.length === 0) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      gsap.to(spiral, { x: x * -1, y: y * -1, duration: 2, ease: "power2.out" })
      gsap.to(titleLines, { x, y, duration: 1.5, ease: "power2.out", stagger: 0.01 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className={styles.section} data-framer-name="Section - Brands and Statistics" id="statistics">
      <TopBar />
      <div className={styles.content}>
        <HalftoneBackground color="var(--hero-dots)" {...HERO_HALFTONE} className={styles.dotGrid} />

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
                <AnimatedHeading
                  key={line}
                  as="h2"
                  text={line}
                  effect={SECTION_TITLE_EFFECT}
                  className={styles.titleWrapper}
                  textClassName={styles.title}
                  textAlign="center"
                />
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
                children={tickerChildren}
              />
            </Breakpoint>
          ))}
        </ScrollReveal>

        <svg className={styles.divider} viewBox="0 0 1440 63" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {/* Filled with the next section's background (see globals.css). */}
          <path d="M0 14 Q620 84 1440 8 V63 H0 Z" fill="var(--color-surface-offers, #fffcee)" />
        </svg>
      </div>
    </section>
  )
}
