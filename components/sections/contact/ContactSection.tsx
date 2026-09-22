import { BrandBracket } from "@/components/atoms/BrandBracket"
import { CONTACT } from "@/lib/contact"
import { ESTIMATE_FACTORS, ESTIMATE_HREF } from "./contact.content"
import styles from "./contact.module.css"

/** The reference's consultation panel, adapted to the supplied estimate copy.
 * Its pill CTA follows Conicorn's exported Price Button (55736c5f645fdf8b). */
export function ContactSection() {
  return (
    <section className={styles.section} id="estimation" aria-labelledby="estimation-title" data-header-theme="dark">
      <div className={styles.inner}>
        <div className={styles.callout}>
          <div className={styles.badges} aria-hidden="true">
            <span className={styles.studioBadge}>
              <BrandBracket side="open" className={styles.bracket} />
              <span className={styles.slash} />
              <BrandBracket side="close" className={styles.bracket} />
            </span>
            <span className={styles.callBadge}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="m7.2 3.5 2.2 4.6-2.2 2.1a12.8 12.8 0 0 0 6.6 6.6l2.1-2.2 4.6 2.2v2.5a1.8 1.8 0 0 1-2 1.8A17.2 17.2 0 0 1 2.9 5.5a1.8 1.8 0 0 1 1.8-2h2.5Z" />
                <path d="M14 3a8 8 0 0 1 7 7m-7-3a4 4 0 0 1 3 3" />
              </svg>
            </span>
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
            <a className={styles.contactLink} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Prendre contact sur WhatsApp">
              Prendre contact
              <Arrow />
            </a>
          </div>
        </div>

        <div className={styles.criteria}>
          <p className={styles.eyebrow}>Une première estimation</p>
          <h3 className={styles.criteriaTitle}>Ce qui fait varier l’estimation</h3>
          <ul className={styles.factors} role="list">
            {ESTIMATE_FACTORS.map((factor, index) => (
              <li className={styles.factor} key={factor}>
                <span className={styles.factorNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{factor}</span>
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
