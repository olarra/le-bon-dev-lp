import { SiteHeader } from "@/components/framer/SiteHeader"
import { PageFrame } from "@/components/layout/PageFrame"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { HeroSection } from "@/components/sections/hero/HeroSection"
import { GuaranteesSection } from "@/components/sections/guarantees/GuaranteesSection"
import { GuaranteesTimelineSection } from "@/components/sections/guarantees-timeline/GuaranteesTimelineSection"
import { ShowcaseSection } from "@/components/sections/showcase/ShowcaseSection"
import { ShowcaseContent } from "@/components/sections/showcase/ShowcaseContent"
import { MethodSection } from "@/components/sections/method/MethodSection"
import { StudioSection } from "@/components/sections/studio/StudioSection"
import { ContactSection } from "@/components/sections/contact/ContactSection"
import { ContactFormSection } from "@/components/sections/contact/ContactFormSection"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageFrame footer={<SiteFooter />}>
        <HeroSection />
        <div id="page-body" className="page-body">
          <GuaranteesTimelineSection />
          {/* Keep the previous design available during the section migration. */}
          <GuaranteesSection />
          {/* The green surface opens behind both offers and project previews. */}
          <ShowcaseSection>
            <ShowcaseContent />
          </ShowcaseSection>
          <MethodSection />
          <StudioSection />
          <ContactSection />
          <ContactFormSection />
        </div>
      </PageFrame>
    </>
  )
}
