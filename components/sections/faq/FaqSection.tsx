import Link from "next/link"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { estimationHref } from "@/lib/estimation/schema"
import { FaqInteractions } from "./FaqInteractions"
import styles from "./faq.module.css"

export function FaqSection({ copy, locale }: { copy: Dictionary["faq"]; locale: Locale }) {
  const estimate = estimationHref(locale)

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title" data-header-theme="light">
      <div className={styles.inner}>
        <FaqInteractions className={styles.layout}>
          <aside className={styles.introduction}>
            <header className={styles.header} data-reveal-group>
              <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
              <h2 className={styles.title} id="faq-title" data-reveal>{copy.title}</h2>
              <p className={styles.description} data-reveal>{copy.description}</p>
            </header>
            <nav className={styles.topics} aria-label={copy.topicsLabel} data-reveal>
              <ol data-faq-topics>
                {copy.groups.map((group, index) => (
                  <li key={group.id}>
                    <a className={styles.topic} id={`faq-topic-${group.id}`} href={`#faq-${group.id}`} aria-controls={`faq-${group.id}`} data-faq-topic={group.id}>
                      <span className={styles.topicNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <span>{group.title}</span>
                      <Arrow className={styles.topicArrow} />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className={styles.groups} data-faq-panels data-reveal>
            {copy.groups.map((group, groupIndex) => (
              <section className={styles.group} key={group.id} id={`faq-${group.id}`} aria-labelledby={`faq-${group.id}-title`} data-faq-group={group.id}>
                <header className={styles.groupHeader}>
                  <span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>
                  <h3 id={`faq-${group.id}-title`}>{group.title}</h3>
                </header>
                <div className={styles.questions}>
                  {group.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      <details className={styles.item} name={`faq-${group.id}`} open={groupIndex === 0 && itemIndex === 0} data-faq-item>
                        <summary className={styles.question} id={`faq-${item.id}`} data-faq-question>
                          <h4><span>{item.question}</span><span className={styles.toggle} aria-hidden="true"><span /><span /></span></h4>
                        </summary>
                        <div className={styles.answer}>
                          <p>{item.answer}</p>
                          {item.estimate && <Link href={estimate} scroll={false} className={styles.inlineEstimate}>{copy.estimate}<Arrow /></Link>}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </FaqInteractions>

        <div className={styles.closing} data-reveal>
          <p>{copy.closing}</p>
          <div className={styles.actions}>
            <Link href={estimate} scroll={false} className={styles.estimate}><span>{copy.estimate}<Arrow /></span></Link>
            <a href="#contact" className={styles.contact}>{copy.contact}<Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}
