"use client"

import { useRef } from "react"
import { useStickerMotion } from "@/hooks/use-sticker-motion"
import { FRENCH_PIXEL_GALLERY } from "./realisations.content"
import type { Dictionary } from "@/lib/i18n/types"
import { ResinGallery } from "./ResinGallery"
import { ProjectHeader } from "./ProjectHeader"
import { MiauPhones } from "./MiauPhones"
import { useShowcaseMotion } from "./use-showcase-motion"
import { useMiauReveal } from "./use-miau-reveal"
import { useFpsReveal } from "./use-fps-reveal"
import styles from "./showcase.module.css"

export function ShowcaseContent({ copy }: { copy: Dictionary["showcase"] }) {
  const sectionRef = useRef<HTMLElement>(null)
  useShowcaseMotion(sectionRef)
  useMiauReveal(sectionRef)
  useFpsReveal(sectionRef)
  useStickerMotion(sectionRef)

  return (
    <section ref={sectionRef} className={styles.section} id="realisations" aria-labelledby="realisations-title">
      <div className={styles.content}>
        <header className={styles.sectionHeader} data-showcase-heading>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 id="realisations-title" className={styles.title}>
            {copy.titleLines.join(" ").replace(/\.$/, "")}<span>.</span>
          </h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </header>

        <article className={styles.project} aria-labelledby="miau-title" data-project="miau">
          <ProjectHeader project={copy.projects.miau} id="miau" copy={copy}>
            <MiauPhones copy={copy} />
          </ProjectHeader>
        </article>

        <article className={`${styles.project} ${styles.studioProject}`} aria-labelledby="french-pixel-studio-title" data-project="studio">
          <ProjectHeader project={copy.projects.studio} id="french-pixel-studio" copy={copy}>
            <div className={styles.monitorVisual} data-monitor-visual>
              <div data-device-parallax="0.09">
                <ResinGallery
                  brand={FRENCH_PIXEL_GALLERY.brand}
                  url={copy.projects.studio.href}
                  artworks={FRENCH_PIXEL_GALLERY.artworks.map((artwork, index) => ({ ...artwork, alt: copy.artworks[index] }))}
                  label={copy.gallery}
                />
              </div>
            </div>
          </ProjectHeader>
        </article>
      </div>
    </section>
  )
}
