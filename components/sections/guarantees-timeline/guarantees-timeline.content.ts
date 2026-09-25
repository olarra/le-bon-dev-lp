/** Entrance timing in seconds; independent of the scroll-driven morph. */
export const GUARANTEE_ENTRANCE = {
  badgeDelay: 0.08,
  titleDelay: 0.2,
  titleDuration: 0.9,
  titleStagger: 0.018,
  introDelay: 0.32,
  artDelay: 0,
  copyDelay: 0.1,
  copyStagger: 0.08,
  start: "top 92%",
  duration: 0.55,
  artScale: 0.76,
  artFadeDuration: 0.18,
  artDistance: 20,
  copyDistance: 24,
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
