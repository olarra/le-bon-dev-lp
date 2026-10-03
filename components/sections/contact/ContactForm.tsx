"use client"

import { PROJECT_IDS } from "@/lib/contact-form"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { useContactForm } from "./use-contact-form"
import styles from "./contact-form.module.css"

export function ContactForm({ locale, copy }: { locale: Locale; copy: Dictionary["contact"]["form"] }) {
  const { state, handleSubmit, handleInput } = useContactForm(locale, copy)
  const sending = state === "sending"
  const feedback = state === "idle" || state === "sending" ? "" : copy[state]

  return (
    <>
    <noscript><style>{"#contact-form { display: none; }"}</style></noscript>
    <form
      className={styles.form}
      id="contact-form"
      data-reveal="right"
      aria-label={copy.label}
      aria-describedby="contact-form-hint"
      aria-busy={sending}
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">{copy.honeypot}</label>
        <input id="contact-website" name="website" autoComplete="off" tabIndex={-1} />
      </div>
      <fieldset className={styles.formBody} disabled={sending}>
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

      <p className={styles.formHint} id="contact-form-hint">{copy.hint}</p>
      <button className={styles.submit} type="submit" disabled={sending}>
        {sending ? copy.pending : copy.submit}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>
      <p className={styles.feedback} data-error={state !== "success"} role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
    </form>
    </>
  )
}
