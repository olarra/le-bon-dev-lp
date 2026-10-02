"use client"

import { useRef, type ComponentPropsWithoutRef } from "react"
import { useStickerMotion } from "@/hooks/use-sticker-motion"

type Props = ComponentPropsWithoutRef<"section">

export function StickerSurface({ children, ...props }: Props) {
  const ref = useRef<HTMLElement>(null)
  useStickerMotion(ref)

  return (
    <section {...props} ref={ref}>
      {children}
    </section>
  )
}
