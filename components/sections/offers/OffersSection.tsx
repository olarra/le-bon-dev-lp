"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { OfferIcon, type OfferIconHandle } from "@/components/offer-icons"
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
          <h2 className={styles.title} id="offres-title">Votre projet prend forme.</h2>
        </header>

        <div className={styles.entry} data-offers-entry>
          <div className={styles.surfacePlane} data-offers-surface>
            <div className={styles.surface} data-offers-support>
              <OfferCard offer={OFFERS[0]} phase={iconPhase} />
              <div className={styles.ivoryPlane} data-offers-ivory>
                <OfferCard offer={OFFERS[1]} phase={iconPhase} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer, phase }: { offer: Offer; phase: OfferIconPhase }) {
  const iconRef = useRef<OfferIconHandle>(null)
  const play = () => { void iconRef.current?.play() }

  return (
    <article
      className={`${styles.offer} ${offer.kind === "website" ? styles.website : styles.ivory}`}
      id={offer.id}
      aria-labelledby={`${offer.id}-title`}
      data-offers-card={offer.kind === "applications" ? "" : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") play()
      }}
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
        <OfferIcon
          ref={iconRef}
          kind={offer.kind}
          size={88}
          disabled={phase === "paused"}
          playOnView={phase !== "paused"}
          playOnHover={false}
        />
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
          <a className={styles.offerLink} href={offer.href} onFocus={play}>
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
