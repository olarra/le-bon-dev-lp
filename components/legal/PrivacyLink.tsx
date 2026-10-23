import type { Locale } from "@/lib/i18n/config"
import { LEGAL_LABELS, legalHref } from "@/lib/legal/navigation"
import styles from "./privacy-link.module.css"

/** Keep an in-progress form open while the visitor reads about their data. */
export function PrivacyLink({ locale }: { locale: Locale }) {
  const labels = LEGAL_LABELS[locale]
  return (
    <a className={styles.link} href={legalHref(locale, "privacy")} target="_blank" rel="noopener noreferrer"
      aria-label={`${labels.privacy} (${labels.newTab})`}>
      {labels.privacy}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </a>
  )
}
