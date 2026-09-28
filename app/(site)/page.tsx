import type { Metadata } from "next"
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
import styles from "./page.module.css"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const SECTION_TARGETS = ["statistics", "garanties-timeline"] as const

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div id="page-body" className={styles.sections}>
        <GuaranteesTimelineSection />
        <OffersSection />
        <ShowcaseSection>
          <ShowcaseContent />
        </ShowcaseSection>
        <MethodSection />
        <StudioSection />
        <ContactSection />
        <ContactFormSection />
      </div>
      <SectionTransitions targetIds={SECTION_TARGETS} forwardOnly />
    </>
  )
}
