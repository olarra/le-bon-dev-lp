import type { ReactNode } from "react"
import styles from "./PageFrame.module.css"

/** Framer page shell: full-width background with a fixed-width centered column. */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.page}>
        <main className={styles.main} data-framer-name="Main">
          {children}
        </main>
      </div>
    </div>
  )
}
