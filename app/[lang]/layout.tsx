import type { ReactNode } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isLocale, LOCALES } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { SITE } from "@/lib/site"
import { socialMetadata } from "@/lib/seo/social"
import "lenis/dist/lenis.css"
import "../globals.css"
import { caveat, morna, outfit } from "../fonts"
import { Providers } from "../providers"

type Props = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const { seo } = await getDictionary(lang)
  return {
    metadataBase: new URL(SITE.url),
    title: { default: seo.title, template: `%s — ${SITE.name}` },
    description: seo.description,
    robots: { "max-image-preview": "large" },
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", es: "/es", "x-default": "/fr" },
    },
    ...socialMetadata({ locale: lang, path: `/${lang}`, ...seo }),
  }
}

export default async function RootLayout({ children, estimate, params }: Props & { children: ReactNode; estimate: ReactNode }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <html lang={lang} className={`${outfit.variable} ${morna.variable} ${caveat.variable}`}>
      <body>
        <noscript>
          <style>{'[data-scroll-reveal="pending"], [data-reveal] { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
        <Providers key={lang}>{children}{estimate}</Providers>
      </body>
    </html>
  )
}
