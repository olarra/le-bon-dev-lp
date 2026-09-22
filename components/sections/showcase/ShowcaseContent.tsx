import { ProjectCarousel } from "./ProjectCarousel"
import styles from "./showcase.module.css"

/** Project previews retain their opening green surface during the migration. */
export function ShowcaseContent() {
  return (
    <section id="realisations" aria-labelledby="realisations-title">
      <header className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Les réalisations</p>
        <h2 className={styles.title} id="realisations-title">Des idées devenues concrètes.</h2>
      </header>
      <ProjectCarousel />
    </section>
  )
}
