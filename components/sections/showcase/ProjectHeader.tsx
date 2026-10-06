import type { CSSProperties, ReactNode } from "react"
import { ResinCta } from "@/components/atoms/ResinCta"
import { OfferSticker } from "@/components/offer-icons"
import { MetalSticker } from "@/components/ui/metal-sticker"
import designSticker from "@/public/images/realisations/stickers/design.png"
import developmentSticker from "@/public/images/realisations/stickers/development.png"
import appStoreSticker from "@/public/images/realisations/stickers/app-store.png"
import googlePlaySticker from "@/public/images/realisations/stickers/google-play.png"
import copywritingSticker from "@/public/images/realisations/stickers/copywriting.png"
import responsiveSticker from "@/public/images/realisations/stickers/responsive.png"
import seoSticker from "@/public/images/realisations/stickers/seo.png"
import interactionsSticker from "@/public/images/realisations/stickers/interactions.png"
import type { Dictionary } from "@/lib/i18n/types"
import type { Realisation } from "./realisations.content"
import glass from "../studio/studio.module.css"
import styles from "./project-header.module.css"

type Props = {
  project: Realisation
  id: string
  copy: Dictionary["showcase"]
  children?: ReactNode
}

// Content-hashed URLs keep the visible image and CSS masks on the same revision,
// even when a replacement PNG keeps its source filename.
const STICKERS = {
  design: designSticker,
  development: developmentSticker,
  "app-store": appStoreSticker,
  "google-play": googlePlaySticker,
  copywriting: copywritingSticker,
  responsive: responsiveSticker,
  seo: seoSticker,
  interactions: interactionsSticker,
}

// Compensate the source PNGs' different transparent margins, without changing
// the artwork. Every visible silhouette occupies the same icon box.
const ARTWORK = {
  design: { scale: 1.1875, x: 0, y: -0.678 },
  development: { scale: 1.2151, x: 0, y: -0.558, tone: "light" },
  "app-store": { scale: 1.3284, x: 0, y: -0.877 },
  "google-play": { scale: 1.2163, x: 0, y: -0.678 },
  copywriting: { scale: 1.1463, x: 0.04, y: 0.319, tone: "light" },
  responsive: { scale: 1.2222, x: 0.08, y: -0.478, tone: "light" },
  seo: { scale: 1.1442, x: 0.08, y: 0.04, tone: "dark" },
  interactions: { scale: 1.141, x: 0.04, y: 0.12, tone: "light" },
} satisfies Record<string, { scale: number; x: number; y: number; tone?: "light" | "dark" }>

function ServiceSticker({ asset }: { asset: keyof typeof ARTWORK }) {
  const artwork = ARTWORK[asset]
  return (
    <span className={styles.stickerSlot} style={{
      "--asset-scale": artwork.scale,
      "--asset-x": `${artwork.x}%`,
      "--asset-y": `${artwork.y}%`,
    } as CSSProperties}>
      <MetalSticker
        src={STICKERS[asset].src}
        className={styles.serviceSticker}
        tone={"tone" in artwork ? artwork.tone : undefined}
      />
    </span>
  )
}

/** The Studio's glass layers and live metallic finish, applied to a project brief. */
export function ProjectHeader({ project, id, copy, children }: Props) {
  const isApp = project.icon === "applications"
  const services: { asset: keyof typeof ARTWORK; label: string }[] = isApp
    ? [
      { asset: "design", label: copy.services.design },
      { asset: "development", label: copy.services.mobile },
    ]
    : [
      { asset: "copywriting", label: copy.services.copywriting },
      { asset: "responsive", label: copy.services.responsive },
      { asset: "seo", label: copy.services.seo },
      { asset: "interactions", label: copy.services.interactions },
    ]

  return (
    <div className={`${glass.panel} ${styles.card}${children ? ` ${styles.withIllustration}` : ""}`} data-project-copy>
      <div className={styles.introduction} data-project-introduction>
        <OfferSticker kind={project.icon} className={styles.offerIcon} />
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h3 id={`${id}-title`} className={styles.name}>{project.name}</h3>
            <span className={styles.badge}>{project.offer}</span>
          </div>
          <p className={styles.context}>{project.context}</p>
        </div>
        <p className={styles.description}>{project.description}</p>
        <ResinCta
          className={styles.cta}
          href={project.href}
          label={project.cta}
          newTab
          newTabLabel={copy.newTab}
          arrowSize={22}
        />
      </div>

      {children && <div className={styles.illustration}>{children}</div>}

      <div className={styles.footer}>
        <div className={`${glass.glassGlow} ${styles.glow}`} aria-hidden="true" />
        <div className={`${glass.glassBase} ${styles.base}`}>
          <ul className={styles.services} aria-label={copy.services.label}>
            {services.map(service => (
              <li className={styles.service} key={service.asset}>
                <ServiceSticker asset={service.asset} />
                <span>{service.label}</span>
              </li>
            ))}
            {isApp && (
              <li className={styles.publication}>
                <ul className={styles.stores}>
                  <li className={styles.service}>
                    <ServiceSticker asset="app-store" />
                    <span>App Store</span>
                  </li>
                  <li className={styles.service}>
                    <ServiceSticker asset="google-play" />
                    <span>Google Play</span>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
