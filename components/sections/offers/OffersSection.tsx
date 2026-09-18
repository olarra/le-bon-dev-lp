import Image from "next/image"
import type { CSSProperties } from "react"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { ScrollReveal } from "@/components/atoms/ScrollReveal"
import { SECTION_TITLE_EFFECT } from "@/components/sections/hero/hero.content"
import { BracketIcon } from "./BracketIcon"
import { HandArrow } from "./HandArrow"
import styles from "./offers.module.css"
import { OFFERS, OFFERS_EYEBROW, OFFERS_TITLE, type NotePlacement, type Offer } from "./offers.content"

const NOTE_CLASS: Record<NotePlacement, string> = {
  topRight: styles.noteTopRight,
  bottomLeft: styles.noteBottomLeft,
  bottomCenter: styles.noteBottomCenter,
  bottomRight: styles.noteBottomRight,
}

// Same reveal as the hero headline. The second half starts its per-character
// stagger where the first half's ends, so the two halves read as one line.
const TITLE_SECOND_HALF_EFFECT = {
  ...SECTION_TITLE_EFFECT,
  startDelay: SECTION_TITLE_EFFECT.startDelay + OFFERS_TITLE.plain.length * SECTION_TITLE_EFFECT.transition.delay,
}

/**
 * "Les offres": line-eyebrow + marker-underlined Morna title, then one card
 * per offer (copy on one side, cut-out illustration over its own lime
 * silhouette on the other, hand-written margin notes with drawn arrows
 * around it). Each card is also the anchor the header nav links to.
 */
export function OffersSection() {
  return (
    <section className={styles.section} id="offres" aria-labelledby="offres-title">
      <div className={styles.inner}>
        <ScrollReveal className={styles.header} distance={60}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            {OFFERS_EYEBROW}
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </p>
          {/* Two inline RichText halves rather than one heading, so the marker
              can sit under "prend forme." alone. RichText's wrapper is a div,
              which can't live inside an h2, hence the ARIA heading wrapper. */}
          <div className={styles.title} id="offres-title" role="heading" aria-level={2}>
            <AnimatedHeading
              as="span"
              text={OFFERS_TITLE.plain}
              effect={SECTION_TITLE_EFFECT}
              className={styles.titlePart}
              textClassName={styles.titleText}
            />
            <span className={styles.titleMark}>
              <AnimatedHeading
                as="span"
                text={OFFERS_TITLE.marked}
                effect={TITLE_SECOND_HALF_EFFECT}
                className={styles.titlePart}
                textClassName={styles.titleText}
              />
              <svg className={styles.titleStroke} viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M6 17 C 110 6, 260 3, 394 11" />
              </svg>
            </span>
          </div>
        </ScrollReveal>

        {OFFERS.map((offer) => (
          <ScrollReveal key={offer.id} distance={80}>
            <OfferCard offer={offer} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  const arrowClass = offer.cta.arrow === "diagonal" ? `${styles.ctaArrow} ${styles.ctaArrowDiagonal}` : styles.ctaArrow
  const { frame } = offer.image
  const figureStyle = {
    "--plate-mask": `url("${offer.plate.mask}")`,
    "--figure-ratio": `${frame.width} / ${frame.height}`,
    "--image-width": `${(offer.image.width / frame.width) * 100}%`,
    "--image-height": `${(offer.image.height / frame.height) * 100}%`,
    "--image-left": `${(-frame.x / frame.width) * 100}%`,
    "--image-top": `${(-frame.y / frame.height) * 100}%`,
  } as CSSProperties

  return (
    <article className={styles.card} id={offer.id} data-figure={offer.figureSide}>
      <div className={styles.copy}>
        <p className={styles.tag}>
          <BracketIcon side="open" className={styles.tagBracket} />
          {offer.tag}
          <BracketIcon side="close" className={styles.tagBracket} />
        </p>
        <div className={styles.offerHeading}>
          <h3 className={styles.cardTitle}>{offer.title}</h3>
          <ul className={styles.features}>
            {offer.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <p className={styles.lead}>{offer.lead}</p>
        <a className={styles.cta} href={offer.cta.href}>
          {offer.cta.label}
          <svg
            className={arrowClass}
            width="18"
            height="18"
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
      </div>

      {/* Frame the visible device rather than the source's transparent margins.
          Notes and backing silhouettes now stay attached to the illustration. */}
      <div className={styles.figure} style={figureStyle} data-shift={offer.plate.shift}>
        <div className={styles.plate} aria-hidden="true" />
        <Image
          className={styles.shot}
          src={offer.image.src}
          alt={offer.image.alt}
          width={offer.image.width}
          height={offer.image.height}
          sizes="(max-width: 1023px) 100vw, (max-width: 1199px) 60vw, 840px"
        />

        {offer.notes.map((note) => (
          <div key={note.placement} className={`${styles.note} ${NOTE_CLASS[note.placement]}`} aria-hidden="true">
            <span className={styles.noteText}>{note.text}</span>
            <HandArrow className={styles.noteArrow} shape={note.arrow} />
          </div>
        ))}
      </div>
    </article>
  )
}
