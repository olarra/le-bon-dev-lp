import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { HEADING_REVEAL } from "@/lib/motion"
import styles from "./studio.module.css"

// Keep the Hero's character spring, but wait for the complete Studio heading.
const effect = { ...HEADING_REVEAL, threshold: 1, startDelay: 0.12 }

export function StudioHeading({ lines }: { lines: readonly string[] }) {
  return (
    <div className={styles.headingColor}>
      <AnimatedHeading
        as="h2" id="studio-title" text={lines.join(" ")}
        effect={effect} textAlign="left"
        className={styles.titleWrapper} textClassName={styles.title}
      >
        <span className={styles.titleLine}>{lines[0]}</span><br />
        <span className={styles.titleLine}>{lines[1]}</span>
      </AnimatedHeading>
    </div>
  )
}
