"use client"

import { useState, type FormEvent } from "react"
import { CONTACT } from "@/lib/contact"
import { prepareContactDraft, PROJECT_TYPES, type ContactDraft } from "./contact-form.content"
import styles from "./contact-form.module.css"

export function ContactForm() {
  const [draft, setDraft] = useState<ContactDraft | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "unavailable">("idle")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    // Required text must contain more than whitespace; the browser handles email validity.
    for (const name of ["name", "message"]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      if (!field.value.trim()) {
        field.setCustomValidity(name === "name" ? "Indiquez votre nom." : "Décrivez votre projet en quelques mots.")
        field.reportValidity()
        return
      }
    }
    if (!form.reportValidity()) return

    const nextDraft = prepareContactDraft(new FormData(form))
    setDraft(nextDraft)
    setCopyState("idle")
    window.location.href = nextDraft.href
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.setCustomValidity("")
    }
    setDraft(null)
    setCopyState("idle")
  }

  async function copyDraft() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft.copy)
      setCopyState("copied")
    } catch {
      setCopyState("unavailable")
    }
  }

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
