"use client"

import { useEffect, useRef } from "react"
import layout from "@/components/ui/scroll-01.module.css"
import { GuaranteeArt } from "./GuaranteeArt"
import { GUARANTEE_STEPS } from "./guarantees-timeline.content"
import { ILLUSTRATION_SCALES, MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import { mountGuaranteesMorph } from "./morph-controller"
import morph from "./guarantees-morph.module.css"
import styles from "./guarantees-timeline.module.css"

const assets = GUARANTEE_STEPS.map((step) => `/images/guarantees-timeline/png/${step.image}`)

export function GuaranteesTimeline() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return mountGuaranteesMorph(ref.current, assets)
  }, [])

  return (
    <div
      ref={ref}
      className={`${layout.layout} ${styles.timeline} ${morph.track}`}
      data-guarantees-track
      data-active="0"
      data-renderer="static"
    >
      <div className={layout.visualColumn} aria-hidden="true">
        <div className={layout.stickyVisual}>
          <div className={`${layout.visualMedia} ${morph.scene}`}>
            <svg className={morph.blob} viewBox="0 0 600 600" focusable="false">
              <defs>
                <linearGradient id="guarantees-morph-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop data-stop-a offset="0%" stopColor={MORPH_PALETTES[0][0]} />
                  <stop data-stop-b offset="100%" stopColor={MORPH_PALETTES[0][1]} />
                </linearGradient>
                <path data-morph-shape d={MORPH_BLOBS[0]} />
                <path data-morph-shape d={MORPH_BLOBS[1]} />
              </defs>
              <path data-guarantee-blob d={MORPH_BLOBS[0]} fill="url(#guarantees-morph-gradient)" />
            </svg>
            {assets.map((src, index) => (
              <img
                key={src}
                className={morph.fallback}
                data-fallback={index}
                src={src}
                alt=""
                width={1254}
                height={1254}
                draggable={false}
                style={{ transform: `scale(${ILLUSTRATION_SCALES[index]})` }}
              />
            ))}
            <canvas className={morph.canvas} data-guarantee-canvas />
          </div>
        </div>
      </div>
      <div className={layout.railColumn} aria-hidden="true">
        <div className={layout.rail}>
          <div className={layout.railTrack}>
            <span className={`${layout.railFill} ${morph.fill}`} data-guarantee-fill />
          </div>
        </div>
      </div>
      <ol className={layout.steps}>
        {GUARANTEE_STEPS.map((step, index) => (
          <li key={step.kind} className={layout.step} data-guarantee-step aria-current={index === 0 ? "step" : undefined}>
            <div>
              <div className={layout.mobileArt}><GuaranteeArt step={step} /></div>
              <div className={layout.copy}>
                <p className={styles.phase}>{step.phase}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
