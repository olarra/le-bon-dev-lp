import type { Locale } from "@/lib/i18n/config"

type Publisher = {
  name: string
  legalForm: string
  address: string
  registration: string
  /** null means not applicable, once the owner's status has been confirmed. */
  vatNumber: string | null
  capital: string | null
}

type Host = {
  name: string
  address: string
  phone: string
  website: string
  /** Actual processing locations and transfer safeguards for the chosen hosting. */
  dataProcessing: Record<Locale, string>
}

type LegalDetails = {
  publisher: Publisher | null
  publicationDirector: string | null
  host: Host | null
  requestRetentionMonths: number | null
}

/** Public facts only. Awaiting the owner's details; never infer them from LWS asset hosting. */
export const LEGAL_DETAILS: LegalDetails = {
  publisher: null,
  publicationDirector: null,
  host: null,
  requestRetentionMonths: null,
}

export const LEGAL_COMPLETE = Boolean(
  LEGAL_DETAILS.publisher
  && LEGAL_DETAILS.publicationDirector
  && LEGAL_DETAILS.host
  && LEGAL_DETAILS.requestRetentionMonths,
)

export const LEGAL_UPDATED_AT = "2026-10-23"
