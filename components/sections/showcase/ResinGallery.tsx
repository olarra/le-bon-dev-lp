"use client"

import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect, useRef } from "react"
import styles from "./resin-gallery.module.css"

gsap.registerPlugin(ScrollTrigger)

/** Local viewport progress, shared by the device and the full-surface reflection. */
export const RESIN_GALLERY_REVEAL = {
  start: "top 91%",
  end: "top 26%",
  scrub: 0.22,
  scale: 0.96,
  desktop: { rotationX: 8, y: 38 },
  mobile: { rotationX: 6, y: 22 },
  mobileQuery: "(max-width: 699px)",
  shine: { from: "-20%", to: "20%" },
} as const

type Artwork = { src: string; alt: string; width: number; height: number }
type ResinGalleryProps = {
  brand: string
  artworks: readonly [Artwork, Artwork, Artwork]
}

export function ResinGallery({ brand, artworks }: ResinGalleryProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const device = deviceRef.current
    const reflection = reflectionRef.current
    if (!stage || !device || !reflection) return

    const config = RESIN_GALLERY_REVEAL
    const media = gsap.matchMedia()
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      mobile: config.mobileQuery,
    }, context => {
      if (!context.conditions?.motion) return
      const pose = context.conditions.mobile ? config.mobile : config.desktop

      gsap.set(reflection, { opacity: 1 })
      gsap.fromTo(device, {
        ...pose,
        scale: config.scale,
        "--shine": config.shine.from,
      }, {
        rotationX: 0,
        y: 0,
        scale: 1,
        "--shine": config.shine.to,
        // The POC's smoothstep, without spring motion or an opacity reveal.
        ease: (progress: number) => progress * progress * (3 - 2 * progress),
        scrollTrigger: {
          trigger: stage,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          invalidateOnRefresh: true,
        },
      })
    }, stage)

    let alive = true
    let refreshFrame = 0
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => { if (alive) ScrollTrigger.refresh() })
    }
    const resize = new ResizeObserver(refresh)
    resize.observe(stage)
    void document.fonts.ready.then(() => { if (alive) refresh() })

    return () => {
      alive = false
      cancelAnimationFrame(refreshFrame)
      resize.disconnect()
      media.revert()
    }
  }, [])

  return (
    <div ref={stageRef} className={styles.stage} data-resin-stage role="group" aria-label={`Aperçu de la galerie ${brand}`}>
      <div ref={deviceRef} className={styles.device} data-resin-device>
        <div className={styles.screen} data-resin-screen>
          <div className={styles.nav} aria-hidden="true">
            <span className={styles.brand}>{brand}</span>
            <div className={styles.links}><span>Prints</span><span>Collections</span><span>About</span><span>Cart (0)</span></div>
          </div>
          <div className={styles.prints}>
            {artworks.map(artwork => (
              <div className={styles.print} key={artwork.src}>
                <div className={styles.wood}>
                  <div className={styles.mat}>
                    <Image
                      {...artwork}
                      quality={95}
                      sizes="(max-width: 639px) 26vw, (max-width: 899px) 160px, (max-width: 1376px) 15vw, 200px"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.frameViewport} aria-hidden="true">
          <Image
            className={styles.frame}
            src="/images/realisations/french-pixel/resin-monitor.png"
            width={1536}
            height={1024}
            alt=""
            unoptimized
            draggable={false}
            data-resin-frame
          />
        </div>
        <div ref={reflectionRef} className={styles.reflection} data-resin-reflection aria-hidden="true" />
      </div>
    </div>
  )
}
