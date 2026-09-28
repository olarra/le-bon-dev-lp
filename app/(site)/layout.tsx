import type { ReactNode } from "react"
import { SiteHeader } from "@/components/layout/header/SiteHeader"
import { PageFrame } from "@/components/layout/PageFrame"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteStructuredData } from "@/components/seo/SiteStructuredData"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteStructuredData />
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <SiteHeader />
      <PageFrame footer={<SiteFooter />}>{children}</PageFrame>
    </>
  )
}
