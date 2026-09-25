"use client"

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { useLenis } from "lenis/react"
import layout from "@/components/ui/scroll-01.module.css"
import { GuaranteeArt } from "./GuaranteeArt"
import { GUARANTEE_STEPS } from "./guarantees-timeline.content"
import { ILLUSTRATION_SCALES, MORPH_BLOBS, MORPH_PALETTES } from "./morph-content"
import { mountGuaranteesMorph } from "./morph-controller"
import { mountGuaranteesEntrance } from "./guarantees-entrance"
import morph from "./guarantees-morph.module.css"
import styles from "./guarantees-timeline.module.css"

const assets = GUARANTEE_STEPS.map((step) => `/images/guarantees-timeline/png/${step.image}`)

export function GuaranteesTimeline({ heading }: { heading: ReactNode }) {
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
                      <p className={styles.phase}>{step.phase}</p>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.description}>{step.description}</p>
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
