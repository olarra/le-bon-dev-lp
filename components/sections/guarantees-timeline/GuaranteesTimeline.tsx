"use client"

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { useLenis } from "lenis/react"
import type { Dictionary } from "@/lib/i18n/types"
import layout from "./guarantees-layout.module.css"
import { GuaranteeArt, GuaranteeBlob } from "./GuaranteeArt"
import { GUARANTEE_STEPS } from "./guarantees-timeline.content"
import { ILLUSTRATION_SCALES } from "./morph-content"
import { mountGuaranteesMorph } from "./morph-controller"
import { mountGuaranteesEntrance } from "./guarantees-entrance"
import morph from "./guarantees-morph.module.css"
import styles from "./guarantees-timeline.module.css"

const assets = GUARANTEE_STEPS.map((step) => `/images/guarantees-timeline/png/${step.image}`)

export function GuaranteesTimeline({ heading, steps }: { heading: ReactNode; steps: Dictionary["guarantees"]["steps"] }) {
  const ref = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (!ref.current) return
    return mountGuaranteesEntrance(ref.current, lenis)
  }, [lenis])

  useEffect(() => {
    if (!ref.current) return
    return mountGuaranteesMorph(ref.current, assets)
  }, [])

  return (
    <div
      ref={ref}
      className={morph.track}
      data-guarantees-track
      data-active="0"
      data-renderer="static"
      data-mobile-stack="false"
    >
      {heading}
      <div className={morph.scrollSpace} data-guarantee-scroll>
        <div className={morph.stackScene} data-guarantee-scene>
          <div className={`${layout.layout} ${styles.timeline}`} data-guarantee-body>
            <div className={layout.visualColumn} data-guarantee-visual aria-hidden="true">
              <div className={layout.stickyVisual} data-guarantee-sticky>
                <div className={`${layout.visualMedia} ${morph.scene}`} data-guarantee-art-entrance>
                  <GuaranteeBlob morphing />
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
            <ol className={layout.steps} data-guarantee-cards>
              {GUARANTEE_STEPS.map((step, index) => (
                <li
                  key={step.kind}
                  className={layout.step}
                  data-guarantee-step
                  data-kind={step.kind}
                  aria-current={index === 0 ? "step" : undefined}
                  style={{ "--card-index": index } as CSSProperties}
                >
                  <div data-guarantee-card>
                    <div className={layout.mobileArt} data-guarantee-mobile-art><GuaranteeArt step={step} /></div>
                    <div className={layout.copy} data-guarantee-copy>
                      <p className={styles.phase}>{steps[index].phase}</p>
                      <h3 className={styles.stepTitle}>{steps[index].title}</h3>
                      <p className={styles.description}>{steps[index].description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
