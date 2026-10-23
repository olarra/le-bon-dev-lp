"use client"

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react"
import type { Locale } from "@/lib/i18n/config"
import { CONTACT } from "@/lib/contact"
import { MetalSticker } from "@/components/ui/metal-sticker"
import { StickerSurface } from "@/components/ui/sticker-surface"
import { PrivacyLink } from "@/components/legal/PrivacyLink"
import { LEGAL_LABELS } from "@/lib/legal/navigation"
import type { EstimationCopy } from "@/lib/estimation/copy"
import {
  AUDIENCES, BUDGETS, CONSTRAINTS, DELAYS, DESIGNS, FEATURES, PROJECT_TYPES, SECTORS,
  STEP_COUNT, TEXT_LIMITS, isApplication, type ProjectType, type TextField,
} from "@/lib/estimation/schema"
import { estimateSummary } from "@/lib/estimation/summary"
import { EstimateIcon, type EstimateIconName } from "./EstimateIcon"
import { EstimateChoices, EstimateTiles } from "./EstimateChoices"
import { EstimateFrameLight } from "./EstimateFrameLight"
import { useEstimateForm } from "./use-estimate-form"
import styles from "./estimation.module.css"

const STEP_ICONS: readonly EstimateIconName[] = ["project", "sector", "features", "design", "delay", "details", "contact"]
type Props = {
  locale: Locale; copy: EstimationCopy; prefill?: ProjectType; mode?: "page" | "dialog"
  onClose?: () => void; onBusyChange?: (busy: boolean) => void
  onStageChange?: (stage: number) => void
}

