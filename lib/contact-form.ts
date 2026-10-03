import { isLocale, type Locale } from "./i18n/config"

export const PROJECT_IDS = ["website", "application", "evolution", "unsure"] as const
export type ProjectId = (typeof PROJECT_IDS)[number]
export type ContactSubmission = {
  name: string; email: string; company: string; phone: string; message: string
  project: ProjectId; locale: Locale
}

export function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function parseContactSubmission(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const fields = value as Record<string, unknown>
  const read = (key: string, max: number, required = false) => {
    const raw = fields[key]
    if (typeof raw !== "string" || raw.length > max || raw.includes("\0")) return null
    const text = raw.trim()
    if ((required && !text) || (key !== "message" && /[\r\n]/.test(text))) return null
    return text
  }
  const name = read("name", 120, true)
  const email = read("email", 254, true)
  const company = read("company", 120)
  const phone = read("phone", 40)
  const message = read("message", 3000, true)
  const project = PROJECT_IDS.find(id => id === fields.project)
  if (name === null || email === null || !isEmail(email) || company === null || phone === null || message === null || !project || !isLocale(fields.locale)) return null
  return { name, email, company, phone, message, project, locale: fields.locale }
}
