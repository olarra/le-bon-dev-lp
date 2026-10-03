import type { BrandLogo } from "./hero.content"
import styles from "./WaveBrandCard.module.css"

export function WaveBrandCard({ logo }: { logo: BrandLogo }) {
  return (
    <div
      className={styles.card}
      style={{ backgroundColor: logo.background, color: logo.foreground }}
      role="img"
      aria-label={logo.brandName}
    >
      {/* Mask the complete SVG, retaining its internal masks and transparent
          cutouts while letting the existing palette set the logo colour. */}
      <span
        className={styles.mark}
        style={{
          width: logo.width,
          height: logo.height,
          maskImage: `url("${logo.image}")`,
          WebkitMaskImage: `url("${logo.image}")`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
