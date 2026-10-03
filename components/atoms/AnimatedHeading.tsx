"use client"

import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react"
import { motion, type AnimationControls, type Variants } from "motion/react"
import { useHeadingReveal } from "@/hooks/use-heading-reveal"
import { HEADING_REVEAL, type HeadingReveal } from "@/lib/motion"

type Props = {
  text: string
  children?: ReactNode
  id?: string
  effect?: HeadingReveal
  as?: "h1" | "h2" | "h3" | "p" | "span"
  textClassName?: string
  className?: string
  textAlign?: "left" | "center" | "right"
  controls?: AnimationControls
}

export function AnimatedHeading({
  text, children, id, effect = HEADING_REVEAL, as: Tag = "h2",
  textClassName, className, textAlign = "center", controls: externalControls,
}: Props) {
  const { ref, controls } = useHeadingReveal(effect.threshold, externalControls)
  const Container = Tag === "span" ? "span" : "div"
  const variants: Variants = {
    hidden: effect.effect,
    visible: (index: number) => ({
      opacity: 1, scale: 1, rotateY: 0,
      transition: {
        ...effect.transition,
        delay: effect.startDelay + index * effect.transition.delay,
      },
    }),
  }
  const count = Array.from(text.replace(/\s/g, "")).length
  let index = 0

  // Preserve inline emphasis and line breaks; keep letters grouped into words.
  function tokenize(content: ReactNode): ReactNode {
    return Children.map(content, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child).split(/(\s+)/).map((word, wordIndex) => {
          if (!word.trim()) return word
          return (
            <span key={wordIndex} style={{ whiteSpace: "nowrap" }}>
              {Array.from(word).map((letter) => {
                const position = index++
                return (
                  <motion.span
                    key={position}
                    data-heading-character
                    custom={position}
                    initial={false}
                    animate={controls}
                    variants={variants}
                    style={{
                      display: "inline-block",
                      "--heading-character-position": `${position / Math.max(1, count - 1) * 100}%`,
                    } as CSSProperties}
                  >{letter}</motion.span>
                )
              })}
            </span>
          )
        })
      }
      if (isValidElement<{ children?: ReactNode }>(child) && child.props.children != null) {
        return cloneElement(child, undefined, tokenize(child.props.children))
      }
      return child
    })
  }

  return (
    <Container ref={ref} className={className} style={{ display: "block" }}>
      <Tag id={id} className={textClassName} style={{ display: "block", textAlign }} aria-label={text}>
        <span aria-hidden="true">{tokenize(children ?? text)}</span>
      </Tag>
    </Container>
  )
}
