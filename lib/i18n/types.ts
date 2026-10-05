import type { Offer } from "@/components/sections/offers/offers.content"
import type { Realisation } from "@/components/sections/showcase/realisations.content"

type Item = { title: string; description: string }
type Link = { label: string; href: string }

export type Dictionary = {
  seo: { title: string; description: string }
  skip: string
  header: { home: string; navigation: string; menu: string; close: string; contact: string; language: string; links: Link[] }
  topbar: { availability: string; response: string }
  hero: {
    eyebrow: string; titleLines: string[]; subtitle: string; cta: string; hint: string
    highlightBefore: string; highlightWord: string; highlightAfter: string
  }
  guarantees: {
    eyebrow: string; titleBefore: string; titleHighlight: string; titleAfter: string; titleEnd: string; subtitle: string
    steps: readonly (Item & { phase: string })[]
  }
  offers: {
    eyebrow: string; title: string; audience: string; included: string; from: string
    items: readonly Offer[]
  }
  showcase: {
    eyebrow: string; titleLines: string[]; subtitle: string; context: string; offer: string
    projects: Record<"miau" | "studio", Realisation>; phones: string[]; artworks: string[]; gallery: string; newTab: string
  }
  method: { eyebrow: string; title: string; steps: readonly Item[] }
  studio: {
    eyebrow: string; titleLines: string[]; paragraphs: readonly { text: string; emphasis?: string }[]
    cta: string; factsLabel: string; facts: readonly { value: string; label: string }[]
    principlesLabel: string; principles: readonly (readonly [string, string])[]; scene: string; replay: string
    ecosystem: { eyebrow: string; title: string; list: string; cta: string; ctaLabel: string; description: string; pause: string; resume: string; pauseLabel: string; resumeLabel: string }
  }
  estimate: {
    title: string; description: string; response: string; cta: string; whatsapp: string; whatsappLabel: string
    eyebrow: string; criteriaTitle: string; factors: readonly Item[]
  }
  contact: {
    eyebrow: string; titleBefore: string; titleHighlight: string; description: string; detailsLabel: string
    email: string; whatsapp: string; response: string; developer: string
    form: {
      label: string; name: string; namePlaceholder: string; email: string; emailPlaceholder: string
      company: string; companyPlaceholder: string; phone: string; phonePlaceholder: string; optional: string
      project: string; projectTypes: Record<"website" | "application" | "evolution" | "unsure", string>
      message: string; messagePlaceholder: string; hint: string; submit: string; pending: string
      success: string; error: string; unavailable: string; invalid: string; nameRequired: string; messageRequired: string; honeypot: string
    }
    confirmation: { subject: string; greeting: string; body: string; closing: string }
  }
  footer: { tagline: string[]; description: string[]; groups: readonly { label: string; links: readonly Link[] }[]; navigationSuffix: string; invitation: string; cta: string; home: string; top: string }
}
