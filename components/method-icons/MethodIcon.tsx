import type { MethodKind } from "./motion"
import styles from "./method-icons.module.css"

/** The timeline owns playback; all illustrated layers are visible without JS. */
export function MethodIcon({ kind, className = "" }: { kind: MethodKind; className?: string }) {
  const layer = (name: string) => (
    <img
      key={name}
      data-part={name}
      src={`/le-bon-dev/method-icons/${name}.webp`}
      width={384}
      height={384}
      alt=""
      draggable={false}
      decoding="async"
    />
  )

  return (
    <span className={`${styles.icon} ${className}`.trim()} data-method-icon={kind} aria-hidden="true">
      {kind === "cadrage" && <>{layer("notebook")}{layer("pencil")}</>}
      {kind === "jalons" && <>
        <span data-part="summit">{layer("step-high")}{layer("flag")}</span>
        {layer("step-mid")}{layer("step-low")}
      </>}
      {kind === "rocket" && <span data-part="flight">{layer("flame")}{layer("rocket")}</span>}
      {kind === "care" && <>{layer("sprout")}{layer("wrench")}</>}
    </span>
  )
}
