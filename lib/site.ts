export const SITE = {
  name: "Le bon dev",
  url: new URL(process.env.SITE_URL ?? "https://lebondev.fr").origin,
  title: "Le bon dev — Studio de développement web et mobile",
  description: "Sites vitrines, applications et outils métier : un développeur senior à vos côtés, de la conception à la mise en ligne.",
  locale: "fr_FR",
} as const
