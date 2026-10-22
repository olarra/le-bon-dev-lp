import type { TileCopy } from "@/lib/estimation/copy"
import { EstimateIcon, type EstimateIconName } from "./EstimateIcon"
import styles from "./estimation.module.css"

export function EstimateTiles<T extends string>({ options, labels, selected, onSelect }: {
  options: readonly T[]; labels: Record<T, TileCopy>; selected: readonly string[]; onSelect: (value: T) => void
}) {
  return (
    <div className={styles.tiles}>
      {options.map(value => (
        <button key={value} type="button" className={styles.tile} aria-pressed={selected.includes(value)} onClick={() => onSelect(value)}>
          <span className={styles.tileIcon}><EstimateIcon name={value as EstimateIconName} size={26} /></span>
          <span className={styles.tileText}><strong>{labels[value].title}</strong><span>{labels[value].description}</span></span>
          <span className={styles.selectionMark}><EstimateIcon name="check" size={14} /></span>
        </button>
      ))}
    </div>
  )
}

export function EstimateChoices<T extends string>({ options, labels, selected, onSelect, layout = "inline", multiple = false }: {
  options: readonly T[]; labels: Record<T, string>; selected: readonly string[]; onSelect: (value: T) => void
  layout?: "inline" | "grid" | "budget"; multiple?: boolean
}) {
  return (
    <div className={styles.choices} data-layout={layout}>
      {options.map(value => (
        <button key={value} type="button" className={styles.choice} data-multiple={multiple} aria-pressed={selected.includes(value)} onClick={() => onSelect(value)}>
          <span className={styles.choiceMark}>{multiple ? <EstimateIcon name="check" size={12} /> : <i />}</span>
          <span>{labels[value]}</span>
        </button>
      ))}
    </div>
  )
}
