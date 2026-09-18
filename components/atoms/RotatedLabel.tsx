"use client"

import type { CSSProperties } from "react"
import Label from "@/framer/label"
import styles from "./RotatedLabel.module.css"

type Position = { top: string; left: string }

type Props = {
  text?: string
  svg: string
  backgroundColor: string
  textColor: string
  variant: "Small" | "Large"
  /** top/left per breakpoint (desktop/tablet); on phone the label goes static/inline. */
  desktop: Position
  tablet: Position
  className?: string
}

/**
 * A static (non-looping) floating Label pill, rotated -20deg, used for the
 * "Brands" and "Numbers" tags in the Brands and Statistics section. Unlike
 * the Hero's wave labels these don't spring-loop; they just ride along with
 * their parent's scroll-reveal animation.
 */
export function RotatedLabel({ text, svg, backgroundColor, textColor, variant, desktop, tablet, className }: Props) {
  const style = {
    "--label-top-desktop": desktop.top,
    "--label-left-desktop": desktop.left,
    "--label-top-tablet": tablet.top,
    "--label-left-tablet": tablet.left,
  } as CSSProperties

  return (
    <div className={[styles.label, className].filter(Boolean).join(" ")} style={style}>
      <Label sectionLabel={text} sVGCode={svg} backgroundColor={backgroundColor} textColor={textColor} variant={variant} />
    </div>
  )
}
