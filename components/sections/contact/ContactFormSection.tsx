import { CONTACT } from "@/lib/contact"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { ContactForm } from "./ContactForm"
import styles from "./contact-form.module.css"

export function ContactFormSection({ locale, copy }: { locale: Locale; copy: Dictionary["contact"] }) {
  return (
    <StickerSurface className={styles.section} id="contact" aria-labelledby="contact-title" data-header-theme="light" data-reveal-viewport="0.9">
      <div className={styles.inner}>
        <div className={styles.introduction} data-reveal-group>
          <header className={styles.header}>
            <p className={styles.eyebrow} data-reveal="left">{copy.eyebrow}</p>
            <h2 className={styles.title} id="contact-title" data-reveal="left">{copy.titleBefore}<span>{copy.titleHighlight}</span></h2>
          </header>
          <p className={styles.description} data-reveal="left">{copy.description}</p>

          <ul className={styles.contactDetails} role="list" aria-label={copy.detailsLabel} data-reveal-group>
            <li data-reveal="left">
              <a className={styles.contactMethod} href={`mailto:${CONTACT.email}`}>
                <MetalSticker src="/images/contact/stickers/email.svg" className={styles.methodIcon} backing="circle" />
                <span><span className={styles.methodTitle}>{copy.email}</span><span className={styles.methodValue}>{CONTACT.email}</span></span>
              </a>
            </li>
            <li data-reveal="left">
              <a className={styles.contactMethod} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MetalSticker src="/images/contact/stickers/whatsapp.svg" className={styles.methodIcon} backing="circle" />
                <span><span className={styles.methodTitle}>{copy.whatsapp}</span><span className={styles.methodValue}>+33 6 95 06 41 32</span></span>
              </a>
            </li>
            <li className={styles.contactMethod} data-reveal="left">
              <MetalSticker src="/images/contact/stickers/reponse.svg" className={styles.methodIcon} backing="circle" />
              <span><span className={styles.methodTitle}>{copy.response}</span><span className={styles.methodValue}>{copy.developer}</span></span>
            </li>
          </ul>
        </div>

        <ContactForm locale={locale} copy={copy.form} />
      </div>
    </StickerSurface>
  )
}
