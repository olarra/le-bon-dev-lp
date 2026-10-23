import { notFound } from "next/navigation"
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage"
import { isLocale } from "@/lib/i18n/config"
import { legalMetadata } from "@/lib/legal/metadata"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return legalMetadata(lang, "privacy")
}

export default async function Privacy({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return <LegalDocumentPage locale={lang} document="privacy" />
}
