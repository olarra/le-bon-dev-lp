"use client"

import type { CSSProperties } from "react"
import { RichText } from "unframer"

type Props = {
  text: string
  /**
   * Intrinsic box of the text at `fontSize`, e.g. "0 0 588.9 222". Framer
   * precomputes it; the heading scales to its container width from it.
   */
  viewBox: string
  fontSize: number
  letterSpacing: string
  color: string
  fontFamily?: string
  /** Framer font selector used by the runtime font loader. */
  font?: string
  className?: string
}

/**
 * Framer "fit text" heading: an SVG with a foreignObject that scales the text
 * to the container width. Rendered with the Framer runtime's RichText so the
 * markup is identical to the published page.
 */
export function FitTextHeading({
  text,
  viewBox,
  fontSize,
  letterSpacing,
  color,
  fontFamily = '"Oswald", "Oswald Placeholder", sans-serif',
  font = "FS;Oswald-regular",
  className,
}: Props) {
  const style = {
    "--framer-font-family": fontFamily,
    "--framer-font-size": `${fontSize}px`,
    "--framer-letter-spacing": letterSpacing,
    "--framer-line-height": "100%",
    "--framer-text-alignment": "left",
    "--framer-text-color": color,
  } as CSSProperties

  return (
    <RichText
      __fromCanvasComponent
      className={className}
      fonts={[font]}
      verticalAlignment="top"
      viewBox={viewBox}
      withExternalLayout
    >
      <>
        <h1 style={style}>{text}</h1>
      </>
    </RichText>
  )
}
