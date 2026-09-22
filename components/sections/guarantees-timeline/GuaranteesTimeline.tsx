"use client"

import { Scroll01 } from "@/components/ui/scroll-01"
import { GuaranteeArt } from "./GuaranteeArt"
import { GUARANTEE_STEPS } from "./guarantees-timeline.content"
import styles from "./guarantees-timeline.module.css"

const items = GUARANTEE_STEPS.map((step) => ({
  id: step.kind,
  media: <GuaranteeArt step={step} />,
  content: (
    <>
      <p className={styles.phase}>{step.phase}</p>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.description}>{step.description}</p>
    </>
  ),
}))

export function GuaranteesTimeline() {
  return <Scroll01 items={items} className={styles.timeline} />
}
