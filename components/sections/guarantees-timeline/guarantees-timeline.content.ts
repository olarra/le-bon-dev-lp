/** Mobile exploration; disable to restore the white cards and their blobs. */
export const MOBILE_METAL_CARDS_ENABLED = true

/** Entrance timing in seconds; independent of the scroll-driven morph. */
export const GUARANTEE_ENTRANCE = {
  badgeDelay: 0.08,
  titleDelay: 0.1,
  titleDuration: 0.8,
  titleStagger: 0.1,
  titleDistance: 48,
  ease: "0.25, 0.4, 0.25, 1",
  introDelay: 0.08,
  copyDelay: 0.12,
  copyStagger: 0.1,
  startViewport: 0.72,
  mobileStartViewport: 0.76,
  /** Hold the first composition until the Hero snap is near its landing. */
  snapStart: 0.12,
  duration: 0.8,
  fadeDuration: 0.55,
  artDelay: 0.25,
  artFadeDelay: 0.35,
  artFadeDuration: 0.45,
  artSpring: { stiffness: 110, damping: 18, mass: 0.9 },
  artScale: 0.82,
  artRotation: -6,
  artDistance: 70,
  artFloatDistance: 14,
  artFloatRotation: 1.5,
  artFloatDuration: 5.5,
  copyDistance: 32,
  textRise: 12,
  mobileDistance: 24,
} as const

export const GUARANTEE_STEPS = [
  {
    kind: "budget",
    phase: "Avant de commencer",
    title: "Un budget respecté",
    description: "Chaque fonctionnalité est chiffrée avant de commencer. Le montant ne bouge pas sans votre accord.",
    image: "budget-envelope.webp",
  },
  {
    kind: "followup",
    phase: "Pendant le projet",
    title: "Un suivi régulier",
    description: "Les jalons sont fixés ensemble au cadrage. Chacun se termine par une version à tester et un compte rendu.",
    image: "followup-calendar.webp",
  },
  {
    kind: "handover",
    phase: "À la livraison",
    title: "Les clés en main",
    description: "Code, accès et documentation, remis à la livraison.",
    image: "handover-keys.webp",
  },
] as const

export type GuaranteeStep = (typeof GUARANTEE_STEPS)[number]
