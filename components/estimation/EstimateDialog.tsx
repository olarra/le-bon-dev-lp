"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLenis } from "lenis/react"
import type { Locale } from "@/lib/i18n/config"
import type { EstimationCopy } from "@/lib/estimation/copy"
import type { ProjectType } from "@/lib/estimation/schema"
import { EstimateWizard } from "./EstimateWizard"
import { EstimateIcon } from "./EstimateIcon"
import { EstimateFrameLight } from "./EstimateFrameLight"
import styles from "./estimation.module.css"

export function EstimateDialog({ locale, copy, prefill }: { locale: Locale; copy: EstimationCopy; prefill?: ProjectType }) {
  const router = useRouter()
  const lenis = useLenis()
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const exitAnimation = useRef<Animation | null>(null)
  const backdropPointer = useRef(false)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<number | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const { body, documentElement } = document
    const previous = { body: body.style.overflow, html: documentElement.style.overflow, padding: body.style.paddingRight }
    const scrollbar = window.innerWidth - documentElement.clientWidth
    if (scrollbar > 0) body.style.paddingRight = parseFloat(getComputedStyle(body).paddingRight) + scrollbar + "px"
    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"
    dialog.showModal()
    dialog.querySelector<HTMLElement>("[data-estimation-heading]")?.focus({ preventScroll: true })
    return () => {
      exitAnimation.current?.cancel()
      dialog.close()
      body.style.overflow = previous.body
      documentElement.style.overflow = previous.html
      body.style.paddingRight = previous.padding
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (!lenis || lenis.isStopped) return
    lenis.stop()
    return () => { lenis.start() }
  }, [lenis])

  const close = useCallback(() => {
    if (busy || closing.current) return
    closing.current = true
    const dialog = dialogRef.current
    if (!dialog || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.back()
      return
    }
    // The URL is restored after the exit; native dialog keeps focus contained until unmount.
    dialog.getAnimations().forEach(animation => animation.cancel())
    const animation = dialog.animate([
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: "translateX(32px)" },
    ], { duration: 180, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" })
    exitAnimation.current = animation
    animation.finished.then(() => router.back()).catch(() => {})
  }, [busy, router])

  function isBackdrop(clientX: number, clientY: number) {
    const bounds = dialogRef.current?.getBoundingClientRect()
    return Boolean(bounds && (clientX < bounds.left || clientX > bounds.right || clientY < bounds.top || clientY > bounds.bottom))
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} data-lenis-prevent
      onCancel={event => { event.preventDefault(); close() }}
      onPointerDown={event => { backdropPointer.current = event.target === event.currentTarget && isBackdrop(event.clientX, event.clientY) }}
      onClick={event => {
        if (backdropPointer.current && event.target === event.currentTarget && isBackdrop(event.clientX, event.clientY)) close()
        backdropPointer.current = false
      }}>
      {stage !== null && <EstimateFrameLight key={stage} />}
      <header className={styles.dialogHead}>
        <div className={styles.dialogTitle}><span aria-hidden="true" /><h2 id={titleId}>{copy.title}</h2></div>
        <button type="button" className={styles.close} onClick={close} disabled={busy} aria-label={copy.actions.close}><EstimateIcon name="close" size={20} /></button>
      </header>
      <EstimateWizard locale={locale} copy={copy} prefill={prefill} mode="dialog" onClose={close} onBusyChange={setBusy} onStageChange={setStage} />
    </dialog>
  )
}
