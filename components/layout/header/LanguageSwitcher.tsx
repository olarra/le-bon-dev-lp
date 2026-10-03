"use client"

import { useEffect, useRef, useState } from "react"
import { LANGUAGE_NAMES, LOCALES, SECTIONS, type Locale } from "@/lib/i18n/config"
import styles from "./SiteHeader.module.css"

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [hash, setHash] = useState("")

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.35
      let active: string = SECTIONS[0]
      for (const id of SECTIONS) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= readingLine) active = id
      }
      setHash(active === "statistics" ? "" : `#${active}`)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
    }
  }, [])

  return (
    <details
      ref={detailsRef}
      className={styles.language}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && detailsRef.current?.open) {
          event.stopPropagation()
          detailsRef.current.open = false
          detailsRef.current.querySelector("summary")?.focus()
        }
      }}
    >
      <summary aria-label={`${label} : ${LANGUAGE_NAMES[locale]}`}>
        {locale.toUpperCase()}<span aria-hidden="true">⌄</span>
      </summary>
      <nav aria-label={label}>
        {LOCALES.map(language => (
          <a key={language} href={`/${language}${hash}`} hrefLang={language} lang={language} aria-current={language === locale ? "page" : undefined}>
            {LANGUAGE_NAMES[language]}
          </a>
        ))}
      </nav>
    </details>
  )
}
