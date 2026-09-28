import type { CSSProperties } from "react"
import styles from "./studio.module.css"

type StickerName = "comprendre-loupe" | "code-bouclier" | "usage-curseur"

/** Original SVG artwork doubles as an alpha mask, including protruding details. */
export function StudioSticker({ name }: { name: StickerName }) {
  const src = `/images/studio/stickers/${name}.svg`

  return (
    <span
      className={styles.sticker}
      data-studio-sticker={name}
      style={{ "--studio-sticker-mask": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.stickerFace}>
        <img src={src} width={120} height={120} alt="" draggable={false} loading="lazy" decoding="async" />
        <span className={`${styles.stickerFinish} ${styles.stickerFoil}`} />
        <span className={`${styles.stickerFinish} ${styles.stickerGloss}`} />
        <span className={`${styles.stickerFinish} ${styles.stickerGrain}`} />
      </span>
    </span>
  )
}
