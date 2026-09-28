"use client"

import type { ReactNode } from "react"
import { SmoothScroll } from "@/components/ui/smooth-scroll"

export function Providers({ children }: { children: ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>
}
