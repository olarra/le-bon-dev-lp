import styles from "./ScallopDivider.module.css"

type Props = {
  color: string
  bumps?: number
  className?: string
  /** Bottom placement: domes rise up into the section above (flips the rounded corners). */
  flip?: boolean
}

/**
 * The repeating scalloped/wave edge Framer uses as a seam between sections
 * (a row of bumps, each a flex cell with rounded corners).
 */
export function ScallopDivider({ color, bumps = 15, className, flip = false }: Props) {
  return (
    <div className={[styles.divider, className].filter(Boolean).join(" ")}>
      {Array.from({ length: bumps }).map((_, i) => (
        <div key={i} className={[styles.bump, flip && styles.flipped].filter(Boolean).join(" ")} style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}
