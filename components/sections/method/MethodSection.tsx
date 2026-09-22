import { MethodTimeline } from "./MethodTimeline"
import { METHOD_EYEBROW, METHOD_STEPS, METHOD_TITLE, type MethodIconName } from "./method.content"
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
                <span className={styles.icon}><MethodIcon name={step.icon} /></span>
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

function MethodIcon({ name }: { name: MethodIconName }) {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "brief" && (
        <>
          <path d="M11 5H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
          <rect x="11" y="3" width="10" height="6" rx="2" />
          <path d="m10 17 3 3 8-8M10 24h12" />
        </>
      )}
      {name === "milestones" && (
        <>
          <path d="M8 6h16v20H8z" />
          <circle cx="8" cy="6" r="3" fill="currentColor" stroke="none" />
          <circle cx="24" cy="6" r="3" fill="currentColor" stroke="none" />
          <circle cx="8" cy="26" r="3" fill="currentColor" stroke="none" />
          <circle cx="24" cy="26" r="3" fill="currentColor" stroke="none" />
          <path d="m12 16 3 3 6-7" />
        </>
      )}
      {name === "launch" && (
        <>
          <path d="M12 21c-1-3-1-6 2-10 4-5 9-7 14-7 0 5-2 10-7 14-4 3-7 3-10 2M12 12H7l-4 7 8 1M21 20v5l-7 4-1-8" />
          <circle cx="21" cy="11" r="3" />
          <path d="M8 24c-3 0-4 2-4 5 3 0 5-1 5-4" />
        </>
      )}
      {name === "follow-up" && (
        <>
          <path d="M27 12A12 12 0 0 0 6 8L3 12m0-7v7h7M5 20a12 12 0 0 0 21 4l3-4m0 7v-7h-7" />
          <path d="m11 16 3 3 7-7" />
        </>
      )}
    </svg>
  )
}
