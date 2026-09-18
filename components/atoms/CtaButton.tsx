"use client"

import Button from "@/framer/button"
import { Breakpoint } from "./Breakpoint"

type Props = {
  title: string
  href: string
  className?: string
}

/**
 * Framer "Button" (yellow pill with a thick bottom border): Large on
 * desktop/tablet, Small on phone, as in the published page.
 */
export function CtaButton({ title, href, className }: Props) {
  return (
    <div className={className}>
      <Breakpoint on={["desktop", "tablet"]}>
        <Button title={title} link={href} variant="Large" />
      </Breakpoint>
      <Breakpoint on={["phone"]}>
        <Button title={title} link={href} variant="Small" />
      </Breakpoint>
    </div>
  )
}
