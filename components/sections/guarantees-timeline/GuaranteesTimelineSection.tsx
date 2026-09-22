import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { ScrollReveal } from "@/components/atoms/ScrollReveal"
import { SECTION_TITLE_EFFECT } from "../hero/hero.content"
import { GuaranteesTimeline } from "./GuaranteesTimeline"
import styles from "./guarantees-timeline.module.css"

export function GuaranteesTimelineSection() {
  const heading = (
    <header className={styles.heading} data-guarantee-heading>
      <ScrollReveal className={styles.headingContent}>
        <p className={styles.eyebrow}>Nos garanties</p>
        <div className={styles.titleSlot} data-guarantee-title-slot>
          <AnimatedHeading
            as="h2"
            id="garanties-timeline-title"
            text="Un cadre clair, du début à la fin."
            effect={SECTION_TITLE_EFFECT}
            className={styles.titleWrapper}
            textClassName={styles.title}
          >
            Un <span className={styles.highlight}>cadre clair</span>,
            <br />du début à la fin.
          </AnimatedHeading>
        </div>
        <p className={styles.subtitle}>Trois principes, valables pour chaque projet.</p>
      </ScrollReveal>
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
