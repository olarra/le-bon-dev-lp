export type Offer = {
  id: string
  kind: "website" | "applications"
  title: string
  detail?: string
  promise: string
  audience: string
  features: readonly string[]
  aftercare: {
    title: string
    description: string
  }
  price?: {
    amount: string
    detail: string
  }
  cta: string
  href: string
}

// Wireframe copy within the existing nested sage/ivory composition.
export const OFFERS = [
  {
    id: "sites-vitrines",
    kind: "website",
    title: "Sites internet",
    promise: "Un site qui explique ce que vous faites et vous apporte des demandes.",
    audience: "vous n’avez pas encore de site, si le vôtre ne vous ressemble plus, ou s’il n’apporte pas de demandes.",
    features: [
      "Design sur mesure, adapté au mobile",
      "Chaque page construite autour de votre message",
      "Prise de rendez-vous, demande de devis et paiement en ligne, reliés à vos outils",
      "Référencement local et fiche Google",
      "Statistiques des visites et des demandes reçues",
      "Domaine, hébergement, mise en ligne et prise en main",
    ],
    aftercare: {
      title: "Après la mise en ligne",
      description: "Un mois de corrections compris, puis évolutions sur devis ou en accompagnement continu.",
    },
    price: {
      amount: "2 500 € HT",
      detail: "site vitrine de cinq pages, contenus fournis",
    },
    cta: "Estimer mon site",
    href: "/fr/estimation?type=site",
  },
  {
    id: "saas-mobile",
    kind: "applications",
    title: "Applications",
    detail: "Web ou mobile",
    promise: "Une application qui fait exactement ce que votre activité demande.",
    audience: "vous lancez un service en ligne, si vous voulez outiller votre équipe, ou si une application existante doit être terminée ou reprise.",
    features: [
      "Parcours et fonctionnalités adaptés à votre métier, définis au cadrage",
      "Création de compte, connexion sécurisée, droits selon le rôle",
      "Paiement, réservations, notifications… reliés à vos outils",
      "Espace d'administration, selon le projet",
      "Développement, tests et déploiement",
      "Votre application publiée sur l'App Store et Google Play",
      "Documentation et sources remises",
    ],
    aftercare: {
      title: "Après la mise en production",
      description: "Bugs corrigés pendant la garantie fixée au devis. Ensuite, en option, un forfait mensuel de maintenance : compatibilité iOS et Android, stores, évolutions.",
    },
    cta: "Estimer mon application",
    href: "/fr/estimation?type=webapp",
  },
] as const satisfies readonly Offer[]
