/** Set the destinations here when the public project URLs are available. */
export type Realisation = {
  name: string
  hook: readonly [string, string]
  description: string
  context: string
  offer: string
  icon: "applications" | "website"
  cta: string
  href: string | null
}

export const REALISATIONS: Record<"miau" | "studio", Realisation> = {
  miau: {
    name: "Miau",
    hook: ["Partir serein.", "Garder le lien."],
    description: "Un service pour trouver une garde adaptée à son chat.",
    context: "Garde de chats",
    offer: "App",
    icon: "applications",
    cta: "Découvrir Miau",
    href: null,
  },
  studio: {
    name: "French Pixel Studio",
    hook: ["Les créations", "au premier plan."],
    description: "Une galerie web pour découvrir les œuvres, sur grand écran comme sur mobile.",
    context: "Galerie d’art numérique",
    offer: "Website",
    icon: "website",
    cta: "Découvrir le site",
    href: "https://www.frenchpixelstudio.fr/",
  },
}

export const PROJECT_IMAGES = {
  map: "/images/realisations/miau-map.webp",
  auth: "/images/realisations/miau-auth.webp",
  orion: "/images/realisations/miau-orion.webp",
} as const

/** Original PNGs extracted byte-for-byte from french-pixel-resin-poc(3).html. */
export const FRENCH_PIXEL_GALLERY = {
  brand: "French Pixel Studio",
  artworks: [
    { src: "/images/realisations/french-pixel/bluebirds.png", alt: "Deux grues parmi des lotus bleus", width: 1444, height: 2048 },
    { src: "/images/realisations/french-pixel/sleeping-cat.png", alt: "Chat endormi sur des tissus illustrés", width: 1450, height: 2048 },
    { src: "/images/realisations/french-pixel/moon-waves.png", alt: "Lune orangée au-dessus de vagues turquoise", width: 1456, height: 2048 },
  ],
} as const

/** Scroll range uses viewport fractions; device travel uses the visual's width. */
export const MIAU_REVEAL = {
  // Wait until most of the zoomed pose is in view. Short viewports still get
  // a usable scroll interval, without adding height or pinning the section.
  range: { startBottom: 1.1, endCenter: 0.56, minimumTravel: 0.18 },
  scrub: 0.45,
  ease: "power1.inOut",
  // Start close to the devices, then pull back as the side screens separate.
  group: { scale: 1.2, y: 0.018 },
  sides: {
    from: { spread: 0.1, scale: 0.94, y: 0.024 },
    to: { spread: 0.322, scale: 0.9, y: 0.058 },
    compactSpread: 0.306,
  },
} as const

export const SHOWCASE_THEME_REVEAL = {
  // Desktop copy and phones enter together; use the phones' stable bounds.
  desktop: { start: "top 100%", end: "top 82%", scrub: 0.7 },
  // Finish before the section enters the mobile viewport. Direct scrubbing
  // prevents a grey catch-up phase after a fast swipe.
  compact: { start: "top 125%", end: "top 100%", scrub: true },
  // A gentler middle slope avoids concentrating the colour change into a flash.
  ease: "sine.inOut",
  // Near this point both white and black text contrast with the neutral surface.
  foregroundSwitch: 0.422,
} as const
