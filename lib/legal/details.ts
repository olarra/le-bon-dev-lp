import type { Locale } from "@/lib/i18n/config"

type Publisher = {
  /** The individual publishing the website also directs its publication. */
  name: string
  tradingName: string
  /** Public address to be supplied by the owner, not copied from private contracts. */
  address: string | null
  cooperative: {
    name: string
    registration: string
  }
}

type Host = {
  name: string
  address: string
  phone: string
  email: string
  website: string
  /** Provider-declared processing locations and transfer safeguards. */
  dataProcessing: Record<Locale, string>
  dataProcessingUrl: string
}

type LegalDetails = {
  publisher: Publisher | null
  host: Host | null
  requestRetentionMonths: number | null
  /** Match the actual deletion rule applied to visit emails in the studio mailbox. */
  visitNotificationRetentionDays: number | null
}

/** Public identity supplied by the owner and official details of the selected host. */
export const LEGAL_DETAILS: LegalDetails = {
  publisher: {
    name: "Jesus Garnica Olarra",
    tradingName: "Le bon dev",
    address: "101 bis avenue Charles de Gaulle, Bures-sur-Yvette",
    // Public registration: https://annuaire-entreprises.data.gouv.fr/entreprise/977610781
    cooperative: {
      name: "Jump Green",
      registration: "SIREN 977 610 781",
    },
  },
  host: {
    // Official contact details: https://vercel.com/legal/privacy-notice
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
    // Public legal contact: https://vercel.com/legal/dmca-policy
    phone: "+1 559 288 7060",
    email: "privacy@vercel.com",
    website: "https://vercel.com",
    dataProcessing: {
      fr: "Vercel Inc. assure l’hébergement et le traitement des requêtes. Les données peuvent être traitées aux États-Unis et dans d’autres pays où opèrent ses sous-traitants. Son accord de traitement prévoit des garanties de transfert, notamment les clauses contractuelles types européennes.",
      en: "Vercel Inc. provides hosting and processes requests. Data may be processed in the United States and other countries where its subprocessors operate. Its data processing agreement provides transfer safeguards, including the European Commission’s standard contractual clauses.",
      es: "Vercel Inc. aloja el sitio y procesa las solicitudes. Los datos pueden tratarse en Estados Unidos y en otros países donde operan sus subencargados. Su acuerdo de tratamiento prevé garantías para las transferencias, incluidas las cláusulas contractuales tipo de la Comisión Europea.",
    },
    dataProcessingUrl: "https://vercel.com/legal/dpa",
  },
  requestRetentionMonths: 36,
  visitNotificationRetentionDays: 90,
}

export const LEGAL_UPDATED_AT = "2026-10-24"
