export type ShowcaseProject = {
  id: string
  number: string
  client: string
  title: string
  description: string
  image: string
  href: string | null
  details: readonly { label: string; value: string }[]
}

// Original Project Slider artwork from Framer project 55736c5f645fdf8b.
// These are decorative placeholders, not screenshots of delivered projects.
// 01: F1ceXDYLhKYcg9ROAsw3PtZSnQ.png
// 02: S8Ya3bZm5hKzKHZ1WWwtc09Gu0.png
// 03: E5IqsYnTd6volBburXjEsGHak4.png
export const PROJECTS: readonly ShowcaseProject[] = ["01", "02", "03"].map((number) => ({
  id: `projet-${number}`,
  number,
  client: "Client",
  title: "Nom du produit · Client",
  description: "Le contexte du projet, ses utilisateurs et la solution livrée seront présentés ici.",
  image: `/images/projects/project-placeholder-${number}.png`,
  href: null,
  details: [
    { label: "Contexte", value: "À renseigner." },
    { label: "Rôle", value: "À renseigner." },
    { label: "Résultat", value: "À renseigner." },
  ],
}))
