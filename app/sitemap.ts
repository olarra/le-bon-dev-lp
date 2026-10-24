import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"
import { LOCALES } from "@/lib/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  // Legal pages remain publicly accessible through the footer, with noindex metadata.
  const paths = ["", "/estimation"]
  return paths.flatMap(path => {
    const languages = Object.fromEntries(LOCALES.map(locale => [locale, `${SITE.url}/${locale}${path}`]))
    return LOCALES.map(locale => ({
      url: `${SITE.url}/${locale}${path}`,
      alternates: { languages: { ...languages, "x-default": `${SITE.url}/fr${path}` } },
    }))
  })
}
