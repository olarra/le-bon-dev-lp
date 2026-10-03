/** Entrance timing in seconds; independent of the scroll-driven morph. */
export const GUARANTEE_ENTRANCE = {
  badgeDelay: 0.08,
  titleDelay: 0.2,
  titleDuration: 0.9,
  titleStagger: 0.018,
  introDelay: 0.08,
  copyDelay: 0.12,
  copyStagger: 0.1,
  startViewport: 0.72,
  mobileStartViewport: 0.76,
  /** Hold the first composition until the Hero snap is near its landing. */
  snapStart: 0.12,
  duration: 1,
  fadeDuration: 0.65,
  artDuration: 1.15,
  artScale: 0.97,
  artDistance: 28,
  copyDistance: 24,
  mobileDistance: 18,
} as const

export const GUARANTEE_STEPS = [
  {
    kind: "budget",
    phase: "Avant de commencer",
    title: "Un budget respecté",
    description: "Chaque fonctionnalité est chiffrée avant de commencer. Le montant ne bouge pas sans votre accord.",
    image: "budget-envelope.png",
  },
  {
    kind: "followup",
    phase: "Pendant le projet",
    title: "Un suivi régulier",
    description: "Les jalons sont fixés ensemble au cadrage. Chacun se termine par une version à tester et un compte rendu.",
    image: "followup-calendar.png",
  },
  {
    kind: "handover",
    phase: "À la livraison",
    title: "Les clés en main",
    description: "Code, accès et documentation, remis à la livraison.",
    image: "handover-keys.png",
  },
] as const

export type GuaranteeStep = (typeof GUARANTEE_STEPS)[number]
