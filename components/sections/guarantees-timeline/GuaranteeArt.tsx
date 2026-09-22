import Image from "next/image"
import type { GuaranteeStep } from "./guarantees-timeline.content"
import styles from "./guarantees-timeline.module.css"

/** Independent, recolourable SVG blob and transparent illustration layers. */
export function GuaranteeArt({ step }: { step: GuaranteeStep }) {
  return (
    <div className={styles.art} data-kind={step.kind} aria-hidden="true">
      <span className={styles.blob} />
      <Image
        className={styles.illustration}
        src={`/images/guarantees-timeline/png/${step.image}`}
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 809px) 80vw, (max-width: 1200px) 40vw, 560px"
        draggable={false}
      />
    </div>
  )
}
