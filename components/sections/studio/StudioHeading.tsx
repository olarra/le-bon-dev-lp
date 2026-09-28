"use client"

import { useLayoutEffect, useRef } from "react"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { SECTION_TITLE_EFFECT } from "../hero/hero.content"
import { STUDIO_TITLE } from "./studio.content"
import styles from "./studio.module.css"

// Keep the Hero's character spring, but wait for the complete Studio heading.
const effect = { ...SECTION_TITLE_EFFECT, threshold: 1, startDelay: 0.12 }

export function StudioHeading() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const letters = Array.from(ref.current?.querySelectorAll<HTMLElement>('h2 span[style*="inline-block"]') ?? [])
    letters.forEach((letter, index) => {
      letter.style.setProperty("--studio-letter-tone", `${index / Math.max(1, letters.length - 1) * 100}%`)
    })
    return () => letters.forEach(letter => letter.style.removeProperty("--studio-letter-tone"))
  }, [])

  return (
    <div ref={ref} className={styles.headingColor}>
      <AnimatedHeading
        as="h2" id="studio-title" text={STUDIO_TITLE}
        effect={effect} textAlign="left"
        className={styles.titleWrapper} textClassName={styles.title}
      >
        <span className={styles.titleLine}>Le fond, la forme.</span><br />
        <span className={styles.titleLine}>La même attention.</span>
      </AnimatedHeading>
    </div>
  )
}
