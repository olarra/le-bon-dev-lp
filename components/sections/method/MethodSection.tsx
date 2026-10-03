import { MethodIcon } from "@/components/method-icons/MethodIcon"
import { MethodTimeline } from "./MethodTimeline"
import { METHOD_STEPS } from "./method.content"
import type { Dictionary } from "@/lib/i18n/types"
import styles from "./method.module.css"

/** Dark adaptation of Conicorn's Process Item / Process Item 2 composition
 *  from Framer project 55736c5f645fdf8b, with the site's four project stages. */
export function MethodSection({ copy }: { copy: Dictionary["method"] }) {
  return (
    <section className={styles.section} id="la-methode" aria-labelledby="methode-title" data-header-theme="dark">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal-group>
          <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
          <h2 className={styles.title} id="methode-title" data-reveal>{copy.title}</h2>
        </header>

        <MethodTimeline>
          {METHOD_STEPS.map((step, index) => (
            <li className={styles.step} key={step.id} data-method-step={step.id} data-active={index === 0} data-reveal-group data-reveal-anchor data-reveal-viewport="0.9">
              <div className={styles.visual} aria-hidden="true" data-reveal={index % 2 === 0 ? "left" : "right"}>
                <MethodIcon kind={step.icon} />
                <span className={styles.number}>{step.number}</span>
              </div>
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.marker} data-method-marker><span className={styles.markerCore} /></span>
              </div>
              <div className={styles.copy} data-reveal={index % 2 === 0 ? "right" : "left"}>
                <h3 className={styles.stepTitle}>{copy.steps[index].title}</h3>
                <p className={styles.description}>{copy.steps[index].description}</p>
              </div>
            </li>
          ))}
        </MethodTimeline>
      </div>
    </section>
  )
}
