import { MagicText } from "@/components/ui/magic-text"
import { StudioHeading } from "./StudioHeading"
import { StudioScene } from "./StudioScene"
import { StudioSticker } from "./StudioSticker"
import { StudioSurface } from "./StudioSurface"
import {
  STUDIO_CTA, STUDIO_EYEBROW, STUDIO_FACTS, STUDIO_PARAGRAPHS,
  STUDIO_PRINCIPLES,
} from "./studio.content"
import styles from "./studio.module.css"

/** One editorial surface, with the original office scene and resin base. */
export function StudioSection() {
  return (
    <StudioSurface>
      <div className={styles.panel}>
        <div className={styles.glassGlow} aria-hidden="true" />
        <div className={styles.introduction}>
          <div className={styles.story}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>{STUDIO_EYEBROW}</p>
              <StudioHeading />
            </header>
            <MagicText paragraphs={STUDIO_PARAGRAPHS} className={styles.copy} />
            <a className={styles.cta} href={STUDIO_CTA.href}>
              <span>
                {STUDIO_CTA.label}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </span>
            </a>
            <dl className={styles.facts} aria-label="Le studio en quelques repères">
              {STUDIO_FACTS.map(fact => (
                <div className={styles.fact} key={fact.label}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <StudioScene />
        </div>
        <div className={styles.glassBase}>
          <ul className={styles.principles} role="list" aria-label="Les convictions du studio">
            {STUDIO_PRINCIPLES.map(principle => (
              <li className={styles.principle} key={principle.lines[0]}>
                <StudioSticker name={principle.sticker} />
                <h3>{principle.lines[0]}<br />{" "}{principle.lines[1]}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioSurface>
  )
}
