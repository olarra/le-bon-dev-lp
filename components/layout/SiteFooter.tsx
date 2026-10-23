import { CONTACT } from "@/lib/contact"
import { FooterWordmark } from "./FooterWordmark"
import type { Dictionary } from "@/lib/i18n/types"
import type { Locale } from "@/lib/i18n/config"
import { LEGAL_LABELS, legalHref } from "@/lib/legal/navigation"
import styles from "./SiteFooter.module.css"

export function SiteFooter({ copy, locale }: { copy: Dictionary["footer"]; locale: Locale }) {
  const legal = LEGAL_LABELS[locale]
  return (
    <footer className={styles.footer} data-header-theme="light">
      <div className={styles.surface}>
        <div className={styles.topline} data-reveal-group>
          <div className={styles.introduction} data-reveal>
            <p className={styles.tagline}>{copy.tagline[0]}<br />{copy.tagline[1]}</p>
            <p className={styles.description}>{copy.description[0]}<br />{copy.description[1]}</p>
          </div>

          {copy.groups.map((group) => (
            <nav className={styles.navigation} aria-label={`${group.label} — ${copy.navigationSuffix}`} key={group.label} data-reveal>
              <p className={styles.groupTitle}>{group.label}</p>
              <ul role="list">
                {group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
              </ul>
            </nav>
          ))}

          <div className={styles.invitation} data-reveal>
            <p className={styles.groupTitle}>{copy.invitation}</p>
            <a className={styles.email} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a className={styles.contactLink} href="#contact">
              {copy.cta} <Arrow />
            </a>
          </div>
        </div>

        <FooterWordmark label={copy.home} />

        <div className={styles.bottomline}>
          <small>© {new Date().getFullYear()} Le bon dev</small>
          <nav className={styles.legalLinks} aria-label={legal.navigation}>
            <a href={legalHref(locale, "notice")}>{legal.notice}</a>
            <a href={legalHref(locale, "privacy")}>{legal.privacy}</a>
          </nav>
          <a className={styles.backToTop} href="#statistics">{copy.top} <Arrow up /></a>
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
