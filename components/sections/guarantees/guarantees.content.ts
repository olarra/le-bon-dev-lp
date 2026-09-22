export const GUARANTEES_EYEBROW = "Nos garanties"
export const GUARANTEES_SUBTITLE = "Trois principes, valables pour chaque projet."

export const GUARANTEES = [
  {
    id: "budget",
    title: "Un budget respecté",
    description: "Chaque fonctionnalité est chiffrée avant de commencer. Le montant ne bouge pas sans votre accord.",
    image: {
      src: "/images/guarantees/budget.png",
      width: 1254,
      height: 1254,
      // A 5:4 window around the visible object, including its soft edges.
      frame: { x: 30, y: 140, width: 1220, height: 976 },
    },
  },
  {
    id: "follow-up",
    title: "Un suivi régulier",
    description: "Les jalons sont fixés ensemble au cadrage. Chacun se termine par une version à tester et un compte rendu.",
    image: {
      src: "/images/guarantees/follow-up.png",
      width: 1254,
      height: 1254,
      frame: { x: 42, y: 128, width: 1215, height: 972 },
    },
  },
  {
    id: "handover",
    title: "Les clés en main",
    description: "Code, accès et documentation, remis à la livraison.",
    image: {
      src: "/images/guarantees/handover.png",
      width: 1457,
      height: 1079,
      frame: { x: 134, y: 64, width: 1190, height: 952 },
    },
  },
] as const
