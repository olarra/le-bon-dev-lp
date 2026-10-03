import { ResinCta } from "@/components/atoms/ResinCta"
import { MagicText } from "@/components/ui/magic-text"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { StudioEcosystem } from "./StudioEcosystem"
import { StudioHeading } from "./StudioHeading"
import { StudioScene } from "./StudioScene"
import { STUDIO_CTA, STUDIO_PRINCIPLES } from "./studio.content"
import type { Dictionary } from "@/lib/i18n/types"
import styles from "./studio.module.css"

/** The editorial studio panel, followed by its tools and integrations. */
export function StudioSection({ copy }: { copy: Dictionary["studio"] }) {
  return (
    <StickerSurface className={styles.section} id="le-studio" aria-labelledby="studio-title" data-header-theme="light">
      <div className={styles.panel}>
        <div className={styles.glassGlow} aria-hidden="true" />
        <div className={styles.introduction}>
          <div className={styles.story}>
            <header className={styles.header}>
              <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
              <StudioHeading lines={copy.titleLines} />
            </header>
            <MagicText paragraphs={copy.paragraphs} className={styles.copy} />
            <ResinCta className={styles.cta} href={STUDIO_CTA.href} label={copy.cta} arrowSize={20} strokeWidth={1.8} />
            <dl className={styles.facts} aria-label={copy.factsLabel} data-reveal-group data-reveal-viewport="0.9">
              {copy.facts.map(fact => (
                <div className={styles.fact} key={fact.label} data-reveal>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <StudioScene label={copy.scene} replay={copy.replay} />
        </div>
        <div className={styles.glassBase}>
          <ul className={styles.principles} role="list" aria-label={copy.principlesLabel} data-reveal-group data-reveal-viewport="0.9">
            {STUDIO_PRINCIPLES.map((principle, index) => (
              <li className={styles.principle} key={principle.lines[0]} data-reveal>
                <MetalSticker src={`/images/studio/stickers/${principle.sticker}.svg`} className={styles.sticker} tone={principle.tone} />
                <h3>{copy.principles[index][0]}<br />{" "}{copy.principles[index][1]}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <StudioEcosystem copy={copy.ecosystem} />
    </StickerSurface>
  )
}
