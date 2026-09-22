import { BrandLogo } from "@/components/atoms/BrandLogo"
import { CONTACT } from "@/lib/contact"
import styles from "./SiteFooter.module.css"

const FOOTER_GROUPS = [
  {
    label: "Les offres",
    links: [
      { label: "Sites internet", href: "#sites-vitrines" },
      { label: "Applications", href: "#saas-mobile" },
      { label: "Les réalisations", href: "#realisations" },
    ],
  },
  {
    label: "Le studio",
    links: [
      { label: "Nos garanties", href: "#garanties-timeline" },
      { label: "La méthode", href: "#la-methode" },
      { label: "Qui sommes-nous ?", href: "#le-studio" },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-header-theme="light">
      <div className={styles.surface}>
        <div className={styles.topline}>
          <div className={styles.introduction}>
            <p className={styles.tagline}>Votre vision.<br />Notre savoir-faire.</p>
            <p className={styles.description}>Studio de développement<br />web et mobile.</p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav className={styles.navigation} aria-label={`${group.label} — pied de page`} key={group.label}>
              <p className={styles.groupTitle}>{group.label}</p>
              <ul role="list">
                {group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
              </ul>
            </nav>
          ))}

          <div className={styles.invitation}>
            <p className={styles.groupTitle}>Une idée à concrétiser ?</p>
            <a className={styles.email} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a className={styles.contactLink} href="#contact">
              Parlons de votre projet <Arrow />
            </a>
          </div>
        </div>

        <a className={styles.wordmark} href="#statistics" aria-label="Le bon dev — retour à l’accueil">
          <BrandLogo placement="footer" />
        </a>

        <div className={styles.bottomline}>
          <small>© {new Date().getFullYear()} Le bon dev</small>
          <a className={styles.backToTop} href="#statistics">Retour en haut <Arrow up /></a>
        </div>
      </div>
    </footer>
  )
}

function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={up ? "M12 19V5m-6 6 6-6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  )
}
