import type { Locale } from "@/lib/i18n/config"

export const LEGAL_PATHS = {
  notice: "mentions-legales",
  privacy: "confidentialite",
} as const

export type LegalDocument = keyof typeof LEGAL_PATHS

export const LEGAL_LABELS = {
  fr: {
    notice: "Mentions légales", privacy: "Confidentialité",
    home: "Retour au site", navigation: "Informations légales", language: "Langue",
    skip: "Aller au contenu", updated: "Mis à jour le", newTab: "nouvel onglet",
    formInformation: "Le bon dev utilise ces informations pour étudier votre projet et vous répondre.",
  },
  en: {
    notice: "Legal notice", privacy: "Privacy",
    home: "Back to the website", navigation: "Legal information", language: "Language",
    skip: "Skip to content", updated: "Last updated", newTab: "new tab",
    formInformation: "Le bon dev uses this information to review your project and reply to you.",
  },
  es: {
    notice: "Aviso legal", privacy: "Privacidad",
    home: "Volver al sitio", navigation: "Información legal", language: "Idioma",
    skip: "Ir al contenido", updated: "Última actualización", newTab: "nueva pestaña",
    formInformation: "Le bon dev utiliza esta información para estudiar tu proyecto y responderte.",
  },
} as const

export function legalHref(locale: Locale, document: LegalDocument) {
  return `/${locale}/${LEGAL_PATHS[document]}`
}
