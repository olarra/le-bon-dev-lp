import { CONTACT } from "@/lib/contact"
import { ContactForm } from "./ContactForm"
import styles from "./contact-form.module.css"

export function ContactFormSection() {
  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-title" data-header-theme="light">
      <div className={styles.inner}>
        <div className={styles.introduction}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Le contact</p>
            <h2 className={styles.title} id="contact-title">On en <span>parle ?</span></h2>
          </header>
          <p className={styles.description}>Un site à lancer, une application à créer ou un produit à faire évoluer ? Racontez-nous ce que vous avez en tête.</p>

          <ul className={styles.contactDetails} role="list" aria-label="Les coordonnées du studio">
            <li>
              <a className={styles.contactMethod} href={`mailto:${CONTACT.email}`}>
                <span className={styles.methodIcon} data-tone="lime"><ContactIcon name="mail" /></span>
                <span><span className={styles.methodTitle}>Par e-mail</span><span className={styles.methodValue}>{CONTACT.email}</span></span>
              </a>
            </li>
            <li>
              <a className={styles.contactMethod} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                <span className={styles.methodIcon} data-tone="forest"><ContactIcon name="chat" /></span>
                <span><span className={styles.methodTitle}>Sur WhatsApp</span><span className={styles.methodValue}>+33 6 95 06 41 32</span></span>
              </a>
            </li>
            <li className={styles.contactMethod}>
              <span className={styles.methodIcon} data-tone="sage"><ContactIcon name="clock" /></span>
              <span><span className={styles.methodTitle}>Une réponse sous 24h</span><span className={styles.methodValue}>Un échange avec le développeur.</span></span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

function ContactIcon({ name }: { name: "mail" | "chat" | "clock" }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "mail" && <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>}
      {name === "chat" && <><path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8 9h8M8 13h5" /></>}
      {name === "clock" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
    </svg>
  )
}
