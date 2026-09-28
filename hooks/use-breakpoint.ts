"use client"

import { useEffect, useState } from "react"
import { BREAKPOINTS, MEDIA_QUERIES, type Breakpoint } from "@/lib/breakpoints"

function matchBreakpoint(): Breakpoint {
  for (const bp of BREAKPOINTS) {
    if (window.matchMedia(MEDIA_QUERIES[bp]).matches) return bp
  }
  return "desktop"
}

/**
 * Active breakpoint. `undefined` on the server and during hydration so the
 * first client render matches the SSR markup.
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
