"use client"

import type { ReactNode } from "react"
import { useMethodTimeline } from "./use-method-timeline"
import styles from "./method.module.css"

export function MethodTimeline({ children }: { children: ReactNode }) {
  const timelineRef = useMethodTimeline()
  return <ol ref={timelineRef} className={styles.timeline} role="list">{children}</ol>
}
