import { AuroraBackground } from "@/components/ui/aurora-background"
import type { Dictionary } from "@/lib/i18n/types"
import { GuaranteesTimeline } from "./GuaranteesTimeline"
import styles from "./guarantees-timeline.module.css"

export function GuaranteesTimelineSection({ copy }: { copy: Dictionary["guarantees"] }) {
  const heading = (
    <header className={styles.heading} data-guarantee-heading>
      <div className={styles.headingContent}>
        <div data-guarantee-label>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
        </div>
        <div className={styles.titleSlot} data-guarantee-title-slot>
          <div className={styles.titleWrapper} data-guarantee-title>
            <h2 id="garanties-timeline-title" className={styles.title}>
              <span className={styles.titleLine} data-guarantee-title-line>
                {copy.titleBefore}<span className={styles.highlight}>{copy.titleHighlight}</span>{copy.titleAfter}
              </span>{" "}
              <span className={styles.titleLine} data-guarantee-title-line>{copy.titleEnd}</span>
            </h2>
          </div>
        </div>
        <div className={styles.subtitleReveal} data-guarantee-intro>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </div>
      </div>
    </header>
  )

  return (
    <section
      id="garanties-timeline"
      className={styles.section}
      aria-labelledby="garanties-timeline-title"
      data-header-theme="light"
    >
      <AuroraBackground className={styles.aurora} aria-hidden="true" />
      <div className={styles.inner}>
        <GuaranteesTimeline heading={heading} steps={copy.steps} />
      </div>
    </section>
  )
}
