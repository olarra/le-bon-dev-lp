"use client"

import { useLayoutEffect, useRef } from "react"
import { STUDIO_IMAGES } from "./studio.content"
import { mountStudioScene } from "./studio-scene-motion"
import styles from "./studio.module.css"

export function StudioScene({ label, replay }: { label: string; replay: string }) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (ref.current) return mountStudioScene(ref.current)
  }, [])

  return (
    <figure
      ref={ref}
      className={styles.scene}
      data-studio-scene
    >
      <div className={styles.sceneReveal} data-studio-reveal role="img" aria-label={label}>
        {STUDIO_IMAGES.map(image => (
          <img
            key={image.state}
            src={`/images/studio/${image.file}.webp`}
            data-studio-light={image.state}
            width={1024}
            height={1536}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <button
        className={styles.replay} type="button" data-studio-replay hidden disabled
        aria-label={replay} title={replay}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </svg>
        <svg className={styles.replayArrow} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M4 12h16m-5-5 5 5-5 5" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M20.6 13.1A8.5 8.5 0 0 1 10.9 3.4 8.5 8.5 0 1 0 20.6 13.1Z" />
        </svg>
      </button>
    </figure>
  )
}
