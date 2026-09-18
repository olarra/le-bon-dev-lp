"use client"

import type { CSSProperties } from "react"

/** Motion style values (numbers for transforms such as `rotate`). */
export type MotionStyle = Record<string, string | number>
import { motion, withFX } from "unframer"
import Label from "@/framer/label"

export type FxValues = {
  opacity: number
  rotate: number
  rotateX: number
  rotateY: number
  scale: number
  skewX: number
  skewY: number
  x: number
  y: number
}

export type SpringTransition = { type: "spring"; bounce: number; delay: number; duration: number }
export type TweenTransition = { type: "tween"; delay: number; duration: number; ease: [number, number, number, number] }

export const FX_DEFAULTS: FxValues = {
  opacity: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  skewX: 0,
  skewY: 0,
  x: 0,
  y: 0,
}

/** Framer "appear" start state: invisible and collapsed. */
export const FX_HIDDEN: FxValues = { ...FX_DEFAULTS, opacity: 0.001, scale: 0 }

export type FloatingLabelProps = {
  /** Positioning class (absolute position inside the hero container). */
  className?: string
  /** Static transform values, e.g. a base rotation. */
  style?: MotionStyle
  /** Appear animation target. */
  animate: FxValues & { transition: SpringTransition }
  /** Loop target; mirrors back and forth between defaults and this. */
  loop: FxValues
  loopTransition: TweenTransition
  /** Whether the element is centered on its anchor point (Framer's translate(-50%,-50%)). */
  centered?: boolean
  label: {
    text: string
    svg: string
    backgroundColor: string
    textColor: string
    variant: "Small" | "Large"
    style?: CSSProperties
  }
}

// Same wrapper the Framer page uses: appear (initial→animate) and loop values
// are combined into one transform by the runtime.
const FxDiv = withFX(motion.div)

const centeredTemplate = (_: unknown, generated: string) => `translate(-50%, -50%) ${generated}`

/**
 * Framer "Label" (wavy blob with a word) that springs in, then rocks back and
 * forth forever while on screen.
 */
export function FloatingLabel({
  className,
  style,
  animate,
  loop,
  loopTransition,
  centered = true,
  label,
}: FloatingLabelProps) {
  return (
    <FxDiv
      className={className}
      style={style}
      initial={FX_HIDDEN}
      animate={animate}
      transformTemplate={centered ? centeredTemplate : undefined}
      __framer__loop={loop}
      __framer__loopEffectEnabled
      __framer__loopPauseOffscreen
      __framer__loopRepeatDelay={0}
      __framer__loopRepeatType="mirror"
      __framer__loopTransition={loopTransition}
      __perspectiveFX={false}
      __targetOpacity={1}
    >
      <Label
        sectionLabel={label.text}
        sVGCode={label.svg}
        backgroundColor={label.backgroundColor}
        textColor={label.textColor}
        variant={label.variant}
        style={label.style}
      />
    </FxDiv>
  )
}
