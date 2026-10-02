"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { OfferIcon, OfferSticker, type OfferIconHandle } from "@/components/offer-icons"
import { useStickerMotion } from "@/hooks/use-sticker-motion"
import { FEATURE_FLAG_RESINE_ICON_ENABLED } from "@/lib/feature-flags"
import { HEADING_REVEAL } from "@/lib/motion"
import { OFFERS, type Offer } from "./offers.content"
import { mountOffersReveal, type OfferIconPhase } from "./offers-reveal"
import styles from "./offers.module.css"

export function OffersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [iconPhase, setIconPhase] = useState<OfferIconPhase>("paused")

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    return mountOffersReveal(sectionRef.current, setIconPhase)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="offres" aria-labelledby="offres-title" data-header-theme="dark">
      <div className={styles.light} data-offers-light aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Les offres</p>
          <AnimatedHeading
            as="h2"
            id="offres-title"
            text="Votre projet prend forme."
            effect={HEADING_REVEAL}
            className={styles.titleWrapper}
            textClassName={styles.title}
          />
        </header>

        <div className={styles.entry} data-offers-entry>
          <div className={styles.surfacePlane} data-offers-surface>
            <div className={styles.surface} data-offers-support>
              <OfferCard offer={OFFERS[0]} phase={iconPhase === "mobile-pending" ? "viewport" : iconPhase} />
              <div className={styles.ivoryPlane} data-offers-ivory>
                <OfferCard offer={OFFERS[1]} phase={iconPhase === "mobile-pending" ? "paused" : iconPhase} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer, phase }: { offer: Offer; phase: OfferIconPhase }) {
  const cardRef = useRef<HTMLElement>(null)
  const iconRef = useRef<OfferIconHandle>(null)
  useStickerMotion(cardRef, { enabled: !FEATURE_FLAG_RESINE_ICON_ENABLED })
  const touch = useRef<{
    id: number; x: number; y: number; time: number; scrollY: number
  } | null>(null)
  const play = () => { void iconRef.current?.play() }
  const isInteractive = (target: EventTarget) => target instanceof Element
    && !!target.closest("a, button, input, select, textarea, [role='button'], [contenteditable]")

  return (
    <article
      ref={cardRef}
      className={`${styles.offer} ${offer.kind === "website" ? styles.website : styles.ivory}`}
      id={offer.id}
      aria-labelledby={`${offer.id}-title`}
      data-offers-card={offer.kind === "applications" ? "" : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") play()
      }}
      onPointerDown={(event) => {
        touch.current = null
        if (!FEATURE_FLAG_RESINE_ICON_ENABLED || event.pointerType !== "touch" || !event.isPrimary || isInteractive(event.target)) return
        touch.current = {
          id: event.pointerId, x: event.clientX, y: event.clientY,
          time: event.timeStamp, scrollY: window.scrollY,
        }
      }}
      onPointerMove={(event) => {
        const start = touch.current
        if (start && event.pointerId === start.id
          && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) touch.current = null
      }}
      onPointerUp={(event) => {
        const start = touch.current
        touch.current = null
        if (!start || event.pointerId !== start.id || isInteractive(event.target)) return
        if (event.timeStamp - start.time > 500
          || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10
          || Math.abs(window.scrollY - start.scrollY) > 4) return
        play()
      }}
      onPointerCancel={() => { touch.current = null }}
      onLostPointerCapture={() => { touch.current = null }}
    >
      {offer.kind === "applications" && (
        <>
          <span className={styles.landingSheen} aria-hidden="true">
            <span className={styles.sheenReflection} data-offers-sheen />
          </span>
          <span className={styles.landingRim} aria-hidden="true">
            <span className={styles.rimReflection} data-offers-rim-sheen />
          </span>
        </>
      )}
      <div className={styles.offerTopline}>
        {FEATURE_FLAG_RESINE_ICON_ENABLED ? (
          <OfferIcon
            ref={iconRef}
            kind={offer.kind}
            size={88}
            disabled={phase === "paused"}
            playOnView={phase !== "paused"}
            playOnHover={false}
          />
        ) : (
          <OfferSticker kind={offer.kind} className={styles.offerIcon} />
        )}
        {offer.detail && <span className={styles.offerBadge}>{offer.detail}</span>}
      </div>
      <div className={styles.offerHeading}>
        <h3 className={styles.cardTitle} id={`${offer.id}-title`}>{offer.title}</h3>
        <p className={styles.promise}>{offer.promise}</p>
      </div>
      <div className={styles.offerAudience}>
        <p className={styles.audience}><strong>Pour vous si</strong> {offer.audience}</p>
      </div>
      <div className={styles.offerFeatures}>
        <h4 className={styles.featuresTitle}>Ce qui est compris</h4>
        <FeatureList items={offer.features} />
      </div>
      <div className={styles.offerClosing}>
        <div className={styles.offerAftercare}>
          <h4 className={styles.featuresTitle}>{offer.aftercare.title}</h4>
          <p className={styles.aftercare}>{offer.aftercare.description}</p>
        </div>
        <div className={styles.offerFooter}>
          {offer.price && (
            <div className={styles.price}>
              <p className={styles.priceLabel}>À partir de</p>
              <p className={styles.priceSummary}>
                <strong className={styles.priceAmount}>{offer.price.amount}</strong>
                <span className={styles.priceDetail}>— {offer.price.detail}</span>
              </p>
            </div>
          )}
          <a
            className={styles.offerLink}
            href={offer.href}
            data-offers-sheen-replay={offer.kind === "applications" ? "" : undefined}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") play() }}
            onFocus={play}
            onClick={play}
          >
            <span className={styles.offerLinkInner}>
              <span>{offer.cta}</span>
              <Arrow />
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.features}>
      {items.map((item) => (
        <li key={item}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Check() {
  return (
    <svg className={styles.featureCheck} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  )
}
