/* Colour tokens used by this section (declared in framer/styles.css). */
export const TOKENS = {
  textBlack: "var(--token-9e4d3cd9-c6a1-4d3f-93c0-3bd54ca04155, rgb(59, 0, 27))",
  green: "var(--token-c09280c8-046a-423a-99d4-d54396bd9425, rgb(192, 236, 191))",
  pink: "var(--token-744e9533-cc1c-4b12-9894-6b83005cea3c, rgb(246, 194, 244))",
  lavender: "var(--token-125d323f-663c-405e-a650-07dee2aa7f19, rgb(199, 202, 255))",
  yellow: "var(--token-911b8705-d912-461c-9a39-7f15ac525b76, rgb(255, 232, 120))",
  yellowPale: "var(--token-9f0badbf-8d74-41b8-a73a-e1a6bdec487b, rgb(250, 250, 191))",
  cream: "var(--token-cf6aa4f8-c467-4d6d-9247-5e1d25c5ce69, rgb(250, 224, 190))",
  offWhite: "var(--token-b0bb3938-008d-419c-b18a-42b0ef391a52, rgb(254, 250, 231))",
  coral: "rgb(255, 112, 129)",
}

/**
 * Eyebrow/kicker shown above the headline. Plain text, no pill/background —
 * letter-spacing and uppercase are applied in CSS (.eyebrow) rather than
 * baked into the string, so the transform can change without touching copy.
 */
export const EYEBROW = "Studio de développement web et mobile"

/**
 * Content requested directly (not from the original published Agenius
 * page): a studio pitch rather than the earlier placeholder "rocket" copy.
 * Two lines given as their own natural phrases, not a wrap the page has to
 * reproduce — the per-character markup still applies (see
 * SECTION_TITLE_EFFECT below) so each line's own effect fires independently.
 */
export const SECTION_TITLE_LINES = ["Votre vision.", "Notre savoir-faire."] as const

/** Intro paragraph, directly under the headline. */
export const SUBTITLE_INTRO =
  "Une idée à concrétiser ou un produit à reprendre : on vous accompagne de la conception à la mise en ligne."

export const CTA_LABEL = "Parlons de votre projet"
export const CTA_HREF = "#"

/**
 * Closing statement, set apart from the intro paragraph by the CTA button
 * above it and its own bracket decoration (see .highlight in
 * hero.module.css). One sentence, single line on desktop (see .highlightText
 * max-width in hero.module.css — wide enough that it doesn't wrap there).
 * Split around "développeur" so it can get its own marker-highlight span
 * (see .highlightMark).
 */
export const HIGHLIGHT_BEFORE = "Un "
export const HIGHLIGHT_WORD = "développeur"
export const HIGHLIGHT_AFTER = " comme interlocuteur, à vos côtés à chaque étape."

/**
 * Same per-character pop-in effect ("zh" in the source) used on the page's
 * other animated headings. Reproducing it here isn't just cosmetic: the
 * source wraps every character in its own inline-block span for this
 * effect, which subtly changes the text's line-wrapping metrics — using a
 * plain <h2> (no spans) wrapped one word later than the source at some
 * widths.
 */
export const SECTION_TITLE_EFFECT = {
  type: "appear" as const,
  trigger: "onInView" as const,
  tokenization: "character" as const,
  repeat: false,
  startDelay: 0,
  threshold: 0,
  effect: { opacity: 1, rotate: 0, rotateX: 0, rotateY: 10, scale: 0, skewX: 0, skewY: 0, x: 0, y: 0 },
  transition: { type: "spring" as const, bounce: 0.6, delay: 0.03, duration: 1.5 },
}

/**
 * Exact wave curve the published page uses for its Ticker component
 * (path="custom", preset="wave"), reverse-engineered from the page's own
 * bundle. Fed to the Ticker atom, which reproduces the source's real
 * offset-path-based positioning rather than approximating it.
 */
export const TICKER_PATH = {
  svgPath:
    "M0.75 425.233C0.75 425.233 844.936 14.7884 1394.41 1.68034C1990.72 -12.5451 2312.75 433.534 2909.08 425.233C3477.15 417.325 4350.75 1.68034 4350.75 1.68034",
  viewBox: "0 0 4351 426",
}

/** speed: 5 (%/s → one full loop every 20s), direction: normal — from the source, same at every breakpoint. */
export const TICKER_SPEED_PERCENT_PER_SECOND = 5
export const TICKER_DIRECTION = "normal" as const

/**
 * The source drops `repeat` from 2 to 1 at both the tablet and phone
 * breakpoints, and additionally scales items to .6x on phone
 * (from the page's breakpoint overrides: `{ePjBTtXEX:{repeat:1}, n9gLl4Eao:
 * {repeat:1, scale:{scale:.6}}}`). Note this alone does not stop the cards
 * from overlapping: with every item distributed evenly around the curve,
 * spacing depends on the curve's pixel length (i.e. the viewport width),
 * and it only clears a 158px card above ~1900px - see WAVE_CARD_WIDTH /
 * WAVE_CARD_GAP below for the spacing floor that fixes that.
 */
export const TICKER_CONFIG = {
  desktop: { repeat: 2, scale: 1 },
  tablet: { repeat: 1, scale: 1 },
  phone: { repeat: 1, scale: 0.6 },
} as const

/**
 * Footprint of one WaveBrandCard along the curve (its CSS width, see
 * WaveBrandCard.module.css `.card`) and the minimum gap to keep between
 * cards, both in px at scale 1 - the Ticker scales them with each
 * breakpoint's `scale`. Without this floor the evenly distributed cards
 * overlapped wherever the curve was shorter than the cards laid end to end
 * (by ~32px at 1440px wide, ~27px on a 390px phone); with it the surplus
 * cards queue off the end of the path and cycle in, so the card/gap
 * proportion is the same at every width and only the number of cards on
 * screen at once changes.
 */
export const WAVE_CARD_WIDTH = 158
export const WAVE_CARD_GAP = 24

/**
 * Wave card colours, in display order. Edit these pairs to recolour both
 * the cards and their SVG marks; the same palette repeats around the wave.
 * Forest and ink anchor the brand, with lime/mint accents and a sage pause.
 */
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

// Match the supplied logos to the existing card colours: Thales on forest,
// OpenClassrooms on lime, Orange on ink, CrossFit on sage, Libération on pine.
// The sixth card reuses forest; its Accenture mark uses the matching light ink.
// Width/height define a contained logo box; the original SVG aspect ratio stays intact.
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
