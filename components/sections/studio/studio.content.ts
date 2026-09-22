export const STUDIO_EYEBROW = "Le studio"

export const STUDIO_PARAGRAPHS = [
  "Le bon dev est un studio de développement à taille humaine, mené par un développeur senior qui suit votre projet de bout en bout : cadrage, design, code, mise en ligne et suivi.",
  "Quand le projet le demande, d’autres profils — développeur ou designer — rejoignent l’équipe, sans que votre interlocuteur change.",
] as const

// Keep the wireframe's placeholders until the real figures are supplied.
export const STUDIO_FACTS = [
  { value: "[X]", label: "ans de développement", pending: true },
  { value: "[N]", label: "projets livrés", pending: true },
  { value: "24 h", label: "pour vous répondre", pending: false },
] as const

export const STUDIO_PRINCIPLES = [
  {
    id: "code",
    title: "Un code qui dure",
    description: "Écrit pour être repris, testé et documenté. Dans un an, vous pouvez le faire évoluer, avec nous ou sans nous.",
    icon: "code",
  },
  {
    id: "design",
    title: "Du design au code, une seule équipe",
    description: "Parcours, écrans et identité sont conçus avant la première ligne de code, pas ajoutés à la fin.",
    icon: "design",
  },
  {
    id: "automatisation",
    title: "Ce qui se répète s’automatise",
    description: "Relances, exports, synchronisation avec vos outils : on repère les tâches répétitives et on les fait disparaître.",
    icon: "automation",
  },
  {
    id: "suivi",
    title: "Un suivi qui continue",
    description: "Mises à jour, corrections, évolutions : ponctuellement ou en accompagnement continu, au rythme de votre activité.",
    icon: "follow-up",
  },
  {
    id: "choix",
    title: "Des choix expliqués",
    description: "Chaque décision technique est justifiée en langage clair, avec son coût et ses conséquences.",
    icon: "clarity",
  },
  {
    id: "interlocuteur",
    title: "Un seul interlocuteur",
    description: "La personne qui vous répond est celle qui développe. Pas d’intermédiaire entre vous et votre projet.",
    icon: "person",
  },
] as const

export type StudioIconName = (typeof STUDIO_PRINCIPLES)[number]["icon"]
