import { isEmail } from "@/lib/contact-form"
import { isLocale, type Locale } from "@/lib/i18n/config"

export const PROJECT_TYPES = ["site", "webapp", "mobile", "shop", "redo", "unknown"] as const
export const SECTORS = ["health", "property", "finance", "trades", "retail", "education", "sports", "business", "public", "media", "other"] as const
export const AUDIENCES = ["public", "team", "both"] as const
export const FEATURES = ["booking", "payment", "accounts", "admin", "notifications", "messaging", "documents", "catalog", "languages", "maps", "analytics", "integrations", "ai", "other"] as const
export const DESIGNS = ["zero", "brand", "mockups", "rebrand"] as const
export const DELAYS = ["month", "three-months", "six-months", "unknown"] as const
export const BUDGETS = ["under-5", "5-15", "15-40", "over-40", "unknown"] as const
export const CONSTRAINTS = ["sensitive", "accessibility", "france"] as const
export const STEP_COUNT = 7
export const DRAFT_KEY = "lbd-estimation-v2"

export type ProjectType = (typeof PROJECT_TYPES)[number]
export const TEXT_LIMITS = {
  typeOther: 500, sectorNote: 500, featureOther: 1000, featureIA: 1000,
  deadline: 240, name: 160, desc: 6000, link: 2048,
  firstName: 120, email: 254, company: 160, phone: 40,
} as const
export type TextField = keyof typeof TEXT_LIMITS
type TextAnswers = Record<TextField, string>

export type EstimateAnswers = TextAnswers & {
  types: ProjectType[]
  sector: (typeof SECTORS)[number] | ""
  audience: (typeof AUDIENCES)[number] | ""
  features: (typeof FEATURES)[number][]
  design: (typeof DESIGNS)[number] | ""
  delay: (typeof DELAYS)[number] | ""
  budget: (typeof BUDGETS)[number] | ""
  constraints: (typeof CONSTRAINTS)[number][]
  source: ProjectType | ""
}
export type EstimateDraft = EstimateAnswers & { step: number; visited: number }
export type EstimateSubmission = EstimateAnswers & { locale: Locale }

export function projectType(value: unknown): ProjectType | undefined {
  return PROJECT_TYPES.find(type => type === value)
}

export function estimationHref(locale: Locale, type?: ProjectType) {
  return "/" + locale + "/estimation" + (type ? "?type=" + type : "")
}

export function freshDraft(): EstimateDraft {
  return {
    step: 1, visited: 1, types: [], typeOther: "", sector: "", sectorNote: "",
    audience: "", features: [], featureOther: "", featureIA: "", design: "",
    delay: "", deadline: "", budget: "", constraints: [], name: "", desc: "", link: "",
    firstName: "", email: "", company: "", phone: "", source: "",
  }
}

export function isApplication(types: readonly ProjectType[]) {
  return types.some(type => type === "webapp" || type === "mobile" || type === "shop")
}

function choice<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  return allowed.find(item => item === value) ?? ""
}

function choices<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(value)) return []
  return allowed.filter(item => value.includes(item))
}

/** Drafts are untrusted browser data; only known fields and bounded values survive. */
export function restoreDraft(value: unknown, prefill?: ProjectType): EstimateDraft {
  const draft = freshDraft()
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const saved = value as Record<string, unknown>
    for (const field of Object.keys(TEXT_LIMITS) as TextField[]) {
      if (typeof saved[field] === "string") draft[field] = (saved[field] as string).replace(/\0/g, "").slice(0, TEXT_LIMITS[field])
    }
    draft.types = choices(saved.types, PROJECT_TYPES)
    draft.sector = choice(saved.sector, SECTORS)
    draft.audience = choice(saved.audience, AUDIENCES)
    draft.features = choices(saved.features, FEATURES)
    draft.design = choice(saved.design, DESIGNS)
    draft.delay = choice(saved.delay, DELAYS)
    draft.budget = choice(saved.budget, BUDGETS)
    draft.constraints = choices(saved.constraints, CONSTRAINTS)
    draft.source = choice(saved.source, PROJECT_TYPES)
    if (Number.isInteger(saved.visited)) draft.visited = Math.min(STEP_COUNT, Math.max(1, saved.visited as number))
    if (Number.isInteger(saved.step)) draft.step = Math.min(draft.visited, Math.max(1, saved.step as number))
  }
  if (prefill) {
    draft.types = prefill === "unknown" ? ["unknown"] : [...new Set([...draft.types.filter(type => type !== "unknown"), prefill])]
    draft.source = prefill
  } else if (draft.types.includes("unknown")) {
    draft.types = ["unknown"]
  }
  return draft
}

export function validProjectLink(value: string) {
  if (!value.trim()) return true
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value.trim()) ? value.trim() : "https://" + value.trim())
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !/\s/.test(value)
  } catch { return false }
}

export type EstimateError = { field: "project" | "firstName" | "email" | "link"; step: number }
export function validateEstimate(answers: EstimateAnswers, step?: number): EstimateError | null {
  if ((!step || step === 1) && !answers.types.length && !answers.typeOther.trim()) return { field: "project", step: 1 }
  if ((!step || step === 6) && !validProjectLink(answers.link)) return { field: "link", step: 6 }
  if (!step || step === 7) {
    if (!answers.firstName.trim()) return { field: "firstName", step: 7 }
    if (!isEmail(answers.email.trim())) return { field: "email", step: 7 }
  }
  return null
}

/** Keep conditionally hidden answers in the draft, but never include them in an email. */
export function submissionFromDraft(draft: EstimateDraft, locale: Locale): EstimateSubmission {
  const { step: _step, visited: _visited, ...answers } = draft
  return {
    ...answers, locale,
    audience: isApplication(answers.types) ? answers.audience : "",
    featureIA: answers.features.includes("ai") ? answers.featureIA : "",
    featureOther: answers.features.includes("other") ? answers.featureOther : "",
  }
}

export function parseEstimateSubmission(value: unknown): EstimateSubmission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const raw = value as Record<string, unknown>
  if (!isLocale(raw.locale)) return null
  for (const [field, limit] of Object.entries(TEXT_LIMITS)) {
    const text = raw[field]
    if (typeof text !== "string" || text.length > limit || text.includes("\0")) return null
    if (["email", "firstName", "company", "phone", "link"].includes(field) && /[\r\n]/.test(text)) return null
  }
  for (const [field, allowed] of Object.entries({ types: PROJECT_TYPES, features: FEATURES, constraints: CONSTRAINTS })) {
    const items = raw[field]
    if (!Array.isArray(items) || items.length > allowed.length || items.some(item => !(allowed as readonly unknown[]).includes(item))) return null
  }
  for (const [field, allowed] of Object.entries({ sector: SECTORS, audience: AUDIENCES, design: DESIGNS, delay: DELAYS, budget: BUDGETS, source: PROJECT_TYPES })) {
    if (raw[field] !== "" && !(allowed as readonly unknown[]).includes(raw[field])) return null
  }
  const draft = restoreDraft(raw)
  for (const field of Object.keys(TEXT_LIMITS) as TextField[]) draft[field] = draft[field].trim()
  if (validateEstimate(draft)) return null
  return submissionFromDraft(draft, raw.locale)
}
