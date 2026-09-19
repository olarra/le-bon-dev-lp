import { SectionStop } from "@/components/atoms/SectionStop"
import { SiteHeader } from "@/components/framer/SiteHeader"
import { PageFrame } from "@/components/layout/PageFrame"
import { HeroSection } from "@/components/sections/hero/HeroSection"
import { OffersSection } from "@/components/sections/offers/OffersSection"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageFrame>
        <HeroSection />
        {/* Everything after the hero: slides over the pinned hero on scroll
            (globals.css .page-body); HeroSection and SiteHeader measure its
            top edge to drive the cover effect and the utility bar's exit. A
            wheel scroll crossing its top stops there (SectionStop). */}
        <div id="page-body" className="page-body">
          {/* Its two cards carry the nav's #sites-vitrines / #saas-mobile anchors. */}
          <OffersSection />
          {/* Empty anchor sections provide room to test the floating header. */}
          <section id="le-studio" className="scroll-test-section" aria-label="Le studio" />
          <section id="contact" className="scroll-test-section" aria-label="Contact" />
        </div>
        <SectionStop targetId="page-body" />
      </PageFrame>
    </>
  )
}
