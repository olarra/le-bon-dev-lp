import { ResinCta } from "@/components/atoms/ResinCta"
import { MagicText } from "@/components/ui/magic-text"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { StudioEcosystem } from "./StudioEcosystem"
import { StudioHeading } from "./StudioHeading"
import { StudioScene } from "./StudioScene"
import {
  STUDIO_CTA, STUDIO_EYEBROW, STUDIO_FACTS, STUDIO_PARAGRAPHS,
  STUDIO_PRINCIPLES,
} from "./studio.content"
import styles from "./studio.module.css"

/** The editorial studio panel, followed by its tools and integrations. */
export function StudioSection() {
  return (
    <StickerSurface className={styles.section} id="le-studio" aria-labelledby="studio-title" data-header-theme="light">
      <div className={styles.panel}>
        <div className={styles.glassGlow} aria-hidden="true" />
        <div className={styles.introduction}>
          <div className={styles.story}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>{STUDIO_EYEBROW}</p>
              <StudioHeading />
            </header>
            <MagicText paragraphs={STUDIO_PARAGRAPHS} className={styles.copy} />
            <ResinCta className={styles.cta} href={STUDIO_CTA.href} label={STUDIO_CTA.label} arrowSize={20} strokeWidth={1.8} />
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
                <MetalSticker src={`/images/studio/stickers/${principle.sticker}.svg`} className={styles.sticker} tone={principle.tone} />
                <h3>{principle.lines[0]}<br />{" "}{principle.lines[1]}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <StudioEcosystem />
    </StickerSurface>
  )
}
