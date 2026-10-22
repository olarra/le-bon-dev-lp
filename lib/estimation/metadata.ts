import type { Metadata } from "next"
import { LOCALES, OG_LOCALES, type Locale } from "@/lib/i18n/config"
import { SITE } from "@/lib/site"
import type { EstimationCopy } from "./copy"
import { estimationHref } from "./schema"

export function estimationMetadata(locale: Locale, copy: EstimationCopy): Metadata {
  const { title, description } = copy.seo
  return {
    title,
    description,
    alternates: {
      canonical: estimationHref(locale),
      languages: { ...Object.fromEntries(LOCALES.map(language => [language, estimationHref(language)])), "x-default": estimationHref("fr") },
    },
    openGraph: {
      type: "website", siteName: SITE.name, url: estimationHref(locale), title, description,
      locale: OG_LOCALES[locale], alternateLocale: LOCALES.filter(language => language !== locale).map(language => OG_LOCALES[language]),
    },
    twitter: { card: "summary", title, description },
  }
}
