import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { HEADING_REVEAL } from "@/lib/motion"
import type { Dictionary } from "@/lib/i18n/types"
import { GuaranteesTimeline } from "./GuaranteesTimeline"
import { GUARANTEE_ENTRANCE } from "./guarantees-timeline.content"
import styles from "./guarantees-timeline.module.css"

const titleEffect = {
  ...HEADING_REVEAL,
  startDelay: GUARANTEE_ENTRANCE.titleDelay,
  transition: {
    ...HEADING_REVEAL.transition,
    duration: GUARANTEE_ENTRANCE.titleDuration,
    delay: GUARANTEE_ENTRANCE.titleStagger,
  },
}

export function GuaranteesTimelineSection({ copy }: { copy: Dictionary["guarantees"] }) {
  const heading = (
    <header className={styles.heading} data-guarantee-heading>
      <div className={styles.headingContent}>
        <div data-guarantee-label>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
        </div>
        <div className={styles.titleSlot} data-guarantee-title-slot>
          <AnimatedHeading
            as="h2"
            id="garanties-timeline-title"
            text={`${copy.titleBefore}${copy.titleHighlight}${copy.titleAfter} ${copy.titleEnd}`}
            effect={titleEffect}
            className={styles.titleWrapper}
            textClassName={styles.title}
          >
            {copy.titleBefore}<span className={styles.highlight}>{copy.titleHighlight}</span>{copy.titleAfter}
            <br />{copy.titleEnd}
          </AnimatedHeading>
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
