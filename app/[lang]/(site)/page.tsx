import { notFound } from "next/navigation"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { SectionTransitions } from "@/components/atoms/SectionTransitions"
import { HeroSection } from "@/components/sections/hero/HeroSection"
import { GuaranteesTimelineSection } from "@/components/sections/guarantees-timeline/GuaranteesTimelineSection"
import { OffersSection } from "@/components/sections/offers/OffersSection"
import { ShowcaseSection } from "@/components/sections/showcase/ShowcaseSection"
import { ShowcaseContent } from "@/components/sections/showcase/ShowcaseContent"
import { MethodSection } from "@/components/sections/method/MethodSection"
import { StudioSection } from "@/components/sections/studio/StudioSection"
import { ContactSection } from "@/components/sections/contact/ContactSection"
import { ContactFormSection } from "@/components/sections/contact/ContactFormSection"
import { FaqSection } from "@/components/sections/faq/FaqSection"
import styles from "./page.module.css"

const SECTION_TARGETS = ["statistics", "garanties-timeline"] as const

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const copy = await getDictionary(lang)
  return (
    <>
      <HeroSection copy={copy.hero} topbar={copy.topbar} locale={lang} />
      <div id="page-body" className={styles.sections}>
        <GuaranteesTimelineSection copy={copy.guarantees} />
        <OffersSection copy={copy.offers} />
        <ShowcaseSection>
          <ShowcaseContent copy={copy.showcase} />
        </ShowcaseSection>
        <MethodSection copy={copy.method} />
        <StudioSection copy={copy.studio} />
        <ContactSection copy={copy.estimate} locale={lang} />
        <FaqSection copy={copy.faq} locale={lang} />
        <ContactFormSection locale={lang} copy={copy.contact} />
      </div>
      <SectionTransitions targetIds={SECTION_TARGETS} forwardOnly />
    </>
  )
}
