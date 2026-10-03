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
      <canvas className={styles.foil} data-wave-foil width={158} height={100} aria-hidden="true" />
      {/* Three invisible points map the pointer into the moving card's plane,
          including its rotation and scale, without browser-specific geometry APIs. */}
      <span className={styles.probe} data-foil-origin aria-hidden="true" />
      <span className={`${styles.probe} ${styles.probeX}`} data-foil-x aria-hidden="true" />
      <span className={`${styles.probe} ${styles.probeY}`} data-foil-y aria-hidden="true" />
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
