import type { Locale } from "@/lib/i18n/config"
import type { EstimateAnswers, ProjectType, TextField } from "./schema"

export type TileCopy = { title: string; description: string }
export type EstimationCopy = {
  title: string
  seo: { title: string; description: string }
  page: { eyebrow: string; title: string; description: string; pricing: string; explanationTitle: string; explanation: readonly string[] }
  steps: readonly { label: string; title: string; help: string }[]
  types: Record<ProjectType, TileCopy>
  sectors: Record<Exclude<EstimateAnswers["sector"], "">, string>
  audiences: Record<Exclude<EstimateAnswers["audience"], "">, string>
  features: Record<EstimateAnswers["features"][number], string>
  designs: Record<Exclude<EstimateAnswers["design"], "">, TileCopy>
  delays: Record<Exclude<EstimateAnswers["delay"], "">, string>
  budgets: Record<Exclude<EstimateAnswers["budget"], "">, string>
  constraints: Record<EstimateAnswers["constraints"][number], string>
  fields: Record<TextField, string>
  groups: { audience: string; features: string; budget: string; constraints: string; recap: string; contact: string }
  actions: { back: string; next: string; submit: string; sending: string; retry: string; edit: string; close: string; restart: string; home: string }
  status: { steps: string; step: string; of: string; saved: string; notStored: string; unspecified: string; descriptionProvided: string; deadline: string; language: string; noScript: string }
  errors: { project: string; firstName: string; email: string; link: string; invalid: string; send: string }
  success: { title: string; beforeEmail: string; afterEmail: string; withoutCopy: string; followup: string; details: string }
  email: { subject: string; confirmation: string; greeting: string; body: string; closing: string; sentAt: string }
}

const copies: Record<Locale, () => Promise<EstimationCopy>> = {
  fr: () => import("./locales/fr").then(module => module.default),
  en: () => import("./locales/en").then(module => module.default),
  es: () => import("./locales/es").then(module => module.default),
}

export function getEstimationCopy(locale: Locale) { return copies[locale]() }
