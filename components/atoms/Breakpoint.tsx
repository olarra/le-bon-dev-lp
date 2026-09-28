"use client"

import type { ReactNode } from "react"
import { BREAKPOINTS, type Breakpoint as Bp } from "@/lib/breakpoints"
import { useBreakpoint } from "@/hooks/use-breakpoint"

type Props = {
  /** Breakpoints on which the children are rendered. */
  on: readonly Bp[]
  children: ReactNode
}

/**
 * Renders children only on the given breakpoints.
 *
 * For hydration, before hydration every branch is emitted,
 * wrapped in `.ssr-variant` with `hidden-*` classes (CSS hides the inactive
 * ones). After mount only the active branch stays, with the same wrapper
 * so its children keep their measurements and animation state.
 */
export function Breakpoint({ on, children }: Props) {
  const active = useBreakpoint()

  if (active !== undefined && !on.includes(active)) return null

  const hidden = BREAKPOINTS.filter((bp) => !on.includes(bp)).map((bp) => `hidden-${bp}`)
  return <div className={["ssr-variant", ...hidden].join(" ")}>{children}</div>
}
