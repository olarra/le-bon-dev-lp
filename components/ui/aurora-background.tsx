"use client"

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import styles from "./aurora-background.module.css"

interface AuroraBackgroundProps extends ComponentPropsWithoutRef<"div"> {
  showRadialGradient?: boolean
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!root.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting)
    })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      {...props}
      ref={root}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-active={active}
    >
      <div className={styles.backdrop} aria-hidden="true">
        <div
          className={[styles.aurora, showRadialGradient && styles.radial]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
      {children}
    </div>
  )
}
