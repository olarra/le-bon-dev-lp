import { CONTACT } from "@/lib/contact"

export const PROJECT_TYPES = ["Site internet", "Application", "Évolution", "À définir"] as const

export type ContactDraft = { href: string; copy: string }

/** Until a delivery service is configured, prepare a draft without storing or sending data. */
export function prepareContactDraft(data: FormData): ContactDraft {
  const read = (field: string) => String(data.get(field) ?? "").trim()
  const project = PROJECT_TYPES.find((value) => value === read("project")) ?? "À définir"
  const subject = `Un projet à vous présenter — ${project}`
  const body = [
    "Bonjour Le bon dev,",
    "",
    read("message"),
    "",
    "— Mes coordonnées —",
    `Nom : ${read("name")}`,
    `E-mail : ${read("email")}`,
    ...(read("company") ? [`Entreprise : ${read("company")}`] : []),
    ...(read("phone") ? [`Téléphone : ${read("phone")}`] : []),
    `Projet : ${project}`,
  ].join("\r\n")

  return {
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    copy: `À : ${CONTACT.email}\r\nObjet : ${subject}\r\n\r\n${body}`,
  }
}
