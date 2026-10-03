"use client"

import { Fragment, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Paragraph = { text: string; emphasis?: string }

/** One continuous word sequence across paragraphs, in the viewport's reading area. */
export function MagicText({ paragraphs, className }: {
  paragraphs: readonly Paragraph[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const paragraph = ref.current
    if (!paragraph) return
    const tokens = paragraph.querySelectorAll<HTMLElement>("[data-magic-word]")
    const media = gsap.matchMedia()
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const style = getComputedStyle(paragraph)
      // Set every word up front: delayed stagger children must stay muted
      // before their individual tween begins, including after a refresh.
      gsap.set(tokens, {
        color: style.getPropertyValue("--text-reveal-muted").trim() || "#9ca791",
      })
      gsap.to(tokens, {
        color: style.color,
        duration: 1,
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 85%",
          end: "bottom 85%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, paragraph)

    let disposed = false
    const refresh = () => { if (!disposed) ScrollTrigger.refresh() }
    void document.fonts.ready.then(refresh)
    const observer = new ResizeObserver(refresh)
    observer.observe(paragraph)
    return () => {
      disposed = true
      observer.disconnect()
      media.revert()
    }
  }, [paragraphs])

  return (
    <div ref={ref} className={className} data-magic-sequence>
      {paragraphs.map(({ text, emphasis }) => {
        const words = text.split(/\s+/)
        const emphasizedWords = emphasis && text.startsWith(emphasis) ? emphasis.split(/\s+/).length : 0
        return <p key={text} data-magic-text>
          {words.map((word, index) => {
            const Tag = index < emphasizedWords ? "strong" : "span"
            return <Fragment key={index}>{index > 0 && " "}<Tag data-magic-word>{word}</Tag></Fragment>
          })}
        </p>
      })}
    </div>
  )
}
