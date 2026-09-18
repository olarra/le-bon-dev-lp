"use client"

import { useEffect, useState } from "react"

/** Framer breakpoints of this project (see the page's variant media queries). */
export const BREAKPOINTS = ["desktop", "tablet", "phone"] as const
export type Breakpoint = (typeof BREAKPOINTS)[number]

export const MEDIA_QUERIES: Record<Breakpoint, string> = {
  desktop: "(min-width: 1200px)",
  tablet: "(min-width: 810px) and (max-width: 1199.98px)",
  phone: "(max-width: 809.98px)",
}

function matchBreakpoint(): Breakpoint {
  for (const bp of BREAKPOINTS) {
    if (window.matchMedia(MEDIA_QUERIES[bp]).matches) return bp
  }
  return "desktop"
}

/**
 * Active breakpoint. `undefined` on the server and during hydration so the
 * first client render matches the SSR markup (same approach as Framer).
 */
export function useBreakpoint(): Breakpoint | undefined {
  const [bp, setBp] = useState<Breakpoint | undefined>(undefined)

  useEffect(() => {
    const update = () => setBp(matchBreakpoint())
    update()
    const queries = BREAKPOINTS.map((b) => window.matchMedia(MEDIA_QUERIES[b]))
    queries.forEach((q) => q.addEventListener("change", update))
    return () => queries.forEach((q) => q.removeEventListener("change", update))
  }, [])

  return bp
}
