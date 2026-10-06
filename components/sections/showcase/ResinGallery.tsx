"use client"

import Image from "next/image"
import styles from "./resin-gallery.module.css"

type Artwork = { src: string; alt: string; width: number; height: number }
type ResinGalleryProps = {
  brand: string
  url?: string | null
  artworks: readonly Artwork[]
  label: string
}

export function ResinGallery({ brand, url, artworks, label }: ResinGalleryProps) {
  const address = url ? new URL(url).hostname.replace(/^www\./, "") : brand

  return (
    <div className={styles.stage} data-resin-stage role="group" aria-label={label}>
      <div className={styles.device} data-resin-device>
        <div className={styles.toolbar} aria-hidden="true">
          <div className={styles.windowControls}><i /><i /><i /></div>
          <span className={styles.windowAddress}>{address}</span>
        </div>
        <div className={styles.screen} data-resin-screen>
          <div className={styles.nav} data-gallery-nav aria-hidden="true">
            <span className={styles.brand}>{brand}</span>
            <div className={styles.links}><span>Prints</span><span>Collections</span><span>About</span><span>Cart (0)</span></div>
          </div>
          <div className={styles.prints}>
            {artworks.map(artwork => (
              <div className={styles.print} key={artwork.src} data-gallery-print>
                <div className={styles.wood}>
                  <div className={styles.mat}>
                    <div className={styles.art}>
                      <Image
                        {...artwork}
                        quality={95}
                        sizes="(max-width: 699px) 30vw, (max-width: 1199px) 31vw, 420px"
                        draggable={false}
                        data-gallery-art
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <span className={styles.reflectionMask} aria-hidden="true">
            <i className={styles.reflection} data-resin-reflection />
          </span>
        </div>
      </div>
    </div>
  )
}
