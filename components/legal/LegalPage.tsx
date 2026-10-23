import type { ReactNode } from "react"
import { BrandLogo } from "@/components/atoms/BrandLogo"
import { CONTACT } from "@/lib/contact"
import { LANGUAGE_NAMES, LOCALES, type Locale } from "@/lib/i18n/config"
import { LEGAL_LABELS, legalHref, type LegalDocument } from "@/lib/legal/navigation"
import styles from "./legal.module.css"

type Props = {
  locale: Locale
  document: LegalDocument
  introduction: string
  updatedAt?: string
  draftNotice?: string
  children: ReactNode
}

/** Quiet, server-rendered reading layout shared by both legal documents. */
export function LegalPage({ locale, document, introduction, updatedAt, draftNotice, children }: Props) {
  const labels = LEGAL_LABELS[locale]
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#legal-content">{labels.skip}</a>
      <header className={styles.header}>
        <a className={styles.brand} href={`/${locale}`} aria-label={`Le bon dev — ${labels.home}`}>
          <BrandLogo placement="header" />
        </a>
        <div className={styles.headerActions}>
          <a className={styles.back} href={`/${locale}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            {labels.home}
          </a>
          <nav className={styles.languages} aria-label={labels.language}>
            {LOCALES.map(language => (
              <a key={language} href={legalHref(language, document)} hrefLang={language} lang={language}
                aria-label={LANGUAGE_NAMES[language]} aria-current={language === locale ? "page" : undefined}>
                {language.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main} id="legal-content" tabIndex={-1}>
        <nav className={styles.documents} aria-label={labels.navigation}>
          {(["notice", "privacy"] as const).map(item => (
            <a key={item} href={legalHref(locale, item)} aria-current={item === document ? "page" : undefined}>
              {labels[item]}
            </a>
          ))}
        </nav>
        <article>
          <header className={styles.introduction}>
            <h1>{labels[document]}</h1>
            <p>{introduction}</p>
            {updatedAt && <small>{labels.updated} <time dateTime={updatedAt}>{new Intl.DateTimeFormat(locale, {
              day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris",
            }).format(new Date(`${updatedAt}T12:00:00Z`))}</time></small>}
          </header>
          {draftNotice && <p className={styles.draftNotice} role="note">{draftNotice}</p>}
          <div className={styles.content}>{children}</div>
        </article>
      </main>

      <footer className={styles.footer}>
        <small>© {new Date().getFullYear()} Le bon dev</small>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </footer>
    </div>
  )
}
