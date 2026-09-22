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
