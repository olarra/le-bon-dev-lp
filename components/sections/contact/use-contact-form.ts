"use client"

import { useState, type FormEvent } from "react"
import { prepareContactDraft, type ContactDraft } from "@/lib/contact-draft"

export function useContactForm() {
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

  return { draft, copyState, handleSubmit, handleInput, copyDraft }
}
