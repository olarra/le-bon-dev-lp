"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { SectionHeading } from "@/components/atoms/SectionHeading"
import { INTEGRATION_ROWS, STUDIO_INTEGRATIONS } from "./integrations.content"
import type { Dictionary } from "@/lib/i18n/types"
import styles from "./studio-ecosystem.module.css"

/** Local port of Conicorn's Intergration Marquee and Circle Button.
 * Preserves its three alternating tickers, inset tiles and luminous hub,
 * with the studio's palette, French copy and local decorative assets. */
export function StudioEcosystem({ copy }: { copy: Dictionary["studio"]["ecosystem"] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, { rootMargin: "80px 0px" })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={styles.ecosystem}
      ref={sectionRef}
      aria-labelledby="studio-ecosystem-title"
      data-in-view={inView}
      data-paused={paused}
    >
      <header className={styles.header} data-reveal-group>
        <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
        <SectionHeading as="h3" id="studio-ecosystem-title" text={copy.title} textClassName={styles.title} />
      </header>

      <div className={styles.stage}>
        <div className={styles.marquee}>
          {INTEGRATION_ROWS.map((row, index) => {
            const items = [
              ...STUDIO_INTEGRATIONS.slice(row.offset),
              ...STUDIO_INTEGRATIONS.slice(0, row.offset),
            ]

            return (
              <div className={styles.row} key={row.offset} aria-hidden={index > 0 ? true : undefined}>
                <div
                  className={styles.track}
                  data-direction={row.direction}
                  style={{
                    "--ticker-duration": `${items.length * 244 / row.speed}s`,
                    "--ticker-mobile-duration": `${items.length * 184 / (row.speed * 0.7)}s`,
                  } as CSSProperties}
                >
                  {[false, true].map((duplicate) => (
                    <ul
                      className={styles.group}
                      key={String(duplicate)}
                      role="list"
                      aria-label={index === 0 && !duplicate ? copy.list : undefined}
                      aria-hidden={duplicate ? true : undefined}
                      data-duplicate={duplicate}
                    >
                      {items.map((item) => (
                        <li className={styles.tile} key={item.id}>
                          <span>{item.name}</span>
                          <Image
                            className={styles.icon}
                            src={`/images/integrations/${item.icon}`}
                            data-contrast={item.contrast}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized
                            draggable={false}
                          />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.hub}>
          <a className={styles.hubLink} href="#contact" aria-label={copy.ctaLabel}>
            <Image
              className={styles.hubMark}
              src="/images/brand/le-bon-dev-mark-white.svg"
              alt=""
              width={875}
              height={524}
              unoptimized
              draggable={false}
            />
            <span className={styles.hubLabel}>
              {copy.cta}
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.description}>
          {copy.description}
        </p>
        <button
          className={styles.motionToggle}
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? copy.resumeLabel : copy.pauseLabel}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            {paused ? <path d="m6 3 11 7-11 7V3Z" /> : <path d="M5 3h3v14H5zm7 0h3v14h-3z" />}
          </svg>
          {paused ? copy.resume : copy.pause}
        </button>
      </footer>
    </section>
  )
}
