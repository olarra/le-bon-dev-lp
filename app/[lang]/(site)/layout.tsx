import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { RevealController } from "@/components/atoms/RevealController"
import { SiteHeader } from "@/components/layout/header/SiteHeader"
import { PageFrame } from "@/components/layout/PageFrame"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteStructuredData } from "@/components/seo/SiteStructuredData"

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const copy = await getDictionary(lang)
  return (
    <>
      <SiteStructuredData locale={lang} description={copy.seo.description} title={copy.seo.title} />
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <SiteHeader locale={lang} copy={copy.header} />
      <PageFrame footer={<SiteFooter copy={copy.footer} />}>{children}</PageFrame>
      <RevealController />
    </>
  )
}
