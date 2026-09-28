export const STUDIO_EYEBROW = "Le studio"
export const STUDIO_TITLE = "Le fond, la forme. La même attention."

export const STUDIO_PARAGRAPHS = [
  {
    text: "Un périmètre flou. Un suivi trop discret. Un design déconnecté de l’usage.",
    emphasis: undefined,
  },
  {
    text: "Le bon dev est né de ce constat : un projet mérite autant de soin dans sa conception que dans sa réalisation.",
    emphasis: "Le bon dev",
  },
  {
    text: "Votre projet est porté par un développeur senior, pleinement investi du premier échange à la mise en ligne. Selon les besoins, des designers et des développeurs spécialisés viennent apporter leur expertise, avec la même attention aux détails et à la qualité du produit.",
    emphasis: undefined,
  },
] as const

export const STUDIO_CTA = { label: "Parlons de votre projet", href: "#contact" } as const

// Figures explicitly supplied for this version of the section.
export const STUDIO_FACTS = [
  { value: "10", label: "ans de développement" },
  { value: "+10", label: "projets livrés" },
  { value: "24 h", label: "pour vous répondre" },
] as const

export const STUDIO_PRINCIPLES = [
  { lines: ["Comprendre avant", "de construire."], sticker: "comprendre-loupe" },
  { lines: ["Du code qui", "tient la route."], sticker: "code-bouclier" },
  { lines: ["Du beau qui", "sert l’usage."], sticker: "usage-curseur" },
] as const

export const STUDIO_IMAGES = [
  { state: "day", file: "studio-01-jour" },
  { state: "sunset", file: "studio-02-coucher-soleil" },
  { state: "night", file: "studio-03-nuit" },
] as const

export const STUDIO_PHOTO_MOTION = {
  duration: 6000,
  fadeEase: "cubic-bezier(.42,0,.58,1)",
  revealDuration: 1200,
  revealEase: "cubic-bezier(.075,.82,.165,1)",
  revealThreshold: 0.6,
  cycleThreshold: 0.75,
  pauseThreshold: 0.25,
  resetDuration: 550,
  preloadMargin: "600px 0px",
  // The leading edge stays diagonal during the wipe, then opens completely.
  hiddenClip: "polygon(125% 0, 100% 0, 100% 100%, 100% 100%)",
  visibleClip: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)",
} as const
