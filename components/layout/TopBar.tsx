import { CONTACT } from "@/lib/contact"
import type { Dictionary } from "@/lib/i18n/types"
import styles from "./TopBar.module.css"

function MailIcon() {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.7Z" />
      <path d="m8.1 7.6 1.3-.2 1.1 2.5-1 1.1a7.4 7.4 0 0 0 3.5 3.5l1.1-1 2.5 1.1-.2 1.3c-.2.8-1 1.2-1.8 1-3.9-.9-7-4-7.9-7.9-.2-.8.2-1.6 1-1.8Z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function TopBar({ copy }: { copy: Dictionary["topbar"] }) {
  return (
    <div id="hero-topbar" className={styles.bar}>
      <div className={styles.surface} data-topbar-surface>
        <div className={styles.inner}>
          <span className={styles.availability}>{copy.availability}</span>
          <div className={styles.group}>
            <a className={styles.link} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp : ${CONTACT.whatsapp}`}>
              <WhatsAppIcon />
              <span><span className={styles.whatsappLabel}>WhatsApp </span>{CONTACT.whatsapp}</span>
            </a>
            <a className={styles.link} href={`mailto:${CONTACT.email}`}>
              <MailIcon />
              <span>{CONTACT.email}</span>
            </a>
            <span className={styles.response}><ClockIcon />{copy.response}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
