/** Project copy and public destinations. */
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
    description: "Une application pour trouver une garde pour son chat et échanger avec la personne qui s’en occupe.",
    context: "Garde de chats",
    offer: "App",
    icon: "applications",
    cta: "Découvrir le projet",
    href: "https://miau-app.com/",
  },
  studio: {
    name: "French Pixel Studio",
    hook: ["Les créations", "au premier plan."],
    description: "Un site pour découvrir les illustrations du studio et accéder à sa boutique en ligne.",
    context: "Studio d’illustration numérique",
    offer: "Site web",
    icon: "website",
    cta: "Découvrir le site",
    href: "https://www.frenchpixelstudio.fr/",
  },
}

export const PROJECT_IMAGES = {
  map: "/images/realisations/miau-map-silver.png",
  auth: "/images/realisations/miau-auth-emerald.png",
  orion: "/images/realisations/miau-orion-sage.png",
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

/** Scroll starts each reveal; time, never scroll distance, completes it. */
export const SHOWCASE_MOTION = {
  trigger: 0.88,
  copyTrigger: 0.88,
} as const

/** Independent viewport triggers; desktop ends at 2850 ms, mobile at 800 ms. */
export const FPS_REVEAL = {
  cardTrigger: 0.92,
  monitorVisibility: 0.3,
  mobileMonitorVisibility: 0.15,
  mobileMonitorTrigger: 0.92,
  mobileReveal: { delay: 0, duration: 800, easing: "cubic-bezier(.16,1,.3,1)" },
  card: { delay: 0, duration: 900, easing: "cubic-bezier(.16,1,.3,1)" },
  appear: { delay: 140, duration: 360, easing: "ease-out" },
  reveal: { delay: 140, duration: 2080, easing: "cubic-bezier(.2,.75,.15,1)" },
  reflection: { delay: 950, duration: 1180, easing: "cubic-bezier(.25,.1,.25,1)" },
  breath: { delay: 1270, duration: 1580, easing: "cubic-bezier(.37,0,.63,1)" },
} as const

/** Milliseconds; all Miau animations share one document-timeline start time. */
export const MIAU_REVEAL = {
  visibility: 0.33,
  startScale: 1.32,
  appear: { duration: 400, easing: "ease-out" },
  center: { delay: 150, duration: 2300, easing: "cubic-bezier(.2,.75,.15,1)" },
  sides: { delays: [430, 550], duration: 1900, easing: "cubic-bezier(.2,.75,.15,1)" },
  reflection: {
    centerDelay: 500, centerDuration: 1400,
    sideDelay: 300, sideDuration: 1300,
    easing: "cubic-bezier(.25,.1,.25,1)",
  },
} as const
