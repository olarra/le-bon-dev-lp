"use client"

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"
import styles from "./ScrollReveal.module.css"

export function ScrollReveal({ className, children, distance = 170, delay = 0 }: {
  className?: string
  children: ReactNode
  distance?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let animation: Animation | undefined
    let observer: IntersectionObserver | undefined
    const show = () => {
      element.dataset.scrollReveal = "visible"
      animation?.cancel()
      observer?.disconnect()
    }

    if (!reduced.matches) {
      element.dataset.scrollReveal = "pending"
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer?.disconnect()
        animation = element.animate([
          { opacity: 0.001, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 600, delay: delay * 1000, easing: "ease", fill: "both" })
        animation.onfinish = show
      })
      observer.observe(element)
    } else {
      show()
    }

    const onPreference = () => { if (reduced.matches) show() }
    reduced.addEventListener("change", onPreference)
    return () => {
      show()
      reduced.removeEventListener("change", onPreference)
    }
  }, [distance, delay])

  return (
    <div
      ref={ref}
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      data-scroll-reveal="pending"
      style={{ "--reveal-distance": `${distance}px` } as CSSProperties}
    >
      {children}
    </div>
  )
}
