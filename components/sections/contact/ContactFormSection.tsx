import { CONTACT } from "@/lib/contact"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { ContactForm } from "./ContactForm"
import styles from "./contact-form.module.css"

export function ContactFormSection() {
  return (
    <StickerSurface className={styles.section} id="contact" aria-labelledby="contact-title" data-header-theme="light" data-reveal-viewport="0.9">
      <div className={styles.inner}>
        <div className={styles.introduction} data-reveal-group>
          <header className={styles.header}>
            <p className={styles.eyebrow} data-reveal="left">Le contact</p>
            <h2 className={styles.title} id="contact-title" data-reveal="left">On en <span>parle ?</span></h2>
          </header>
          <p className={styles.description} data-reveal="left">Un site à lancer, une application à créer ou un produit à faire évoluer ? Racontez-nous ce que vous avez en tête.</p>

          <ul className={styles.contactDetails} role="list" aria-label="Les coordonnées du studio" data-reveal-group>
            <li data-reveal="left">
              <a className={styles.contactMethod} href={`mailto:${CONTACT.email}`}>
                <MetalSticker src="/images/contact/stickers/email.svg" className={styles.methodIcon} backing="circle" />
                <span><span className={styles.methodTitle}>Par e-mail</span><span className={styles.methodValue}>{CONTACT.email}</span></span>
              </a>
            </li>
            <li data-reveal="left">
              <a className={styles.contactMethod} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MetalSticker src="/images/contact/stickers/whatsapp.svg" className={styles.methodIcon} backing="circle" />
                <span><span className={styles.methodTitle}>Sur WhatsApp</span><span className={styles.methodValue}>+33 6 95 06 41 32</span></span>
              </a>
            </li>
            <li className={styles.contactMethod} data-reveal="left">
              <MetalSticker src="/images/contact/stickers/reponse.svg" className={styles.methodIcon} backing="circle" />
              <span><span className={styles.methodTitle}>Une réponse sous 24h</span><span className={styles.methodValue}>Un échange avec le développeur.</span></span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </StickerSurface>
  )
}
