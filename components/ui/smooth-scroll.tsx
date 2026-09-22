"use client"

import { ReactLenis } from "lenis/react"
import type { ReactNode } from "react"

/** Smooth the document's native scroll without adding a scrolling container. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
