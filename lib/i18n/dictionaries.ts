import { cache } from "react"
import type { Locale } from "./config"
import type { Dictionary } from "./types"

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("./fr").then(module => module.default),
  en: () => import("./en").then(module => module.default),
  es: () => import("./es").then(module => module.default),
}

// Only the active language is loaded on the server and passed to its sections.
export const getDictionary = cache((locale: Locale) => dictionaries[locale]())
