"use client"

import Image from "next/image"
import { HEADING_REVEAL } from "@/lib/motion"
import { useHeroMotion } from "./use-hero-motion"
import { WaveBrandCard } from "./WaveBrandCard"
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
  CTA_HINT,
  CTA_HREF,
  CTA_LABEL,
  EYEBROW,
  HIGHLIGHT_AFTER,
  HIGHLIGHT_BEFORE,
  HIGHLIGHT_WORD,
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

export function HeroSection() {
  const { heroRef, headingRef, spiralRef, ribbonPausedRef, dotsPausedRef } = useHeroMotion()

  return (
    <section ref={heroRef} className={styles.hero} id="statistics">
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
                  .subtitle / .ctaGroup keep participating directly in
                  .headingContainer's flex gap as before. */}
              <div ref={headingRef} style={{ display: "contents" }}>
                <div ref={spiralRef} className={styles.spiralField} aria-hidden="true" />

                <div className={styles.headingAndLabel}>
                  <p className={styles.eyebrow}>{EYEBROW}</p>
                  <h1 className={styles.headline} aria-label={SECTION_TITLE_LINES.join(" ")}>
                  {SECTION_TITLE_LINES.map((line) => (
                    <span key={line} className={styles.titleLine}>
                      <AnimatedHeading
                        as="span"
                        text={line}
                        effect={HEADING_REVEAL}
                        className={styles.titleWrapper}
                        textClassName={styles.title}
                        textAlign="center"
                      />
                    </span>
                  ))}
                  </h1>
                </div>

                <p className={styles.subtitle}>{SUBTITLE_INTRO}</p>

                <div className={styles.ctaGroup}>
                  <a href={CTA_HREF} className={styles.ctaButton} aria-describedby="hero-estimate-hint">
                    <span>{CTA_LABEL}</span>
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
                  <p className={styles.ctaHint} id="hero-estimate-hint">{CTA_HINT}</p>
                </div>

                <div className={styles.highlight}>
                  <Image
                    src="/images/hero/bracket-opening.png"
                    width={921}
                    height={876}
                    sizes="44px"
                    quality={90}
                    className={styles.highlightBracket}
                    data-side="open"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                  />
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
                  <Image
                    src="/images/hero/bracket-closing.png"
                    width={921}
                    height={876}
                    sizes="44px"
                    quality={90}
                    className={styles.highlightBracket}
                    data-side="close"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                  />
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
