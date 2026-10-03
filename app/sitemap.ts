import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"
import { LOCALES } from "@/lib/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map(locale => [locale, `${SITE.url}/${locale}`]))
  return LOCALES.map(locale => ({
    url: `${SITE.url}/${locale}`,
    alternates: { languages: { ...languages, "x-default": `${SITE.url}/fr` } },
  }))
}
