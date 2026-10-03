"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"

type State = "idle" | "sending" | "success" | "error" | "unavailable" | "invalid"

export function useContactForm(locale: Locale, copy: Dictionary["contact"]["form"]) {
  const [state, setState] = useState<State>("idle")
  const requestRef = useRef<AbortController | null>(null)
  useEffect(() => () => { requestRef.current?.abort() }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestRef.current) return
    const form = event.currentTarget
    for (const name of ["name", "message"]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      if (!field.value.trim()) {
        field.setCustomValidity(name === "name" ? copy.nameRequired : copy.messageRequired)
        field.reportValidity()
        return
      }
    }
    if (!form.reportValidity()) return

    const payload = { ...Object.fromEntries(new FormData(form)), locale }
    const controller = new AbortController()
    requestRef.current = controller
    setState("sending")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      const result = await response.json()
      if (controller.signal.aborted) return
      if (!response.ok || result.ok !== true) {
        setState(result.error === "invalid" ? "invalid" : result.error === "unavailable" ? "unavailable" : "error")
        return
      }
      form.reset()
      setState("success")
    } catch {
      if (!controller.signal.aborted) setState("error")
    } finally {
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("")
    if (!requestRef.current) setState("idle")
  }

  return { state, handleSubmit, handleInput }
}
