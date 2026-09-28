import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { ScrollReveal } from "@/components/atoms/ScrollReveal"
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
        <ScrollReveal distance={12} delay={GUARANTEE_ENTRANCE.badgeDelay}>
          <p className={styles.eyebrow}>Nos garanties</p>
        </ScrollReveal>
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
        <ScrollReveal className={styles.subtitleReveal} distance={12} delay={GUARANTEE_ENTRANCE.introDelay}>
          <p className={styles.subtitle}>Trois principes, valables pour chaque projet.</p>
        </ScrollReveal>
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

      <svg className={styles.corner} viewBox="0 0 440 240" fill="none" aria-hidden="true" focusable="false">
        <path d="M440 31c-70 3-88 40-113 83-28 47-63 50-102 43-73-13-98 17-139 45-30 21-57 25-86 38h440Z" fill="currentColor" />
        <circle cx="290" cy="91" r="13" fill="#c8f53e" />
        <circle cx="255" cy="114" r="10" fill="#aaca99" />
      </svg>
    </section>
  )
}
