import { SectionHeading } from "@/components/atoms/SectionHeading"
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
            <SectionHeading
              id="garanties-timeline-title"
              text={`${copy.titleBefore}${copy.titleHighlight}${copy.titleAfter} ${copy.titleEnd}`}
              textClassName={styles.title}
            >
              <span className={styles.titleLine}>
                {copy.titleBefore}<span className={styles.highlight}>{copy.titleHighlight}</span>{copy.titleAfter}
              </span>{" "}
              <span className={styles.titleLine}>{copy.titleEnd}</span>
            </SectionHeading>
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
