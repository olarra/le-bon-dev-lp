"use client"

import { CONTACT } from "@/lib/contact"
import { PROJECT_TYPES } from "@/lib/contact-draft"
import { useContactForm } from "./use-contact-form"
import styles from "./contact-form.module.css"

export function ContactForm() {
  const { draft, copyState, handleSubmit, handleInput, copyDraft } = useContactForm()

  return (
    <form
      className={styles.form}
      id="contact-form"
      aria-label="Présentez-nous votre projet"
      aria-describedby="contact-form-hint"
      action={`mailto:${CONTACT.email}`}
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Nom et prénom <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" placeholder="Votre nom" required maxLength={120} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">E-mail <span aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="vous@entreprise.fr" required maxLength={254} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-company">Entreprise <span className={styles.optional}>facultatif</span></label>
          <input id="contact-company" name="company" autoComplete="organization" placeholder="Votre entreprise" maxLength={120} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Téléphone <span className={styles.optional}>facultatif</span></label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="06 00 00 00 00" maxLength={40} />
        </div>
      </div>

      <fieldset className={styles.projectTypes}>
        <legend>Votre projet</legend>
        <div className={styles.choices}>
          {PROJECT_TYPES.map((project) => (
            <label className={styles.choice} key={project}>
              <input type="radio" name="project" value={project} defaultChecked={project === "À définir"} />
              <span>{project}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="contact-message">Quelques mots sur votre projet <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" rows={5} placeholder="Votre idée, vos utilisateurs, ce que vous aimeriez créer ou améliorer…" required maxLength={3000} />
      </div>

      <p className={styles.formHint} id="contact-form-hint">* Champs obligatoires. Votre messagerie s’ouvrira avec un brouillon à relire.</p>
      <button className={styles.submit} type="submit">
        Préparer mon message
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>

      {draft && (
        <div className={styles.draft}>
          <p role="status">
            {copyState === "copied"
              ? "Message copié. Vous pouvez le coller dans votre messagerie."
              : copyState === "unavailable"
                ? "Ouvrez « Voir le message préparé » pour sélectionner et copier le texte."
                : "Votre brouillon est prêt. Envoyez-le depuis votre messagerie."}
          </p>
          <div className={styles.draftActions}>
            <a href={draft.href}>Ouvrir ma messagerie</a>
            <button type="button" onClick={copyDraft}>Copier le message</button>
          </div>
          <details className={styles.preview}>
            <summary>Voir le message préparé</summary>
            <textarea aria-label="Message préparé à copier" readOnly value={draft.copy} rows={8} onFocus={(event) => event.currentTarget.select()} />
          </details>
        </div>
      )}
    </form>
  )
}
