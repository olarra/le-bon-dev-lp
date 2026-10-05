"use client"

import Image from "next/image"
import { useMemo, useRef } from "react"
import { ResinCta } from "@/components/atoms/ResinCta"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { OfferIcon, OfferSticker } from "@/components/offer-icons"
import { SvgFollowScroll } from "@/components/ui/svg-follow-scroll"
import { useStickerMotion } from "@/hooks/use-sticker-motion"
import { FEATURE_FLAG_RESINE_ICON_ENABLED } from "@/lib/feature-flags"
import { HEADING_REVEAL } from "@/lib/motion"
import { FRENCH_PIXEL_GALLERY, PROJECT_IMAGES, type Realisation } from "./realisations.content"
import type { Dictionary } from "@/lib/i18n/types"
import { ResinGallery } from "./ResinGallery"
import { buildShowcaseThread, THREAD_COMPLETION, THREAD_FALLBACK } from "./showcase-thread"
import { useShowcaseMotion } from "./use-showcase-motion"
import { useShowcaseTheme } from "./use-showcase-theme"
import styles from "./showcase.module.css"

export function ShowcaseContent({ copy }: { copy: Dictionary["showcase"] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const phonesRef = useRef<HTMLDivElement>(null)
  const monitorRef = useRef<HTMLDivElement>(null)
  const anchors = useMemo(() => [phonesRef, monitorRef], [])
  useShowcaseTheme(sectionRef)
  useShowcaseMotion(sectionRef)
  useStickerMotion(sectionRef, { enabled: !FEATURE_FLAG_RESINE_ICON_ENABLED })

  return (
    <section ref={sectionRef} className={styles.section} id="realisations" aria-labelledby="realisations-title">
      <SvgFollowScroll containerRef={sectionRef} anchors={anchors} buildPath={buildShowcaseThread} fallback={THREAD_FALLBACK} completion={THREAD_COMPLETION} className={styles.thread} />
      <div className={styles.content}>
        <header className={styles.sectionHeader} data-reveal-group>
          <p className={styles.eyebrow} data-reveal>{copy.eyebrow}</p>
          <div className={styles.headingColor} data-project-heading>
            <AnimatedHeading
              as="h2"
              id="realisations-title"
              text={copy.titleLines.join(" ")}
              effect={HEADING_REVEAL}
              className={styles.titleWrapper}
              textClassName={styles.title}
            >
              {copy.titleLines[0]}<br />{" "}{copy.titleLines[1]}
            </AnimatedHeading>
          </div>
          <p className={styles.subtitle} data-reveal>{copy.subtitle}</p>
        </header>

        <article className={styles.project} aria-labelledby="miau-title" data-project="miau">
          <ProjectCopy project={copy.projects.miau} id="miau" copy={copy} />
          <div ref={phonesRef} className={styles.phoneVisual} data-miau-visual>
            <div className={styles.phoneGroup} data-phone-group>
              <div className={`${styles.phone} ${styles.mapPhone}`} data-phone="map" data-phone-side>
                <PhoneImage src={PROJECT_IMAGES.map} alt={copy.phones[0]} />
              </div>
              <div className={`${styles.phone} ${styles.authPhone}`} data-phone="auth">
                <PhoneImage src={PROJECT_IMAGES.auth} alt={copy.phones[1]} width={895} height={1757} />
              </div>
              <div className={`${styles.phone} ${styles.orionPhone}`} data-phone="orion" data-phone-side>
                <PhoneImage src={PROJECT_IMAGES.orion} alt={copy.phones[2]} />
              </div>
            </div>
          </div>
        </article>

        <article className={`${styles.project} ${styles.studioProject}`} aria-labelledby="french-pixel-studio-title" data-project="studio">
          <ProjectCopy project={copy.projects.studio} id="french-pixel-studio" copy={copy} />
          <div ref={monitorRef} className={styles.monitorVisual}>
            <ResinGallery
              brand={FRENCH_PIXEL_GALLERY.brand}
              artworks={FRENCH_PIXEL_GALLERY.artworks.map((artwork, index) => ({ ...artwork, alt: copy.artworks[index] }))}
              label={copy.gallery}
            />
          </div>
        </article>
      </div>
    </section>
  )
}

function PhoneImage({ src, alt, width = 740, height = 1458 }: { src: string; alt: string; width?: number; height?: number }) {
  return <Image src={src} alt={alt} width={width} height={height} quality={90} sizes="(max-width: 899px) 45vw, (max-width: 1376px) 29vw, 344px" draggable={false} />
}

function ProjectCopy({ project, id, copy }: { project: Realisation; id: string; copy: Dictionary["showcase"] }) {
  return (
    <div className={styles.copy} data-reveal={id === "miau" ? "left" : "right"}>
      <h3 className={styles.projectName} id={`${id}-title`}>{project.name}</h3>
      <p className={`${styles.hook} ${id === "miau" ? styles.gradientText : ""}`} data-miau-hook={id === "miau" ? "" : undefined}>
        {project.hook[0]}<br />{project.hook[1]}
      </p>
      <p className={styles.description}>{project.description}</p>
      <dl className={styles.meta}>
        <div><dt>{copy.context}</dt><dd>{project.context}</dd></div>
        <div>
          <dt>{copy.offer}</dt>
          <dd>
            {FEATURE_FLAG_RESINE_ICON_ENABLED ? (
              <OfferIcon kind={project.icon} size={40} disabled playOnView={false} playOnHover={false} />
            ) : (
              <OfferSticker kind={project.icon} className={styles.offerIcon} />
            )}
            {project.offer}
          </dd>
        </div>
      </dl>
      <ResinCta className={styles.cta} href={project.href} label={project.cta} newTab newTabLabel={copy.newTab} />
    </div>
  )
}
