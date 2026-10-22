"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import type { Locale } from "@/lib/i18n/config"
import {
  DRAFT_KEY, STEP_COUNT, freshDraft, restoreDraft, submissionFromDraft, validateEstimate,
  type EstimateAnswers, type EstimateError, type EstimateSubmission, type ProjectType, type TextField,
} from "@/lib/estimation/schema"

type Receipt = { answers: EstimateSubmission; confirmationSent: boolean }
type SingleField = "sector" | "audience" | "design" | "delay" | "budget"
type MultiField = "types" | "features" | "constraints"

export function useEstimateForm(locale: Locale, prefill?: ProjectType) {
  const [draft, setDraft] = useState(() => restoreDraft(null, prefill))
  const [ready, setReady] = useState(false)
  const [stored, setStored] = useState(true)
  const [error, setError] = useState<EstimateError | null>(null)
  const [sendError, setSendError] = useState<"invalid" | "send" | null>(null)
  const [sending, setSending] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const mounted = useRef(false)
  const request = useRef<AbortController | null>(null)
  const direction = useRef(1)

  useEffect(() => {
    mounted.current = true
    let saved: unknown = null
    try { saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null") } catch { setStored(false) }
    setDraft(restoreDraft(saved, prefill))
    setReady(true)
    return () => { mounted.current = false; request.current?.abort(); request.current = null }
  }, [prefill])

  useEffect(() => {
    if (!ready) return
    try {
      if (receipt) localStorage.removeItem(DRAFT_KEY)
      else localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      setStored(true)
    } catch { setStored(false) }
  }, [ready, draft, receipt])

  function clearErrors() { setError(null); setSendError(null) }

  function text(field: TextField, value: string) {
    if (request.current) return
    setDraft(previous => ({ ...previous, [field]: value }))
    clearErrors()
  }

  function select<K extends SingleField>(field: K, value: EstimateAnswers[K]) {
    if (request.current) return
    setDraft(previous => ({ ...previous, [field]: previous[field] === value ? "" : value }))
    clearErrors()
  }

  function toggle<K extends MultiField>(field: K, value: EstimateAnswers[K][number]) {
    if (request.current) return
    setDraft(previous => {
      const selected = previous[field] as readonly string[]
      let values = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]
      if (field === "types") {
        if (value === "unknown" && values.includes("unknown")) values = ["unknown"]
        else values = values.filter(item => item !== "unknown")
      }
      return { ...previous, [field]: values }
    })
    clearErrors()
  }

  function go(step: number) {
    if (!ready || request.current || receipt || step < 1 || step > draft.visited) return
    direction.current = step >= draft.step ? 1 : -1
    setDraft(previous => ({ ...previous, step }))
    clearErrors()
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready || request.current || receipt) return
    const invalid = validateEstimate(draft, draft.step === STEP_COUNT ? undefined : draft.step)
    if (invalid) {
      direction.current = invalid.step >= draft.step ? 1 : -1
      setDraft(previous => ({ ...previous, step: invalid.step }))
      setError(invalid)
      return
    }
    if (draft.step < STEP_COUNT) {
      direction.current = 1
      setDraft(previous => ({ ...previous, step: previous.step + 1, visited: Math.max(previous.visited, previous.step + 1) }))
      clearErrors()
      return
    }

    const answers = submissionFromDraft(draft, locale)
    const website = new FormData(event.currentTarget).get("website") || ""
    const controller = new AbortController()
    request.current = controller
    setSending(true)
    clearErrors()
    const timeout = window.setTimeout(() => controller.abort(), 25000)
    try {
      const response = await fetch("/api/estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, website }),
        signal: controller.signal,
      })
      const result = await response.json()
      if (!mounted.current) return
      if (!response.ok || result.ok !== true) {
        setSendError(result.error === "invalid" ? "invalid" : "send")
        return
      }
      setReceipt({ answers, confirmationSent: result.confirmationSent === true })
    } catch {
      if (mounted.current) setSendError("send")
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) request.current = null
      if (mounted.current) setSending(false)
    }
  }

  function restart() {
    direction.current = -1
    setDraft(freshDraft())
    setReceipt(null)
    clearErrors()
  }

  return { draft, ready, stored, error, sendError, sending, receipt, direction, text, select, toggle, go, submit, restart }
}
