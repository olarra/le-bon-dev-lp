"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"
import { attachSectionTransitions } from "./section-transition-controller"

/** Page-like transitions at section edges; long sections retain free scrolling. */
export function SectionTransitions({ targetIds, forwardOnly = false }: {
  targetIds: readonly (string | readonly [string, string])[]
  forwardOnly?: boolean
}) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    // A pair defines one continuous reading range across both sections.
    const targets = targetIds.flatMap(ids => {
      const [startId, endId] = typeof ids === "string" ? [ids, ids] : ids
      const start = document.getElementById(startId)
      const end = document.getElementById(endId)
      return start && end ? [{ start, end }] : []
    })
    const desktop = window.matchMedia(
      "(min-width: 810px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    let detach = () => {}
    const sync = () => {
      detach()
      detach = desktop.matches ? attachSectionTransitions(lenis, targets, { forwardOnly }) : () => {}
    }
    sync()
    desktop.addEventListener("change", sync)
    return () => {
      desktop.removeEventListener("change", sync)
      detach()
    }
  }, [lenis, targetIds, forwardOnly])

  return null
}
