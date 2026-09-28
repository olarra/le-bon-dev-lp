import styles from "./ResinCta.module.css"

type Props = {
  label: string
  href?: string | null
  className?: string
  arrowSize?: number
  strokeWidth?: number
}

export function ResinCta({ label, href, className, arrowSize = 24, strokeWidth = 1.7 }: Props) {
  const classes = [styles.button, className].filter(Boolean).join(" ")
  const content = (
    <span>
      {label}
      <svg width={arrowSize} height={arrowSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </svg>
    </span>
  )

  return href
    ? <a className={classes} href={href}>{content}</a>
    : <button className={classes} type="button" disabled>{content}</button>
}
