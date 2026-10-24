import { isLocale, type Locale } from "@/lib/i18n/config"

export const VISIT_ENDPOINT = "/api/visit"
export const VISIT_RATE_LIMIT_ID = "visit-notification"

export const VISIT_PROTECTED_ROUTES = [{
  path: VISIT_ENDPOINT,
  method: "POST",
  advancedOptions: { checkLevel: "basic" as const },
}]

export type VisitPage = { path: string; locale: Locale; kind: "studio" | "estimation" }

/** Only public commercial pages; never query strings, fragments or form data. */
export function getVisitPage(path: unknown): VisitPage | null {
  if (typeof path !== "string" || !/^\/(fr|en|es)(\/estimation)?\/?$/.test(path)) return null
  const [, locale, page] = path.split("/")
  if (!isLocale(locale)) return null
  const kind = page === "estimation" ? "estimation" : "studio"
  return { path: `/${locale}${kind === "estimation" ? "/estimation" : ""}`, locale, kind }
}

// Do not match "Google" or "AppleWebKit": these also identify real browsers.
const AUTOMATED_CLIENT = /bot|crawler|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|phantomjs|playwright|puppeteer|selenium|webdriver|lighthouse|pagespeed|googleother|google-extended|google-inspectiontool|google-read-aloud|googleproducer|monitor|uptime|curl|wget|python|httpclient|go-http-client|node-fetch|axios|postman|insomnia/i

export function isAutomatedVisit(userAgent: string | null): boolean {
  return !userAgent?.trim() || AUTOMATED_CLIENT.test(userAgent)
}
