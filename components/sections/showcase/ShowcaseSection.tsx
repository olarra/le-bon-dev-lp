import type { ReactNode } from "react"
import styles from "./showcase.module.css"

export function ShowcaseSection({ children }: { children: ReactNode }) {
  return (
    <div className={styles.showcase} id="offers-showcase" data-header-theme="light">
      {children}
    </div>
  )
}
