"use client"

import { BrandLogo } from "@/components/atoms/BrandLogo"
import { NAVIGATION } from "./header.content"
import { useHeader } from "./use-header"
import styles from "./SiteHeader.module.css"

export function SiteHeader() {
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
      <a className={styles.logo} href="#statistics" aria-label="Le bon dev — accueil" onClick={closeMenu}>
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
        {menuOpen ? "Fermer" : "Menu"}
        <span className={styles.menuIcon} aria-hidden="true"><span /><span /></span>
      </button>
      <div id="header-menu" className={styles.menuPanel}>
        <nav ref={navigationRef} className={styles.navigation} aria-label="Navigation principale">
          {NAVIGATION.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
        <a className={styles.contact} href="#contact" onClick={closeMenu}>
          <span>Parlons de votre projet</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  )
}
