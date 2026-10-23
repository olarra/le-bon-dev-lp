export const LOCALES = ["fr", "en", "es"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "fr"
export const LANGUAGE_NAMES: Record<Locale, string> = { fr: "Français", en: "English", es: "Español" }
export const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", es: "es_ES" }

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.some(locale => locale === value)
}

// Stable anchors are shared across translations and existing inbound links.
export const SECTIONS = ["statistics", "garanties-timeline", "offres", "realisations", "la-methode", "le-studio", "estimation", "faq", "contact"] as const
