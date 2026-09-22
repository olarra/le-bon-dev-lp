"use client"

import type { CSSProperties, ReactNode } from "react"
import { RichText } from "unframer"

export type TextAppearEffect = {
  type: "appear"
  trigger: "onInView" | "onMount"
  tokenization: "character" | "word" | "line"
  repeat: boolean
  startDelay: number
  threshold: number
  /** Start state of each token; every property animates back to its default. */
  effect: {
    opacity: number
    scale: number
    rotate: number
    rotateX: number
    rotateY: number
    skewX: number
    skewY: number
    x: number
    y: number
  }
  /** Transition per token; `delay` is the stagger between tokens. */
  transition: { type: "spring"; bounce: number; delay: number; duration: number }
}

type Props = {
  text: string
  /** Optional inline formatting, such as a highlighted phrase or a line break. */
  children?: ReactNode
  id?: string
  effect: TextAppearEffect
  as?: "h1" | "h2" | "h3" | "p" | "span"
  /** Class applied to the text element (typography). */
  textClassName?: string
  /** Class applied to the container (layout). */
  className?: string
  textAlign?: "left" | "center" | "right"
}

/**
 * Heading whose characters pop in with Framer's text "appear" effect.
 * Uses the Framer runtime RichText, which tokenizes and animates the text
 * exactly like the published page.
 */
export function AnimatedHeading({
  text,
  children,
  id,
  effect,
  as: Tag = "h1",
  textClassName,
  className,
  textAlign = "center",
}: Props) {
  const style = { "--framer-text-alignment": textAlign } as CSSProperties

  return (
    <RichText
      __fromCanvasComponent
      className={className}
      effect={effect}
      verticalAlignment="top"
      withExternalLayout
    >
      <>
        <Tag id={id} className={textClassName} style={style}>
          {children ?? text}
        </Tag>
      </>
    </RichText>
  )
}