export function EstimateWizard({ locale, copy, prefill, mode = "page", onClose, onBusyChange, onStageChange }: Props) {
  const form = useEstimateForm(locale, prefill)
  const { draft, receipt, sending, ready } = form
  const uid = useId()
  const questionId = uid + "-question"
  const errorId = uid + "-error"
  const contentRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(draft.step)
  const currentStep = copy.steps[draft.step - 1]
  const progress = receipt ? 1 : (draft.step - 1) / (STEP_COUNT - 1)
  const stage = receipt ? STEP_COUNT + 1 : draft.step
  const Heading = mode === "dialog" ? "h3" : "h2"

  useEffect(() => { onBusyChange?.(sending) }, [sending, onBusyChange])
  useEffect(() => { if (ready) onStageChange?.(stage) }, [ready, stage, onStageChange])

  useEffect(() => {
    if (previousStep.current === draft.step && !receipt) return
    previousStep.current = draft.step
    if (bodyRef.current) bodyRef.current.scrollTop = 0
    headingRef.current?.focus({ preventScroll: mode === "dialog" })
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = contentRef.current?.animate([
      { opacity: 0, transform: "translateY(10px) translateX(" + form.direction.current * 8 + "px)" },
      { opacity: 1, transform: "translateY(0) translateX(0)" },
    ], { duration: 280, easing: "cubic-bezier(.16,1,.3,1)" })
    return () => animation?.cancel()
  }, [draft.step, receipt, mode, form.direction])

  useEffect(() => {
    if (!form.error) return
    const field = form.error.field === "project"
      ? contentRef.current?.querySelector<HTMLElement>("button")
      : document.getElementById(uid + "-" + form.error.field)
    field?.focus()
  }, [form.error, uid])

  function field(name: TextField, type: "text" | "url" | "email" | "tel" = "text") {
    const invalid = form.error?.field === name
    const autoComplete = { firstName: "given-name", email: "email", company: "organization", phone: "tel" }[name as "firstName" | "email" | "company" | "phone"]
    const shared = {
      id: uid + "-" + name, name, value: draft[name], maxLength: TEXT_LIMITS[name],
      "aria-invalid": invalid || undefined, "aria-describedby": invalid ? errorId : undefined,
    }
    return (
      <label className={styles.field} key={name} htmlFor={shared.id}>
        <span>{copy.fields[name]}</span>
        {name === "desc"
          ? <textarea {...shared} rows={5} onChange={event => form.text(name, event.target.value)} />
          : <input {...shared} type={type} autoComplete={autoComplete || "off"} required={name === "firstName" || name === "email"}
              autoCapitalize={name === "email" || name === "link" ? "none" : undefined}
              spellCheck={name === "email" || name === "link" ? false : undefined}
              onChange={event => form.text(name, event.target.value)} />}
      </label>
    )
  }

  function group(label: string, children: ReactNode) {
    return <fieldset className={styles.questionGroup}><legend>{label}</legend>{children}</fieldset>
  }

  function questions() {
    switch (draft.step) {
      case 1: return <>
        <EstimateTiles options={PROJECT_TYPES} labels={copy.types} selected={draft.types} onSelect={value => form.toggle("types", value)} />
        {field("typeOther")}
      </>
      case 2: return <>
        <EstimateChoices options={SECTORS} labels={copy.sectors} selected={[draft.sector]} onSelect={value => form.select("sector", value)} layout="grid" />
        {field("sectorNote")}
      </>
      case 3: return <>
        {isApplication(draft.types) && group(copy.groups.audience, <EstimateChoices options={AUDIENCES} labels={copy.audiences} selected={[draft.audience]} onSelect={value => form.select("audience", value)} />)}
        {group(copy.groups.features, <EstimateChoices options={FEATURES} labels={copy.features} selected={draft.features} onSelect={value => form.toggle("features", value)} layout="grid" multiple />)}
        {draft.features.includes("ai") && <div className={styles.conditional}>{field("featureIA")}</div>}
        {draft.features.includes("other") && <div className={styles.conditional}>{field("featureOther")}</div>}
      </>
      case 4: return <EstimateTiles options={DESIGNS} labels={copy.designs} selected={[draft.design]} onSelect={value => form.select("design", value)} />
      case 5: return <>
        <EstimateChoices options={DELAYS} labels={copy.delays} selected={[draft.delay]} onSelect={value => form.select("delay", value)} />
        {field("deadline")}
        {group(copy.groups.budget, <EstimateChoices options={BUDGETS} labels={copy.budgets} selected={[draft.budget]} onSelect={value => form.select("budget", value)} layout="budget" />)}
        {group(copy.groups.constraints, <EstimateChoices options={CONSTRAINTS} labels={copy.constraints} selected={draft.constraints} onSelect={value => form.toggle("constraints", value)} multiple />)}
      </>
      case 6: return <>{field("name")}{field("desc")}{field("link", "url")}</>
      case 7: return <>
        <div className={styles.fieldGrid}>{field("firstName")}{field("email", "email")}{field("company")}{field("phone", "tel")}</div>
        <section className={styles.recap} aria-label={copy.groups.recap}>
          <h4>{copy.groups.recap}</h4>
          <dl>{estimateSummary(draft, copy).map(row => (
            <div className={styles.recapRow} key={row.step}>
              <div><dt>{row.label}</dt><dd data-empty={!row.value}>{row.value || copy.status.unspecified}</dd></div>
              <button type="button" onClick={() => form.go(row.step)} aria-label={copy.actions.edit + " : " + row.label}><EstimateIcon name="edit" size={15} /><span>{copy.actions.edit}</span></button>
            </div>
          ))}</dl>
        </section>
      </>
    }
  }

  const close = onClose ?? (() => { window.location.assign("/" + locale) })

  return (
    <div className={styles.wizard} data-mode={mode} data-estimate-wizard style={{ "--estimate-progress": progress } as CSSProperties}>
      {mode === "page" && ready && <EstimateFrameLight key={stage} />}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeading}>
          <div className={styles.sidebarTopline}><span>{copy.status.steps}</span><span className={styles.sidebarCount}>{String(Math.min(stage, STEP_COUNT)).padStart(2, "0")} <span>/ {String(STEP_COUNT).padStart(2, "0")}</span></span></div>
          <p>{copy.title}</p>
          <div className={styles.progressSegments} aria-hidden="true">{copy.steps.map((step, index) => <i key={step.label} data-passed={Boolean(receipt) || index < draft.step} />)}</div>
        </div>
        <nav aria-label={copy.status.steps} className={styles.stepNavigation}>
          <ol className={styles.steps}>
            {copy.steps.map((step, index) => {
              const number = index + 1
              const completed = Boolean(receipt) || number < draft.step
              return <li key={step.label}>
                <button type="button" className={styles.step} data-complete={completed}
                  aria-label={number + ". " + step.label} aria-current={!receipt && number === draft.step ? "step" : undefined}
                  disabled={!ready || sending || Boolean(receipt) || number > draft.visited} onClick={() => form.go(number)}>
                  <span className={styles.stepNumber} aria-hidden="true"><EstimateIcon name={STEP_ICONS[index]} size={21} />{completed && <span className={styles.stepCheck}><EstimateIcon name="check" size={10} /></span>}</span>
                  <span className={styles.stepCopy}><span className={styles.stepIndex} aria-hidden="true">{String(number).padStart(2, "0")}</span><span className={styles.stepLabel}>{step.label}</span></span>
                  <span className={styles.stepArrow}><EstimateIcon name="arrow" size={16} /></span>
                </button>
              </li>
            })}
          </ol>
        </nav>
        {!receipt && <p className={styles.saveNotice}><EstimateIcon name="save" size={19} /><span>{form.stored ? copy.status.saved : copy.status.notStored}</span></p>}
      </aside>

      <form className={styles.form} onSubmit={form.submit} noValidate aria-label={copy.title} aria-busy={sending}>
        <div className={styles.body} ref={bodyRef} data-confirmed={Boolean(receipt)} data-lenis-prevent>
          <div ref={contentRef}>
            {receipt ? <StickerSurface className={styles.success} aria-labelledby={questionId}>
              <header className={styles.successHeader}>
                <span className={styles.successMark}><MetalSticker src="/images/estimation/stickers/message-received.svg" className={styles.successSticker} /></span>
                <Heading id={questionId} ref={headingRef} tabIndex={-1} className={styles.question} data-estimation-heading>{copy.success.title}</Heading>
              </header>
              <p>{receipt.confirmationSent ? <>{copy.success.beforeEmail}<strong>{receipt.answers.email.trim()}</strong>{copy.success.afterEmail}</> : copy.success.withoutCopy}</p>
              {receipt.confirmationSent && <p>{copy.success.followup}</p>}
              <div className={styles.successActions}>
                <button type="button" className={styles.primary} onClick={close}><span>{copy.actions.close}<EstimateIcon name="arrow" size={19} /></span></button>
                <button type="button" className={styles.secondary} onClick={form.restart}>{copy.actions.restart}</button>
              </div>
              <details className={styles.sentDetails}>
                <summary>{copy.success.details}</summary>
                <dl>{estimateSummary(receipt.answers, copy, true).map(row => <div key={row.step}><dt>{row.label}</dt><dd>{row.value || copy.status.unspecified}</dd></div>)}
                  {(["firstName", "email", "company", "phone"] as const).map(name => <div key={name}><dt>{copy.fields[name]}</dt><dd>{receipt.answers[name] || copy.status.unspecified}</dd></div>)}
                </dl>
              </details>
            </StickerSurface> : <>
              <header className={styles.questionHeader}>
                <div className={styles.questionTopline}><span className={styles.questionIcon}><EstimateIcon name={STEP_ICONS[draft.step - 1]} size={25} /></span><p>{copy.status.step} {String(draft.step).padStart(2, "0")} <span>/ {String(STEP_COUNT).padStart(2, "0")}</span></p></div>
                <Heading id={questionId} ref={headingRef} tabIndex={-1} className={styles.question} data-estimation-heading>{currentStep.title}</Heading>
                <p className={styles.help}>{currentStep.help}</p>
              </header>
              <fieldset className={styles.answers} aria-labelledby={questionId} disabled={!ready || sending}>{questions()}</fieldset>
            </>}
          </div>
        </div>
        <div className={styles.honeypot} aria-hidden="true"><label htmlFor={uid + "-website"}>Website</label><input id={uid + "-website"} name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
        {!receipt && <footer className={styles.footer}>
          {form.error && <p className={styles.error} id={errorId} role="alert">{copy.errors[form.error.field]}</p>}
          {form.sendError && <p className={styles.error} role="alert">{form.sendError === "invalid" ? copy.errors.invalid : <>{copy.errors.send} <a href={"mailto:" + CONTACT.email}>{CONTACT.email}</a>.</>}</p>}
          {draft.step === STEP_COUNT && <p className={styles.privacyNotice}>
            {LEGAL_LABELS[locale].formInformation} <PrivacyLink locale={locale} />
          </p>}
          <div className={styles.footerNavigation}>
            <button type="button" className={styles.back} data-hidden={draft.step === 1} tabIndex={draft.step === 1 ? -1 : undefined} aria-hidden={draft.step === 1 || undefined}
              disabled={!ready || sending || draft.step === 1} onClick={() => form.go(draft.step - 1)}><EstimateIcon name="back" size={18} /><span>{copy.actions.back}</span></button>
            <button type="submit" className={styles.primary} disabled={!ready || sending}>
              <span>{sending ? copy.actions.sending : draft.step === STEP_COUNT ? (form.sendError ? copy.actions.retry : copy.actions.submit) : copy.actions.next}
                {sending ? <i className={styles.spinner} aria-hidden="true" /> : <EstimateIcon name="arrow" size={19} />}</span>
            </button>
          </div>
          <p className={styles.mobileSaved}>{form.stored ? copy.status.saved : copy.status.notStored}</p>
        </footer>}
      </form>
      <noscript>
        <style>{'[data-estimate-wizard] > aside, [data-estimate-wizard] > form { display: none; } [data-estimate-wizard] { display: block !important; min-height: 0 !important; }'}</style>
        <div className={styles.noScript}>{copy.status.noScript} <a href={"mailto:" + CONTACT.email}>{CONTACT.email}</a></div>
      </noscript>
    </div>
  )
}
