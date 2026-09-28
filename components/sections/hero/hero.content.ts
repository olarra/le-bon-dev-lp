export const EYEBROW = "Studio de développement web et mobile"

export const SECTION_TITLE_LINES = ["Votre vision.", "Notre savoir-faire."] as const

export const SUBTITLE_INTRO =
  "Une idée à concrétiser ou un produit à reprendre : on vous accompagne de la conception à la mise en ligne."

export const CTA_LABEL = "Estimer mon projet"
export const CTA_HINT = "Présentez votre projet en 3 minutes."
export const CTA_HREF = "#contact"

export const HIGHLIGHT_BEFORE = "Un "
export const HIGHLIGHT_WORD = "développeur"
export const HIGHLIGHT_AFTER = " comme interlocuteur, à vos côtés à chaque étape."

export const TICKER_PATH = {
  svgPath:
    "M0.75 425.233C0.75 425.233 844.936 14.7884 1394.41 1.68034C1990.72 -12.5451 2312.75 433.534 2909.08 425.233C3477.15 417.325 4350.75 1.68034 4350.75 1.68034",
  viewBox: "0 0 4351 426",
}

export const TICKER_SPEED_PERCENT_PER_SECOND = 5
export const TICKER_DIRECTION = "normal" as const

export const TICKER_CONFIG = {
  desktop: { repeat: 2, scale: 1 },
  tablet: { repeat: 1, scale: 1 },
  phone: { repeat: 1, scale: 0.6 },
} as const

export const WAVE_CARD_WIDTH = 158
export const WAVE_CARD_GAP = 24

export const WAVE_PALETTE = [
  { name: "Forest / lime", background: "#132A22", foreground: "#C8F53E" },
  { name: "Lime / forest", background: "#C8F53E", foreground: "#18362A" },
  { name: "Ink / mint", background: "#202923", foreground: "#A5E4B9" },
  { name: "Sage / pine", background: "#DCE5CF", foreground: "#234D3A" },
  { name: "Pine / cream", background: "#1F4433", foreground: "#F5F6DF" },
] as const

export type BrandLogo = {
  brandName: "Thales" | "OpenClassrooms" | "Orange" | "CrossFit" | "Libération" | "Accenture"
  background: string
  foreground: string
  image: string
  width: number
  height: number
}
const BRAND_LOGOS: Omit<BrandLogo, "background" | "foreground">[] = [
  {
    brandName: "Thales",
    image: "/logos/clients/thales.svg",
    width: 126,
    height: 48,
  },
  {
    brandName: "OpenClassrooms",
    image: "/logos/clients/openclassrooms.svg",
    width: 134,
    height: 48,
  },
  {
    brandName: "Orange",
    image: "/logos/clients/orange.svg",
    width: 120,
    height: 48,
  },
  {
    brandName: "CrossFit",
    image: "/logos/clients/crossfit.svg",
    width: 120,
    height: 48,
  },
  {
    brandName: "Libération",
    image: "/logos/clients/liberation.svg",
    width: 124,
    height: 48,
  },
  {
    brandName: "Accenture",
    image: "/logos/clients/accenture.svg",
    width: 118,
    height: 48,
  },
]

export function getBrandLogos(): BrandLogo[] {
  return BRAND_LOGOS.map((logo, index) => {
    const { background, foreground } = WAVE_PALETTE[index % WAVE_PALETTE.length]
    return { ...logo, background, foreground }
  })
}
