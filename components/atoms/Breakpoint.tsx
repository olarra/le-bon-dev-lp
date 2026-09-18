"use client"

import type { ReactNode } from "react"
import { BREAKPOINTS, useBreakpoint, type Breakpoint as Bp } from "@/lib/breakpoints"

type Props = {
  /** Breakpoints on which the children are rendered. */
  on: readonly Bp[]
  children: ReactNode
}

/**
 * Renders children only on the given breakpoints.
 *
 * Mirrors Framer's SSR strategy: before hydration every branch is emitted,
 * wrapped in `.ssr-variant` with `hidden-*` classes (CSS hides the inactive
 * ones). After mount only the active branch stays in the tree.
 */
export function Breakpoint({ on, children }: Props) {
  const active = useBreakpoint()

  if (active === undefined) {
    const hidden = BREAKPOINTS.filter((bp) => !on.includes(bp)).map((bp) => `hidden-${bp}`)
    return <div className={["ssr-variant", ...hidden].join(" ")}>{children}</div>
  }

  return on.includes(active) ? <>{children}</> : null
}
