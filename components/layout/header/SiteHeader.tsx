"use client"

import { BrandLogo } from "@/components/atoms/BrandLogo"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useHeader } from "./use-header"
import styles from "./SiteHeader.module.css"

export function SiteHeader({ locale, copy }: { locale: Locale; copy: Dictionary["header"] }) {
  const { headerRef, navigationRef, menuButtonRef, scrolled, ready, menuOpen, setMenuOpen, closeMenu } = useHeader()

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled}
      data-ready={ready}
      data-menu-open={menuOpen}
      onBlur={(event) => {
        // This is a non-modal disclosure: Tab can leave it naturally.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setMenuOpen(false)
        }
      }}
    >
      <div className={styles.envelope} aria-hidden="true" />
      <a className={styles.logo} href="#statistics" aria-label={copy.home} onClick={closeMenu}>
        <BrandLogo placement="header" />
      </a>
      <button
        ref={menuButtonRef}
        className={styles.menuButton}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="header-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? copy.close : copy.menu}
        <span className={styles.menuIcon} aria-hidden="true"><span /><span /></span>
      </button>
      <div id="header-menu" className={styles.menuPanel}>
        <nav ref={navigationRef} className={styles.navigation} aria-label={copy.navigation}>
          {copy.links.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
        <div className={styles.actions}>
        <a className={styles.contact} href="#contact" onClick={closeMenu}>
          <span>{copy.contact}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <LanguageSwitcher locale={locale} label={copy.language} />
        </div>
      </div>
    </header>
  )
}
