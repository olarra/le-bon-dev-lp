"use client"

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef, useState, type ReactNode } from "react"
import styles from "./scroll-01.module.css"

type Scroll01Item = {
  id: string
  media: ReactNode
  content: ReactNode
}

export interface Scroll01Props {
  items: readonly Scroll01Item[]
  className?: string
}

export function Scroll01({ items, className }: Readonly<Scroll01Props>) {
  const stepsRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  })
  // The first and last row centres are the start and end of the sequence.
  // The same progress drives both the fixed rail and the illustration.
  const progress = useTransform(scrollYProgress, (value) =>
    Math.max(0, Math.min(1, (value * items.length - 0.5) / Math.max(1, items.length - 1))),
  )
  useMotionValueEvent(progress, "change", (value) => {
    setActiveIndex(Math.min(items.length - 1, Math.floor(value * (items.length - 1) + 0.0001)))
  })

  return (
    <div className={`${styles.layout} ${className ?? ""}`}>
      <div className={styles.visualColumn} aria-hidden="true">
        <div className={styles.stickyVisual}>
          <div className={styles.visualMedia}>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.artLayer}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.97,
                }}
                transition={reducedMotion ? { duration: 0 } : {
                  opacity: { duration: 0.3, ease: "easeOut" },
                  scale: { duration: 0.45, ease: "easeOut" },
                }}
                style={{ zIndex: activeIndex === index ? 1 : 0 }}
              >
                {item.media}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.railColumn} aria-hidden="true">
        <div className={styles.rail}>
          <div className={styles.railTrack}>
            <motion.span className={styles.railFill} style={{ scaleY: progress }} />
          </div>
        </div>
      </div>

      <ol ref={stepsRef} className={styles.steps} role="list">
        {items.map((item, index) => (
          <li key={item.id} className={styles.step} aria-current={index === activeIndex ? "step" : undefined}>
            <div className={styles.mobileArt} aria-hidden="true">{item.media}</div>
            <article className={styles.copy}>{item.content}</article>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Scroll01
