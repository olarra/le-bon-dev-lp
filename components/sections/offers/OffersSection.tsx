"use client"

import { useLayoutEffect, useRef } from "react"
import Link from "next/link"
import type { Offer } from "./offers.content"
import type { Dictionary } from "@/lib/i18n/types"
import { SectionHeading } from "@/components/atoms/SectionHeading"
import { OfferSticker } from "@/components/offer-icons/OfferSticker"
import { MetalFinish } from "@/components/ui/metal-sticker"
import { useStickerMotion } from "@/hooks/use-sticker-motion"
import { mountOffersEntrance } from "./offers-entrance"
import { prepareNearViewport } from "@/lib/prepare-near-viewport"
import styles from "./offers.module.css"

export function OffersSection({ copy }: { copy: Dictionary["offers"] }) {
  const sectionRef = useRef<HTMLElement>(null)
  useStickerMotion(sectionRef)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    return prepareNearViewport(section, () => {
      const entrance = mountOffersEntrance(section)
      return () => entrance.dispose()
    })
  }, [copy])

  return (
    <section ref={sectionRef} className={styles.section} id="offres" aria-labelledby="offres-title" data-header-theme="light">
      <noscript><style>{"#offres { --offers-pending-opacity: 1; }"}</style></noscript>
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
          <SectionHeading id="offres-title" text={copy.title} textClassName={styles.title} />
        </header>

        <div className={styles.entry} data-offers-entry>
          <div className={styles.surface} data-offers-support>
            <div className={styles.surfaceBackdrop} data-offers-shell aria-hidden="true" />
            <OfferCard offer={copy.items[0]} copy={copy} />
            <div className={styles.ivoryPlane} data-offers-ivory>
              <OfferCard offer={copy.items[1]} copy={copy} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer, copy }: { offer: Offer; copy: Dictionary["offers"] }) {
  const application = offer.kind === "applications"
  return (
    <article className={`${styles.offer} ${application ? styles.ivory : styles.website}`}
      id={offer.id} aria-labelledby={`${offer.id}-title`} tabIndex={-1}
      data-offer-kind={offer.kind}>
      {application && (
        <>
          <span className={styles.landingShadow} data-offers-landing-shadow aria-hidden="true" />
          <span className={styles.landingSheen} aria-hidden="true">
            <span className={styles.sheenReflection} data-offers-sheen />
            <MetalFinish className={styles.metalFallback} tone="dark" palette="green" />
            <canvas className={styles.metalCanvas} data-offers-metal-canvas />
          </span>
          <span className={styles.landingRim} aria-hidden="true">
            <span className={styles.rimReflection} data-offers-rim-sheen />
          </span>
        </>
      )}
      <div className={styles.offerTopline}>
        <OfferSticker kind={offer.kind} className={styles.offerSticker} />
        {offer.detail && <span className={styles.offerBadge}>{offer.detail}</span>}
      </div>
      <div className={styles.offerHeading}>
        <h3 className={styles.cardTitle} id={`${offer.id}-title`}>{offer.title}</h3>
        <p className={styles.promise}>{offer.promise}</p>
        <span className={styles.divider} aria-hidden="true" />
      </div>
      <div className={styles.offerAudience}>
        <p className={styles.audience}><strong>{copy.audience}</strong>{" "}{offer.audience}</p>
      </div>
      <div className={styles.offerFeatures}>
        <h4 className={styles.featuresTitle}>{copy.included}</h4>
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
              <p className={styles.priceLabel}>{copy.from}</p>
              <p className={styles.priceSummary}>
                <strong className={styles.priceAmount}>{offer.price.amount}</strong>
                <span className={styles.priceDetail}>— {offer.price.detail}</span>
              </p>
            </div>
          )}
          <Link className={styles.offerLink} href={offer.href} scroll={false}>
            <span className={styles.offerLinkInner}>
              <span>{offer.cta}</span>
              <Arrow />
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.features}>
      {items.map(item => (
        <li key={item}>
          <svg className={styles.featureCheck} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m5 12 4 4L19 6" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  )
}
