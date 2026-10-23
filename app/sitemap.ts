import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"
import { LOCALES } from "@/lib/i18n/config"
import { LEGAL_COMPLETE } from "@/lib/legal/details"
import { LEGAL_PATHS } from "@/lib/legal/navigation"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/estimation", ...(LEGAL_COMPLETE ? Object.values(LEGAL_PATHS).map(path => `/${path}`) : [])]
  return paths.flatMap(path => {
    const languages = Object.fromEntries(LOCALES.map(locale => [locale, `${SITE.url}/${locale}${path}`]))
    return LOCALES.map(locale => ({
      url: `${SITE.url}/${locale}${path}`,
      alternates: { languages: { ...languages, "x-default": `${SITE.url}/fr${path}` } },
    }))
  })
}
