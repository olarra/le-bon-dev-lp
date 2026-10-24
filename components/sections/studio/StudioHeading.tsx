import { SectionHeading } from "@/components/atoms/SectionHeading"
import styles from "./studio.module.css"

export function StudioHeading({ lines }: { lines: readonly string[] }) {
  return (
    <div className={styles.headingColor}>
      <SectionHeading
        as="h2" id="studio-title" text={lines.join(" ")}
        textAlign="left"
        className={styles.titleWrapper} textClassName={styles.title}
      >
        <span className={styles.titleLine}>{lines[0]}</span><br />
        <span className={styles.titleLine}>{lines[1]}</span>
      </SectionHeading>
    </div>
  )
}
