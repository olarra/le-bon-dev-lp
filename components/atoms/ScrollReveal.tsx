"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Framer's "fade + slide up on scroll into view" appear effect
 * (opacity 0→1, translateY(170px)→0), used to reveal the Heading, Ticker and
 * Statistics blocks of the Brands and Statistics section one by one.
 */
export function ScrollReveal({
  className,
  children,
  distance = 170,
}: {
  className?: string
  children: ReactNode
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0.001,
        transform: visible ? "translateY(0px)" : `translateY(${distance}px)`,
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {children}
    </div>
  )
}
