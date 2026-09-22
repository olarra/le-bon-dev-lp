import Image from "next/image"
import type { CSSProperties } from "react"
import { GUARANTEES, GUARANTEES_EYEBROW, GUARANTEES_SUBTITLE } from "./guarantees.content"
import styles from "./guarantees.module.css"

/** Three equally sized commitments with a permanent progression of greens. */
export function GuaranteesSection() {
  return (
    <section className={styles.section} id="garanties" aria-labelledby="garanties-title" data-header-theme="dark">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{GUARANTEES_EYEBROW}</p>
          <h2 className={styles.title} id="garanties-title">
            Un <span className={styles.titleAccent}>cadre clair</span>, du début à la fin.
          </h2>
          <p className={styles.subtitle}>{GUARANTEES_SUBTITLE}</p>
        </header>

        <div className={styles.panels}>
          {GUARANTEES.map((guarantee, index) => (
            <article
              key={guarantee.id}
              className={styles.panel}
              data-illustration={guarantee.id}
              aria-labelledby={`garantie-${guarantee.id}`}
            >
              <span className={styles.panelTexture} aria-hidden="true" />
              <h3 className={styles.panelTitle} id={`garantie-${guarantee.id}`}>{guarantee.title}</h3>
              <p className={styles.description}>{guarantee.description}</p>
              <div className={styles.illustration} aria-hidden="true">
                <div
                  className={styles.imageFrame}
                  style={{
                    "--image-width": `${(guarantee.image.width / guarantee.image.frame.width) * 100}%`,
                    "--image-height": `${(guarantee.image.height / guarantee.image.frame.height) * 100}%`,
                    "--image-left": `${(-guarantee.image.frame.x / guarantee.image.frame.width) * 100}%`,
                    "--image-top": `${(-guarantee.image.frame.y / guarantee.image.frame.height) * 100}%`,
                  } as CSSProperties}
                >
                  <Image
                    className={styles.image}
                    src={guarantee.image.src}
                    alt=""
                    width={guarantee.image.width}
                    height={guarantee.image.height}
                    sizes="(max-width: 809px) 260px, (max-width: 1199px) 250px, 280px"
                  />
                </div>
              </div>
              {index < GUARANTEES.length - 1 && <PanelJunction id={guarantee.id} />}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Pixel-aligned bridges meet the matching openings in the border layer. */
function PanelJunction({ id }: { id: string }) {
  const gradientId = `garantie-${id}-junction`
  return (
    <svg className={styles.junction} viewBox="0 0 24 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className={styles.junctionStart} />
          <stop offset="100%" className={styles.junctionEnd} />
        </linearGradient>
      </defs>
      <path className={styles.junctionFill} d="M0 0C0 16 24 16 24 0V64C24 48 0 48 0 64Z" />
      <path className={styles.junctionEdge} stroke={`url(#${gradientId})`} d="M0 0C0 16 24 16 24 0M0 64C0 48 24 48 24 64" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
