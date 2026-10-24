"use client"

import { Fragment, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createScrollTriggerRefresh } from "@/lib/scroll-trigger-refresh"

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
        color: style.getPropertyValue("--text-reveal-muted").trim() || "#657563",
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

    const refresh = createScrollTriggerRefresh()
    void document.fonts.ready.then(refresh.request)
    let previousSize: { width: number; height: number } | undefined
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      // The initial notification repeats setup's measurements; fonts.ready
      // already covers font replacement. Only later size changes need a pass.
      if (previousSize && (width !== previousSize.width || height !== previousSize.height)) refresh.request()
      previousSize = { width, height }
    })
    observer.observe(paragraph)
    return () => {
      refresh.dispose()
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
