import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/config"
import { socialMetadata } from "@/lib/seo/social"
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
    ...socialMetadata({ locale, path: estimationHref(locale), title, description, variant: "estimation" }),
  }
}
