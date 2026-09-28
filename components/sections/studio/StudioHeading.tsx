import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { HEADING_REVEAL } from "@/lib/motion"
import { STUDIO_TITLE } from "./studio.content"
import styles from "./studio.module.css"

// Keep the Hero's character spring, but wait for the complete Studio heading.
const effect = { ...HEADING_REVEAL, threshold: 1, startDelay: 0.12 }

export function StudioHeading() {
  return (
    <div className={styles.headingColor}>
      <AnimatedHeading
        as="h2" id="studio-title" text={STUDIO_TITLE}
        effect={effect} textAlign="left"
        className={styles.titleWrapper} textClassName={styles.title}
      >
        <span className={styles.titleLine}>Le fond, la forme.</span><br />
        <span className={styles.titleLine}>La même attention.</span>
      </AnimatedHeading>
    </div>
  )
}
