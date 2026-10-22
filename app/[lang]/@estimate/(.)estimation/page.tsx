import { notFound } from "next/navigation"
import { EstimateDialog } from "@/components/estimation/EstimateDialog"
import { isLocale } from "@/lib/i18n/config"
import { getEstimationCopy } from "@/lib/estimation/copy"
import { estimationMetadata } from "@/lib/estimation/metadata"
import { projectType } from "@/lib/estimation/schema"

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ type?: string | string[] }> }

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return estimationMetadata(lang, await getEstimationCopy(lang))
}

export default async function InterceptedEstimation({ params, searchParams }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [copy, query] = await Promise.all([getEstimationCopy(lang), searchParams])
  return <EstimateDialog key={lang + ":" + (projectType(query.type) || "")} locale={lang} copy={copy} prefill={projectType(query.type)} />
}
