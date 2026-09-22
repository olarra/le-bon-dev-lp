"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { UnframerProvider } from "unframer"
import { SmoothScroll } from "@/components/ui/smooth-scroll"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <UnframerProvider navigate={(url) => router.push(url)}>
      <SmoothScroll>{children}</SmoothScroll>
    </UnframerProvider>
  )
}
