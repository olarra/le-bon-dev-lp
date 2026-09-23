import { SectionStop } from "@/components/atoms/SectionStop"
import { SiteHeader } from "@/components/framer/SiteHeader"
import { PageFrame } from "@/components/layout/PageFrame"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { HeroSection } from "@/components/sections/hero/HeroSection"
import { GuaranteesTimelineSection } from "@/components/sections/guarantees-timeline/GuaranteesTimelineSection"
import { OffersSection } from "@/components/sections/offers/OffersSection"
import { ShowcaseSection } from "@/components/sections/showcase/ShowcaseSection"
import { ShowcaseContent } from "@/components/sections/showcase/ShowcaseContent"
import { MethodSection } from "@/components/sections/method/MethodSection"
import { StudioSection } from "@/components/sections/studio/StudioSection"
import { ContactSection } from "@/components/sections/contact/ContactSection"
import { ContactFormSection } from "@/components/sections/contact/ContactFormSection"

const SECTION_STOP_TARGETS = ["garanties-timeline", "offres"] as const

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageFrame footer={<SiteFooter />}>
        <HeroSection />
        <div id="page-body" className="page-body">
          <GuaranteesTimelineSection />
          <OffersSection />
          {/* The green surface remains behind the project previews. */}
          <ShowcaseSection>
            <ShowcaseContent />
          </ShowcaseSection>
          <MethodSection />
          <StudioSection />
          <ContactSection />
          <ContactFormSection />
        </div>
        <SectionStop targetIds={SECTION_STOP_TARGETS} />
      </PageFrame>
    </>
  )
}
