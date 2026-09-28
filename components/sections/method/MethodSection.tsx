import { MethodIcon } from "@/components/method-icons/MethodIcon"
import { MethodTimeline } from "./MethodTimeline"
import { METHOD_EYEBROW, METHOD_STEPS, METHOD_TITLE } from "./method.content"
import styles from "./method.module.css"

/** Dark adaptation of Conicorn's Process Item / Process Item 2 composition
 *  from Framer project 55736c5f645fdf8b, with the site's four project stages. */
export function MethodSection() {
  return (
    <section className={styles.section} id="la-methode" aria-labelledby="methode-title" data-header-theme="dark">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{METHOD_EYEBROW}</p>
          <h2 className={styles.title} id="methode-title">{METHOD_TITLE}</h2>
        </header>

        <MethodTimeline>
          {METHOD_STEPS.map((step, index) => (
            <li className={styles.step} key={step.id} data-method-step={step.id} data-active={index === 0}>
              <div className={styles.visual} aria-hidden="true">
                <MethodIcon kind={step.icon} />
                <span className={styles.number}>{step.number}</span>
              </div>
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.marker} data-method-marker><span className={styles.markerCore} /></span>
              </div>
              <div className={styles.copy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
              </div>
            </li>
          ))}
        </MethodTimeline>
      </div>
    </section>
  )
}
