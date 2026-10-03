"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BrandLogo } from "@/components/atoms/BrandLogo"
import { FOOTER_WORDMARK } from "@/lib/motion"
import styles from "./SiteFooter.module.css"

gsap.registerPlugin(ScrollTrigger)

/** A short drift adds depth to the whole logo; its child owns the once-only
 * fade/rise. The stationary frame measures scroll without cropping either. */
export function FooterWordmark({ label }: { label: string }) {
  const motionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const motion = motionRef.current
    const frame = frameRef.current
    const wordmark = wordmarkRef.current
    if (!motion || !frame || !wordmark) return
    const media = gsap.matchMedia()
    let revealed = false
    media.add({
      animate: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (context.conditions?.reduced) {
        revealed = true
        wordmark.dataset.wordmarkRevealed = ""
        return
      }
      gsap.fromTo(motion, {
        y: () => -Math.min(frame.clientHeight * FOOTER_WORDMARK.heightRatio, FOOTER_WORDMARK.maxDistance),
      }, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "clamp(top bottom)",
          end: "max",
          scrub: FOOTER_WORDMARK.scrub,
          invalidateOnRefresh: true,
        },
      })

      if (revealed) return
      const entrance = gsap.fromTo(wordmark, {
        y: () => parseFloat(getComputedStyle(frame).getPropertyValue("--wordmark-rise")),
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: FOOTER_WORDMARK.revealDuration,
        ease: "power1.inOut",
        paused: true,
        immediateRender: true,
        clearProps: "transform,opacity",
      })
      const play = () => {
        if (revealed) return
        revealed = true
        wordmark.dataset.wordmarkRevealed = ""
        entrance.play()
      }
      const trigger = ScrollTrigger.create({
        trigger: frame,
        start: () => Math.max(0, Math.min(
          window.scrollY + frame.getBoundingClientRect().top - innerHeight * FOOTER_WORDMARK.revealViewport,
          ScrollTrigger.maxScroll(window) - 1,
        )),
        once: true,
        onEnter: play,
        onRefresh: self => {
          if (revealed) return
          entrance.invalidate()
          if (self.scroll() >= self.start) play()
        },
      })
      // Play the entrance on a direct load at the footer too; never settle it
      // merely because the browser has restored an already-visible position.
      if (trigger.scroll() >= trigger.start) play()

      const onFocus = () => {
        revealed = true
        wordmark.dataset.wordmarkRevealed = ""
        entrance.progress(1).pause()
        trigger.kill()
      }
      wordmark.addEventListener("focus", onFocus)
      return () => { wordmark.removeEventListener("focus", onFocus) }
    })

    let disposed = false
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => {
      disposed = true
      media.revert()
    }
  }, [])

  return (
    <div ref={frameRef} className={styles.wordmarkFrame} data-wordmark-frame>
      <noscript><style>{"[data-footer-wordmark] { opacity: 1 !important; transform: none !important; }"}</style></noscript>
      <div ref={motionRef} className={styles.wordmarkMotion}>
        <a ref={wordmarkRef} className={styles.wordmark} href="#statistics" aria-label={label} data-footer-wordmark>
          <BrandLogo placement="footer" />
        </a>
      </div>
    </div>
  )
}
