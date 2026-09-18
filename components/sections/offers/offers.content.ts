import type { HandArrowShape } from "./HandArrow"

/**
 * "Les offres" section: copy and assets. The two cards double as the
 * header navigation's "Sites vitrines" / "SaaS & mobile" anchors (their ids
 * match the nav's hrefs in components/framer/SiteHeader.tsx).
 */
export const OFFERS_EYEBROW = "Les offres"

/**
 * Title split in two: the second run carries the marker underline, and each
 * run is its own AnimatedHeading (the hero's per-character reveal), the
 * second picking up the stagger where the first leaves off.
 */
export const OFFERS_TITLE = { plain: "Votre projet", marked: "prend forme." } as const

export type NotePlacement = "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight"

export type OfferNote = {
  text: string
  placement: NotePlacement
  /**
   * Hand-drawn arrow from the note towards the illustration. Its viewBox
   * matches the CSS box given to that placement's arrow in offers.module.css
   * (same aspect ratio), so the curve scales without distortion.
   */
  arrow: HandArrowShape
}

export type Offer = {
  id: string
  tag: string
  title: string
  /** Offer description; wraps naturally at each screen size. */
  lead: string
  features: readonly string[]
  cta: { label: string; href: string; arrow: "right" | "diagonal" }
  image: {
    src: string
    alt: string
    width: number
    height: number
    /** Visible device bounds inside the transparent source image. */
    frame: { x: number; y: number; width: number; height: number }
  }
  /**
   * The soft lime plate behind the device is the device's own silhouette:
   * a small copy of the PNG used as a CSS mask (public/images/offers/*-mask.png,
   * 640px, made with `sips -Z 640`), so it lines up with the tilt, corners
   * and baked shadow exactly, then shifted towards the card's outer edge.
   */
  plate: { mask: string; shift: "right" | "left" }
  /** Which side of the card the illustration sits on (desktop/tablet). */
  figureSide: "right" | "left"
  notes: readonly OfferNote[]
}

// TODO: point the CTAs at the dedicated offer pages once they exist; until
// then they lead to the contact anchor like the header's own CTA.
export const OFFERS: readonly Offer[] = [
  {
    id: "sites-vitrines",
    tag: "Site vitrine",
    title: "Sites vitrines",
    lead: "Un site à votre image pour présenter votre activité, mettre en valeur votre savoir-faire et faciliter la prise de contact.",
    features: ["Création", "Refonte", "Évolution"],
    cta: { label: "Explorer l’offre vitrine", href: "#contact", arrow: "right" },
    image: {
      src: "/images/offers/site-vitrine.png",
      alt: "Site vitrine d’un cabinet d’architecture, ouvert dans un navigateur",
      width: 1536,
      height: 1024,
      frame: { x: 100, y: 110, width: 1350, height: 808 },
    },
    plate: { mask: "/images/offers/site-vitrine-mask.png", shift: "right" },
    figureSide: "right",
    notes: [
      {
        text: "Des projets qui racontent des histoires.",
        placement: "topRight",
        // Leaves the note's left edge, dives onto the browser's top edge.
        arrow: { d: "M86 10 C 60 6, 30 24, 14 86", viewBox: "0 0 90 90" },
      },
      {
        text: "Des sites qui ouvrent des opportunités.",
        placement: "bottomLeft",
        // Leaves the note's right edge, climbs to the browser's bottom-left corner.
        arrow: { d: "M4 88 C 50 96, 110 68, 156 12", viewBox: "0 0 160 96" },
      },
    ],
  },
  {
    id: "saas-mobile",
    tag: "Applications",
    title: "SaaS ou\napplication mobile",
    lead: "Une application web ou mobile conçue autour de vos usages, pour simplifier le quotidien de vos équipes ou de vos clients.",
    features: ["Conception", "Développement", "Mise en ligne"],
    cta: { label: "Explorer l’offre application", href: "#contact", arrow: "diagonal" },
    image: {
      src: "/images/offers/planilio.png",
      alt: "Tableau de bord de réservations d’une application SaaS, avec sa version mobile",
      width: 1536,
      height: 1024,
      frame: { x: 68, y: 68, width: 1412, height: 889 },
    },
    plate: { mask: "/images/offers/planilio-mask.png", shift: "left" },
    figureSide: "left",
    notes: [
      {
        text: "Une idée aujourd’hui. Des utilisateurs demain.",
        placement: "bottomCenter",
        // Short hop from the note's left edge to the phone's bottom-right corner.
        arrow: { d: "M104 35 C 70 49, 26 32, 5 5", viewBox: "0 0 110 48" },
      },
      {
        text: "Des outils pour de vrais usages.",
        placement: "bottomRight",
        // Long shallow curve back to the dashboard's bottom-right corner.
        arrow: { d: "M154 50 C 100 62, 42 42, 5 8", viewBox: "0 0 160 60" },
      },
    ],
  },
]
