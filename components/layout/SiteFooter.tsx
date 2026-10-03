import { CONTACT } from "@/lib/contact"
import { FooterWordmark } from "./FooterWordmark"
import { FOOTER_GROUPS } from "./footer.content"
import styles from "./SiteFooter.module.css"

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-header-theme="light">
      <div className={styles.surface}>
        <div className={styles.topline} data-reveal-group>
          <div className={styles.introduction} data-reveal>
            <p className={styles.tagline}>Votre vision.<br />Notre savoir-faire.</p>
            <p className={styles.description}>Studio de développement<br />web et mobile.</p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav className={styles.navigation} aria-label={`${group.label} — pied de page`} key={group.label} data-reveal>
              <p className={styles.groupTitle}>{group.label}</p>
              <ul role="list">
                {group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
              </ul>
            </nav>
          ))}

          <div className={styles.invitation} data-reveal>
            <p className={styles.groupTitle}>Une idée à concrétiser ?</p>
            <a className={styles.email} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a className={styles.contactLink} href="#contact">
              Parlons de votre projet <Arrow />
            </a>
          </div>
        </div>

        <FooterWordmark />

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
