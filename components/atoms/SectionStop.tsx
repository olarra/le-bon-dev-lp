"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"
import { attachSectionStop } from "./section-stop-controller"

/** Stop the current downward wheel gesture at the section entrance.
 * The next gesture continues freely; touch and native controls stay native. */
export function SectionStop({ targetIds }: { targetIds: readonly string[] }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const targets = targetIds
      .map((id) => document.getElementById(id))
      .filter((target): target is HTMLElement => target !== null)
    return attachSectionStop(lenis, targets)
  }, [lenis, targetIds])

  return null
}
