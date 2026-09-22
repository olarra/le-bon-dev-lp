"use client"

import Image from "next/image"
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react"
import { PROJECTS } from "./projects.content"
import styles from "./project-carousel.module.css"

/** Port of Conicorn's Project Slider / Card / Slide Button (55736c5f645fdf8b).
 * Keeps its 128px frame, inset image light and 500ms transition, with local
 * project data, the site's typefaces and accessible native controls. */
export function ProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportId = useId()
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = PROJECTS.length

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + count) % count)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        move(-1)
        break
      case "ArrowRight":
        event.preventDefault()
        move(1)
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(count - 1)
        break
    }
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStart.current = event.touches.length === 1
      ? { x: touch.clientX, y: touch.clientY }
      : null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || event.touches.length || !event.changedTouches.length) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    // Vertical gestures continue to scroll the page normally.
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      move(dx < 0 ? 1 : -1)
    }
  }

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carrousel" aria-labelledby="realisations-title" onKeyDown={handleKeyDown}>
      <div
        className={styles.viewport}
        id={viewportId}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null }}
      >
        {PROJECTS.map((project, index) => {
          const isActive = index === activeIndex
          const distance = (index - activeIndex + count) % count
          const offset = distance > count / 2 ? distance - count : distance

          return (
            <article
              className={styles.slide}
              key={project.id}
              data-active={isActive}
              style={{ "--slide-offset": offset } as CSSProperties}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`Projet ${project.number}, ${index + 1} sur ${count}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              <div className={styles.visual} aria-hidden="true">
                <Image
                  className={styles.image}
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 809px) calc(100vw - 80px), (max-width: 1199px) min(744px, calc(100vw - 128px)), 480px"
                  draggable={false}
                />
                <span className={styles.visualLabel}>Visuel provisoire</span>
              </div>

              <div className={styles.body}>
                <div className={styles.intro}>
                  <div className={styles.topline}>
                    <span className={styles.client}>
                      <span className={styles.clientMark} aria-hidden="true" />
                      {project.client}
                    </span>
                    <span className={styles.projectNumber}>Projet {project.number}</span>
                  </div>
                  <div>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.description}>{project.description}</p>
                    {project.href ? (
                      <a className={styles.projectLink} href={project.href}>
                        Découvrir le projet <LinkArrow />
                      </a>
                    ) : (
                      <span className={styles.pendingLink}>Fiche projet à venir <LinkArrow /></span>
                    )}
                  </div>
                </div>

                <dl className={styles.details}>
                  {project.details.map((detail) => (
                    <div key={detail.label}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          )
        })}
      </div>

      <button className={`${styles.navButton} ${styles.previous}`} type="button" aria-label="Projet précédent" aria-controls={viewportId} onClick={() => move(-1)}>
        <Chevron direction="left" />
      </button>
      <p className={styles.counter} aria-live="polite" aria-atomic="true">
        <span className={styles.srOnly}>Projet </span>
        <span className={styles.currentNumber}>{PROJECTS[activeIndex].number}</span>
        <span aria-hidden="true"> / </span>
        <span className={styles.srOnly}> sur </span>
        <span>{String(count).padStart(2, "0")}</span>
      </p>
      <button className={`${styles.navButton} ${styles.next}`} type="button" aria-label="Projet suivant" aria-controls={viewportId} onClick={() => move(1)}>
        <Chevron direction="right" />
      </button>
    </div>
  )
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === "left" ? "m14.5 5.5-6 6.5 6 6.5" : "m9.5 5.5 6 6.5-6 6.5"} />
    </svg>
  )
}

function LinkArrow() {
  return (
    <span className={styles.linkArrow} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </span>
  )
}
