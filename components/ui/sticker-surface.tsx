"use client"

import { useRef, type ComponentPropsWithoutRef } from "react"
import { useStickerMotion, type StickerTracking } from "@/hooks/use-sticker-motion"

type Props = ComponentPropsWithoutRef<"section"> & { tracking?: StickerTracking }

export function StickerSurface({ children, tracking, ...props }: Props) {
  const ref = useRef<HTMLElement>(null)
  useStickerMotion(ref, { tracking })

  return (
    <section {...props} ref={ref}>
      {children}
    </section>
  )
}
