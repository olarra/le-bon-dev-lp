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
        {/* Its two cards carry the nav's #sites-vitrines / #saas-mobile anchors. */}
        <OffersSection />
        {/* Empty anchor sections provide room to test the floating header. */}
        <section id="le-studio" className="scroll-test-section" aria-label="Le studio" />
        <section id="contact" className="scroll-test-section" aria-label="Contact" />
      </PageFrame>
    </>
  )
}
