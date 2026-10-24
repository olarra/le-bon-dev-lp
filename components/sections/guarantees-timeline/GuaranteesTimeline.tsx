"use client"

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { useLenis } from "lenis/react"
import type { Dictionary } from "@/lib/i18n/types"
import layout from "./guarantees-layout.module.css"
import { GuaranteeArt, GuaranteeBlob } from "./GuaranteeArt"
import { GUARANTEE_STEPS, MOBILE_METAL_CARDS_ENABLED } from "./guarantees-timeline.content"
import { ILLUSTRATION_SCALES } from "./morph-content"
import { mountGuaranteesMorph } from "./morph-controller"
import { mountGuaranteesEntrance } from "./guarantees-entrance"
import morph from "./guarantees-morph.module.css"
import styles from "./guarantees-timeline.module.css"

const assets = GUARANTEE_STEPS.map((step) => `/images/guarantees-timeline/webp/${step.image}`)

/** The entrance transforms the complete artwork independently of its float. */
function ArtworkEntrance({ children }: { children: ReactNode }) {
  return (
    <div className={morph.artFloat} data-guarantee-art-float>
      <div className={`${morph.artEntrance} ${morph.scene}`} data-guarantee-art-entrance>
        {children}
      </div>
    </div>
  )
}

export function GuaranteesTimeline({ heading, steps }: { heading: ReactNode; steps: Dictionary["guarantees"]["steps"] }) {
  const ref = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<ReturnType<typeof mountGuaranteesEntrance> | null>(null)
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (!ref.current) return
    const entrance = mountGuaranteesEntrance(ref.current)
    entranceRef.current = entrance
    return () => {
      entranceRef.current = null
      entrance.dispose()
    }
  }, [])

  useLayoutEffect(() => {
    entranceRef.current?.setLenis(lenis)
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
      data-mobile-material={MOBILE_METAL_CARDS_ENABLED ? "metal" : "paper"}
    >
      {heading}
      <div className={morph.scrollSpace} data-guarantee-scroll>
        <div className={morph.stackScene} data-guarantee-scene>
          <div className={`${layout.layout} ${styles.timeline}`} data-guarantee-body>
            <div className={layout.visualColumn} data-guarantee-visual aria-hidden="true">
              <div className={layout.stickyVisual} data-guarantee-sticky>
                <div className={layout.visualMedia} data-guarantee-art-slot>
                  <ArtworkEntrance>
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
                        loading="lazy"
                        decoding="async"
                        style={{ transform: `scale(${ILLUSTRATION_SCALES[index]})` }}
                      />
                    ))}
                    <canvas className={morph.canvas} data-guarantee-canvas />
                  </ArtworkEntrance>
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
                    {MOBILE_METAL_CARDS_ENABLED && (
                      <canvas className={morph.cardFoil} data-card-foil aria-hidden="true" />
                    )}
                    <div className={layout.mobileArt} data-guarantee-mobile-art>
                      <ArtworkEntrance>
                        <GuaranteeArt step={step} withBlob={!MOBILE_METAL_CARDS_ENABLED} />
                      </ArtworkEntrance>
                    </div>
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
