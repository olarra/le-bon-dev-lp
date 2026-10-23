"use client"

import { useEffect, useRef } from "react"
import { useLenis } from "lenis/react"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { PrivacyLink } from "@/components/legal/PrivacyLink"
import { PROJECT_IDS } from "@/lib/contact-form"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { useContactForm } from "./use-contact-form"
import styles from "./contact-form.module.css"

export function ContactForm({ locale, copy }: { locale: Locale; copy: Dictionary["contact"]["form"] }) {
  const { state, receipt, handleSubmit, handleInput, restart } = useContactForm(locale, copy)
  const formRef = useRef<HTMLFormElement>(null)
  const successTitleRef = useRef<HTMLHeadingElement>(null)
  const previousSuccess = useRef(false)
  const lenis = useLenis()
  const sending = state === "sending"
  const succeeded = state === "success"
  const feedback = state === "error" || state === "unavailable" || state === "invalid" ? copy[state] : ""

  useEffect(() => {
    if (previousSuccess.current === succeeded) return
    previousSuccess.current = succeeded
    const target = succeeded
      ? successTitleRef.current
      : formRef.current?.querySelector<HTMLInputElement>("[name='name']")
    if (!target) return
    target.focus({ preventScroll: true })
    if (succeeded) return

    // The receipt stays in the form footer. Only an explicit restart may
    // scroll back to the first field when it is outside the viewport.
    const bounds = target.getBoundingClientRect()
    const clearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    if (bounds.top >= clearance && bounds.bottom <= window.innerHeight - 24) return
    const top = Math.max(0, window.scrollY + bounds.top - clearance - 24)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (lenis) lenis.scrollTo(top, { duration: 0.5, immediate: reducedMotion })
    else window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" })
  }, [succeeded, lenis])

  return (
    <>
    <noscript><style>{"#contact-form { display: none; }"}</style></noscript>
    <form
      ref={formRef}
      className={styles.form}
      id="contact-form"
      data-reveal="right"
      data-state={state}
      aria-label={copy.label}
      aria-describedby={succeeded ? "contact-success-title" : "contact-form-hint"}
      aria-busy={sending}
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      <div className={styles.formContent}>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">{copy.honeypot}</label>
        <input id="contact-website" name="website" autoComplete="off" tabIndex={-1} />
      </div>
      <fieldset className={styles.formBody} disabled={sending || succeeded}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="contact-name">{copy.name} <span aria-hidden="true">*</span></label>
            <input id="contact-name" name="name" autoComplete="name" placeholder={copy.namePlaceholder} required maxLength={120} />
          </div>
          <div className={styles.field}>
            <label htmlFor="contact-email">{copy.email} <span aria-hidden="true">*</span></label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={copy.emailPlaceholder} required maxLength={254} />
          </div>
          <div className={styles.field}>
            <label htmlFor="contact-company">{copy.company} <span className={styles.optional}>{copy.optional}</span></label>
            <input id="contact-company" name="company" autoComplete="organization" placeholder={copy.companyPlaceholder} maxLength={120} />
          </div>
          <div className={styles.field}>
            <label htmlFor="contact-phone">{copy.phone} <span className={styles.optional}>{copy.optional}</span></label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder={copy.phonePlaceholder} maxLength={40} />
          </div>
        </div>

        <fieldset className={styles.projectTypes}>
          <legend>{copy.project}</legend>
          <div className={styles.choices}>
            {PROJECT_IDS.map(project => (
              <label className={styles.choice} key={project}>
                <input type="radio" name="project" value={project} defaultChecked={project === "unsure"} />
                <span>{copy.projectTypes[project]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="contact-message">{copy.message} <span aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" rows={5} placeholder={copy.messagePlaceholder} required maxLength={3000} />
        </div>
      </fieldset>

      <p className={styles.formHint} id="contact-form-hint">{copy.hint} <PrivacyLink locale={locale} /></p>
      {!succeeded && <button className={styles.submit} type="submit" disabled={sending}>
        {sending ? copy.pending : copy.submit}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>}
      <p className={styles.feedback} data-error="true" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
      </div>

      {succeeded && receipt && (
        <StickerSurface className={styles.successPanel} aria-labelledby="contact-success-title">
          <div className={styles.successArtwork}>
            <MetalSticker src="/images/estimation/stickers/message-received.svg" className={styles.successSticker} />
          </div>
          <div className={styles.successContent}>
            <h3 id="contact-success-title" className={styles.successTitle} ref={successTitleRef} tabIndex={-1} aria-describedby="contact-success-response contact-success-details">{copy.receipt.title}</h3>
            <p className={styles.successResponse} id="contact-success-response">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
              {copy.receipt.response}
            </p>
            <p className={styles.successDetails} id="contact-success-details">
              {receipt.confirmationSent
                ? <>{copy.receipt.beforeEmail}<strong>{receipt.email}</strong>{copy.receipt.afterEmail}</>
                : copy.receipt.withoutCopy}
            </p>
            <button className={styles.restart} type="button" onClick={() => {
              formRef.current?.reset()
              restart()
            }}>{copy.receipt.restart}</button>
          </div>
        </StickerSurface>
      )}
    </form>
    </>
  )
}
