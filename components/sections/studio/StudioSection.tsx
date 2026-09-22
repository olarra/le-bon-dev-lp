import { BrandBracket } from "@/components/atoms/BrandBracket"
import { StudioEcosystem } from "./StudioEcosystem"
import {
  STUDIO_EYEBROW,
  STUDIO_FACTS,
  STUDIO_PARAGRAPHS,
  STUDIO_PRINCIPLES,
  type StudioIconName,
} from "./studio.content"
import styles from "./studio.module.css"

/** A light, editorial chapter between the method and contact sections. */
export function StudioSection() {
  return (
    <section className={styles.section} id="le-studio" aria-labelledby="studio-title" data-header-theme="light">
      <div className={styles.inner}>
        <div className={styles.introduction}>
          <div className={styles.story}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>{STUDIO_EYEBROW}</p>
              <h2 className={styles.title} id="studio-title">
                Ce qui fait<br /><span className={styles.titleAccent}>le bon dev.</span>
              </h2>
            </header>
            <div className={styles.copy}>
              {STUDIO_PARAGRAPHS.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <figure className={styles.profile}>
            <div className={styles.portrait} aria-hidden="true">
              <span className={styles.portraitHalo} />
              <div className={styles.portraitGlyph}>
                <BrandBracket side="open" className={styles.portraitBracket} />
                <svg width="136" height="168" viewBox="0 0 136 168" fill="none" focusable="false">
                  <circle cx="68" cy="47" r="30" fill="currentColor" opacity="0.35" />
                  <path d="M12 153v-20c0-28 25-48 56-48s56 20 56 48v20c0 5-4 9-9 9H21c-5 0-9-4-9-9Z" fill="currentColor" opacity="0.24" />
                </svg>
                <BrandBracket side="close" className={styles.portraitBracket} />
              </div>
              <span className={styles.portraitPlaceholder}>Portrait à venir</span>
            </div>
            <figcaption className={styles.profileCaption}>
              <span className={styles.profileRole}>Développeur senior</span>
              <p className={styles.profileTitle}>Votre interlocuteur,<br />du début à la fin.</p>
            </figcaption>
          </figure>
        </div>

        <dl className={styles.facts} aria-label="Le studio en quelques repères">
          {STUDIO_FACTS.map((fact) => (
            <div className={styles.fact} key={fact.label}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue} data-pending={fact.pending} aria-label={fact.pending ? "À renseigner" : undefined}>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className={styles.principles} role="list" aria-label="Les engagements du studio">
          {STUDIO_PRINCIPLES.map((principle, index) => (
            <li className={styles.principle} key={principle.id}>
              <div className={styles.principleTopline} aria-hidden="true">
                <span className={styles.principleIcon}><StudioIcon name={principle.icon} /></span>
                <span className={styles.principleNumber}>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleDescription}>{principle.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <StudioEcosystem />
    </section>
  )
}

function StudioIcon({ name }: { name: StudioIconName }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "code" && (
        <>
          <path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16" />
        </>
      )}
      {name === "design" && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M3 9h18M9 9v11M6 6.5h.01M9 6.5h.01m5 7 1.5 1.5L18 12" />
        </>
      )}
      {name === "automation" && (
        <>
          <path d="M4 8a9 9 0 0 1 15-3l2 2m0-5v5h-5M20 16a9 9 0 0 1-15 3l-2-2m0 5v-5h5m5-11-5 7h4l-1 5 5-7h-4l1-5Z" />
        </>
      )}
      {name === "follow-up" && (
        <>
          <path d="M3 11a9 9 0 1 1 2.5 7M3 5v6h6M12 7v5l3 2" />
        </>
      )}
      {name === "clarity" && (
        <>
          <path d="M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M7 8h10M7 12h7" />
        </>
      )}
      {name === "person" && (
        <>
          <circle cx="10" cy="7" r="4" />
          <path d="M2 21v-2a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v2m-1-10 2 2 3-4" />
        </>
      )}
    </svg>
  )
}
