import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { CONTACT } from "@/lib/contact"
import { ESTIMATE_FACTORS, ESTIMATE_HREF } from "./contact.content"
import styles from "./contact.module.css"

/** The reference's consultation panel, adapted to the supplied estimate copy.
 * Its pill CTA follows Conicorn's exported Price Button (55736c5f645fdf8b). */
export function ContactSection() {
  return (
    <section className={styles.section} id="estimation" aria-labelledby="estimation-title" data-header-theme="dark">
      <div className={styles.inner}>
        <StickerSurface className={styles.callout}>
          <div className={styles.badges} aria-hidden="true">
            <MetalSticker src="/images/contact/stickers/le-bon-dev-disc-a.svg" className={styles.studioBadge} tone="dark" />
            <MetalSticker src="/images/contact/stickers/message-disc.svg" className={styles.callBadge} tone="light" />
          </div>

          <h2 className={styles.title} id="estimation-title">Parlons de votre application.</h2>
          <p className={styles.description}>
            Quelques questions sur vos utilisateurs et ce qu’ils doivent pouvoir faire.
            <span className={styles.response}>Une première estimation sous 24h.</span>
          </p>

          <div className={styles.actions}>
            <a className={styles.estimateLink} href={ESTIMATE_HREF}>
              <span className={styles.estimateLinkInner}>
                <span>Estimer mon application</span>
                <span className={styles.arrowCircle}><Arrow /></span>
              </span>
            </a>
            <a
              className={styles.contactLink}
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prendre contact sur WhatsApp (nouvel onglet)"
            >
              Prendre contact sur WhatsApp
            </a>
          </div>
        </StickerSurface>

        <div className={styles.criteria}>
          <p className={styles.eyebrow}>Une première estimation</p>
          <h3 className={styles.criteriaTitle}>Ce qui peut faire varier l’estimation</h3>
          <ul className={styles.factors} role="list">
            {ESTIMATE_FACTORS.map((factor, index) => (
              <li className={styles.factor} key={factor.title}>
                <span className={styles.factorNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong className={styles.factorTitle}>{factor.title}</strong>
                  <p className={styles.factorDescription}>{factor.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
