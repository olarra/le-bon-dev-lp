export const METHOD_EYEBROW = "La méthode"
export const METHOD_TITLE = "Vous savez toujours où en est votre projet."

export const METHOD_STEPS = [
  {
    id: "cadrage",
    number: "01",
    title: "Cadrage",
    description: "Un échange, puis un document court : périmètre, jalons, estimation.",
    icon: "brief",
  },
  {
    id: "jalons",
    number: "02",
    title: "Livraisons par jalons",
    description: "À chaque jalon, une version à tester et un compte rendu. Les ajustements se décident au fil de l’eau.",
    icon: "milestones",
  },
  {
    id: "mise-en-ligne",
    number: "03",
    title: "Mise en ligne",
    description: "Déploiement, accès, prise en main. Vous êtes autonome sur ce qui doit l’être.",
    icon: "launch",
  },
  {
    id: "suivi",
    number: "04",
    title: "Et après",
    description: "Corrections, évolutions, suivi : ponctuel ou continu, selon votre besoin.",
    icon: "follow-up",
  },
] as const

export type MethodIconName = (typeof METHOD_STEPS)[number]["icon"]
