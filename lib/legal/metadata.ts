import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/config"
import { socialMetadata } from "@/lib/seo/social"
import { getLegalCopy } from "./copy"
import { LEGAL_COMPLETE } from "./details"
import { LEGAL_LABELS, legalHref, type LegalDocument } from "./navigation"

export function legalMetadata(locale: Locale, document: LegalDocument): Metadata {
  const title = LEGAL_LABELS[locale][document]
  const description = getLegalCopy(locale)[document].introduction
  return {
    title,
    description,
    robots: { index: LEGAL_COMPLETE, follow: true },
    alternates: {
      canonical: legalHref(locale, document),
      languages: {
        ...Object.fromEntries(LOCALES.map(language => [language, legalHref(language, document)])),
        "x-default": legalHref("fr", document),
      },
    },
    ...socialMetadata({ locale, path: legalHref(locale, document), title, description }),
  }
}
