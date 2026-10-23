import { useId } from "react"
import Image from "next/image"
import type { GuaranteeStep } from "./guarantees-timeline.content"
import { MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import styles from "./guarantees-timeline.module.css"

const indexByKind = {
  budget: 0,
  followup: 1,
  handover: 2,
} as const

/** The dark satin surface and holographic layer share the morph's master path. */
export function GuaranteeBlob({ path = MORPH_BLOBS[0], palette = MORPH_PALETTES[0], morphing = false }: {
  path?: string
  palette?: (typeof MORPH_PALETTES)[number]
  morphing?: boolean
}) {
  const id = `guarantee-blob-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const shape = `#${id}-shape`

  return (
    <svg
      className={styles.blob}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={600}
      height={420}
      viewBox="0 0 600 420"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-fill`} data-blob-fill x1=".18" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor={palette[0]} stopOpacity=".98" />
          <stop offset=".36" stopColor={palette[1]} stopOpacity=".96" />
          <stop offset=".7" stopColor={palette[2]} stopOpacity=".96" />
          <stop offset="1" stopColor={palette[3]} stopOpacity=".98" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1=".12" y1=".05" x2=".8" y2="1">
          <stop stopColor="#fffef4" stopOpacity=".84" />
          <stop offset=".33" stopColor="#f7ffe7" stopOpacity=".7" />
          <stop offset=".57" stopColor="#a7c287" stopOpacity=".25" />
          <stop offset=".82" stopColor="#749967" stopOpacity=".46" />
          <stop offset="1" stopColor="#f2ffde" stopOpacity=".72" />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx=".29" cy=".12" r=".8">
          <stop stopColor="#fffef4" stopOpacity=".12" />
          <stop offset=".42" stopColor="#fffef4" stopOpacity=".05" />
          <stop offset="1" stopColor="#fffef4" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="shadow-blur" />
          <feOffset in="shadow-blur" dx="0" dy="13" result="shadow-offset" />
          <feFlood floodColor="#54743d" floodOpacity=".11" result="shadow-color" />
          <feComposite in="shadow-color" in2="shadow-offset" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-inset`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
          <feComposite in="SourceAlpha" in2="blur" operator="out" result="edge" />
          <feFlood floodColor="#faffed" floodOpacity=".42" />
          <feComposite in2="edge" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
        <path id={`${id}-shape`} data-morph-path="true" d={path} />
        <clipPath id={`${id}-clip`}>
          <use xlinkHref={shape} />
        </clipPath>
        {morphing && (
          <>
            <path data-morph-shape d={MORPH_BLOBS[0]} />
            <path data-morph-shape d={MORPH_BLOBS[1]} />
          </>
        )}
      </defs>
      <use xlinkHref={shape} fill={`url(#${id}-fill)`} filter={`url(#${id}-shadow)`} />
      <use xlinkHref={shape} fill={`url(#${id}-fill)`} filter={`url(#${id}-inset)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="80" y="30" width="450" height="360" fill={`url(#${id}-light)`} />
        <foreignObject x="0" y="0" width="600" height="420">
          <canvas
            className={styles.blobFoil}
            data-blob-foil={morphing ? "shared" : "static"}
            width={600}
            height={420}
          />
        </foreignObject>
      </g>
      <use xlinkHref={shape} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="3" />
    </svg>
  )
}

/** The metallic mobile variant puts the foil on the card instead of a blob. */
export function GuaranteeArt({ step, withBlob = true }: { step: GuaranteeStep; withBlob?: boolean }) {
  const index = indexByKind[step.kind]
  return (
    <div className={styles.art} data-kind={step.kind} aria-hidden="true">
      {withBlob && <GuaranteeBlob path={MORPH_BLOBS[index]} palette={MORPH_PALETTES[index]} />}
      <Image
        className={styles.illustration}
        src={`/images/guarantees-timeline/webp/${step.image}`}
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 809px) 210px, (max-width: 1200px) 40vw, 440px"
        draggable={false}
      />
    </div>
  )
}
