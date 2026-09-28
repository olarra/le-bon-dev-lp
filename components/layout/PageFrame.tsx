import type { ReactNode } from "react"
import styles from "./PageFrame.module.css"

/** Shared page shell; section layouts and interactions stay with their sections. */
export function PageFrame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className={styles.frame}>
      <div className={styles.page}>
        <main className={styles.main} id="main-content" tabIndex={-1}>
          {children}
        </main>
        {footer}
      </div>
    </div>
  )
}
