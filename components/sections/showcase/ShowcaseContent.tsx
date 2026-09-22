import { ProjectCarousel } from "./ProjectCarousel"
import styles from "./showcase.module.css"

// Copy from the supplied wireframe; layout adapted from the Tabs / Price Button
// components exported from Framer project 55736c5f645fdf8b (Conicorn).
const OFFERS = [
  {
    id: "sites-vitrines",
    title: "Sites internet",
    description: "Pour présenter votre activité et recevoir des demandes.",
    features: [
      "Design sur mesure, adapté au mobile",
      "Pages et contenus définis avec vous",
      "Prise de rendez-vous, galerie, devis, formulaire de contact",
      "Référencement local et fiche Google",
    ],
    cta: "Voir l’offre sites internet",
  },
  {
    id: "saas-mobile",
    title: "Applications",
    detail: "Web ou mobile",
    description: "Pour un outil métier, un service en ligne ou une application mobile.",
    features: [
      "Fonctionnalités définies selon votre métier",
      "Application web, ou application iOS et Android",
      "Livrée par étapes, testée avec vous",
      "Reprise d’un code existant",
    ],
    cta: "Voir l’offre applications",
  },
] as const

/** Server-rendered content stays fixed in size while the background opens. */
export function ShowcaseContent() {
  return (
    <>
      <section id="offres" aria-labelledby="offres-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Les offres</p>
          <h2 className={styles.title} id="offres-title">Votre projet prend forme.</h2>
        </header>

        <div className={styles.offers}>
          {OFFERS.map((offer) => (
            <article className={styles.offerCard} id={offer.id} key={offer.id} data-offer={offer.id}>
              <div className={styles.offerIntro}>
                <div className={styles.offerTopline}>
                  <span className={styles.offerIcon} aria-hidden="true" />
                  {"detail" in offer && <span className={styles.offerBadge}>{offer.detail}</span>}
                </div>
                <div className={styles.offerHeading}>
                  <h3 className={styles.cardTitle}>{offer.title}</h3>
                  <p className={styles.description}>{offer.description}</p>
                </div>
              </div>
              <div className={styles.offerFeatures}>
                <p className={styles.featuresTitle}>Ce qui est inclus</p>
                <ul className={styles.features}>
                  {offer.features.map((feature) => (
                    <li key={feature}>
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a className={styles.offerLink} href="#contact">
                <span className={styles.offerLinkInner}>
                  <span>{offer.cta}</span>
                  <Arrow />
                </span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.projectsSection} id="realisations" aria-labelledby="realisations-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Les réalisations</p>
          <h2 className={styles.title} id="realisations-title">Des idées devenues concrètes.</h2>
        </header>

        <ProjectCarousel />
      </section>
    </>
  )
}

function Check() {
  return (
    <svg className={styles.featureCheck} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  )
}
