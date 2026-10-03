import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { HEADING_REVEAL } from "@/lib/motion"
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

export function GuaranteesTimelineSection() {
  const heading = (
    <header className={styles.heading} data-guarantee-heading>
      <div className={styles.headingContent}>
        <div data-guarantee-label>
          <p className={styles.eyebrow}>Nos garanties</p>
        </div>
        <div className={styles.titleSlot} data-guarantee-title-slot>
          <AnimatedHeading
            as="h2"
            id="garanties-timeline-title"
            text="Un cadre clair, du début à la fin."
            effect={titleEffect}
            className={styles.titleWrapper}
            textClassName={styles.title}
          >
            Un <span className={styles.highlight}>cadre clair</span>,
            <br />du début à la fin.
          </AnimatedHeading>
        </div>
        <div className={styles.subtitleReveal} data-guarantee-intro>
          <p className={styles.subtitle}>Trois principes, valables pour chaque projet.</p>
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
      <div className={styles.inner}>
        <GuaranteesTimeline heading={heading} />
      </div>

    </section>
  )
}
