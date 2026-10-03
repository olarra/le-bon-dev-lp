import type { ReactNode } from "react"
import type { Metadata } from "next"
import { SITE } from "@/lib/site"
import "lenis/dist/lenis.css"
import "./globals.css"
import { caveat, morna, outfit } from "./fonts"
import { Providers } from "./providers"

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: { card: "summary", title: SITE.title, description: SITE.description },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${morna.variable} ${caveat.variable}`}>
      <body>
        <noscript>
          <style>{'[data-scroll-reveal="pending"], [data-reveal] { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
