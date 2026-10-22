"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./estimation.module.css"

/** A continuous rim with two widths of light spilling into the frame.
 * Blur wraps the masked ring so the mask cannot clip away the halo.
 * Resize only sizes the gradient; CSS handles the finite light pass. */
export function EstimateFrameLight() {
  const ref = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const frame = ref.current
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const resize = () => {
      frame.style.setProperty("--frame-span", Math.ceil(Math.hypot(frame.clientWidth, frame.clientHeight)) + 4 + "px")
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [active])

  if (!active) return null

  return <span ref={ref} className={styles.frameLight} aria-hidden="true" onAnimationEnd={event => {
    if (event.target === event.currentTarget) setActive(false)
  }}>
    <span className={styles.frameGlow}><span className={styles.frameRing}><i /></span></span>
    <span className={styles.frameBloom}><span className={styles.frameRing}><i /></span></span>
    <span className={styles.frameRing}><i /></span>
  </span>
}
