import type { CSSProperties } from "react"
import styles from "./metal-sticker.module.css"

type MetalStickerProps = {
  src: string
  className?: string
  backing?: "circle"
  /** The finish blends for mid-tones; declare near-black or near-white artwork. */
  tone?: "dark" | "light"
}

/** The outer SVG silhouette masks the shared finish over artwork and backing. */
export function MetalSticker({ src, className, backing, tone }: MetalStickerProps) {
  const backingSrc = backing === "circle" ? "/images/stickers/circle-lime.svg" : undefined

  return (
    <span
      className={`${styles.sticker}${className ? ` ${className}` : ""}`}
      data-metal-sticker=""
      data-backing={backing}
      data-tone={tone}
      style={{ "--sticker-mask": `url("${backingSrc ?? src}")`, "--sticker-artwork": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.stickerFace}>
        {backingSrc && <img src={backingSrc} width={128} height={128} alt="" draggable={false} loading="lazy" decoding="async" />}
        <img className={styles.stickerArtwork} src={src} width={120} height={120} alt="" draggable={false} loading="lazy" decoding="async" />
        <span className={`${styles.stickerFinish} ${styles.stickerFoil}`} />
        <span className={`${styles.stickerFinish} ${styles.stickerGloss}`} />
        <span className={`${styles.stickerFinish} ${styles.stickerGrain}`} />
      </span>
    </span>
  )
}
