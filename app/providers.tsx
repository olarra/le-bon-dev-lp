"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { UnframerProvider } from "unframer"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  return <UnframerProvider navigate={(url) => router.push(url)}>{children}</UnframerProvider>
}
