"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getVisitPage, isAutomatedVisit, VISIT_ENDPOINT } from "@/lib/visits/config"

// Survives client navigation and remounts, without a visitor ID or browser storage.
// Reloads/new tabs are limited separately by the server-side firewall rule.
let notificationAttempted = false

export function VisitNotification({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()

  useEffect(() => {
    const page = getVisitPage(pathname)
    const privacyRequested = navigator.doNotTrack === "1"
      || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true

    if (!enabled || !page || notificationAttempted || privacyRequested
      || navigator.webdriver || isAutomatedVisit(navigator.userAgent)) return

    const path = page.path
    const currentDocument = document as Document & { prerendering?: boolean }

    function notify() {
      if (notificationAttempted || currentDocument.prerendering) return
      // No automatic retry: a mail provider timeout can occur after delivery.
      notificationAttempted = true
      void fetch(VISIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
        credentials: "same-origin",
        cache: "no-store",
        keepalive: true,
      }).catch(() => { /* A notification must never interrupt the visit. */ })
    }

    // No click, scroll or minimum duration. Only speculative prerenders wait
    // until the browser activates the page; an ordinary background tab counts.
    if (currentDocument.prerendering) {
      document.addEventListener("prerenderingchange", notify, { once: true })
      return () => document.removeEventListener("prerenderingchange", notify)
    }

    notify()
  }, [enabled, pathname])

  return null
}
