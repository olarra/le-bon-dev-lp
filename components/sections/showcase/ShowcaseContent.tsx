"use client"

import Image from "next/image"
import { useMemo, useRef } from "react"
import { AnimatedHeading } from "@/components/atoms/AnimatedHeading"
import { OfferIcon } from "@/components/offer-icons/OfferIcon"
import { SvgFollowScroll } from "@/components/ui/svg-follow-scroll"
import { SECTION_TITLE_EFFECT } from "@/components/sections/hero/hero.content"
import { FRENCH_PIXEL_GALLERY, PROJECT_IMAGES, REALISATIONS, type Realisation } from "./realisations.content"
import { ResinGallery } from "./ResinGallery"
import { buildShowcaseThread, THREAD_COMPLETION, THREAD_FALLBACK } from "./showcase-thread"
import { useShowcaseMotion } from "./use-showcase-motion"
import { useShowcaseTheme } from "./use-showcase-theme"
import styles from "./showcase.module.css"

export function ShowcaseContent() {
  const sectionRef = useRef<HTMLElement>(null)
  const phonesRef = useRef<HTMLDivElement>(null)
  const monitorRef = useRef<HTMLDivElement>(null)
  const anchors = useMemo(() => [phonesRef, monitorRef], [])
  useShowcaseTheme(sectionRef)
  useShowcaseMotion(sectionRef)

  return (
    <section ref={sectionRef} className={styles.section} id="realisations" aria-labelledby="realisations-title">
      <SvgFollowScroll containerRef={sectionRef} anchors={anchors} buildPath={buildShowcaseThread} fallback={THREAD_FALLBACK} completion={THREAD_COMPLETION} className={styles.thread} />
      <div className={styles.content}>
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Les réalisations</p>
          <div className={styles.headingColor} data-project-heading>
            <AnimatedHeading
              as="h2"
              id="realisations-title"
              text="Des idées devenues concrètes."
              effect={SECTION_TITLE_EFFECT}
              className={styles.titleWrapper}
              textClassName={styles.title}
            >
              Des idées<br />{" "}devenues concrètes.
            </AnimatedHeading>
          </div>
          <p className={styles.subtitle}>Deux projets, deux besoins. Découvrez ce qu’on a réalisé.</p>
        </header>

        <article className={styles.project} aria-labelledby="miau-title" data-project="miau">
          <ProjectCopy project={REALISATIONS.miau} id="miau" />
          <div ref={phonesRef} className={styles.phoneVisual} data-miau-visual>
            <div className={styles.phoneGroup} data-phone-group>
              <div className={`${styles.phone} ${styles.mapPhone}`} data-phone="map" data-phone-side>
                <PhoneImage src={PROJECT_IMAGES.map} alt="Miau : carte de Paris et chats à proximité, cadre sauge." />
              </div>
              <div className={`${styles.phone} ${styles.authPhone}`} data-phone="auth">
                <PhoneImage src={PROJECT_IMAGES.auth} alt="Écran de connexion Miau, au premier plan dans un cadre vert forêt." />
              </div>
              <div className={`${styles.phone} ${styles.orionPhone}`} data-phone="orion" data-phone-side>
                <PhoneImage src={PROJECT_IMAGES.orion} alt="Miau : fiche du chat Orion et contact du propriétaire, cadre lime." />
              </div>
            </div>
          </div>
        </article>

        <article className={`${styles.project} ${styles.studioProject}`} aria-labelledby="french-pixel-studio-title" data-project="studio">
          <div ref={monitorRef} className={styles.monitorVisual}>
            <ResinGallery {...FRENCH_PIXEL_GALLERY} />
          </div>
          <ProjectCopy project={REALISATIONS.studio} id="french-pixel-studio" />
        </article>
      </div>
      <noscript><style>{`#realisations [data-framer-component-type="RichTextContainer"], #realisations [data-framer-component-type="RichTextContainer"] * { opacity: 1 !important; transform: none !important; visibility: visible !important; }`}</style></noscript>
    </section>
  )
}

function PhoneImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={740} height={1458} quality={90} sizes="(max-width: 899px) 45vw, (max-width: 1376px) 29vw, 344px" draggable={false} />
}

function ProjectCopy({ project, id }: { project: Realisation; id: string }) {
  return (
    <div className={styles.copy}>
      <h3 className={styles.projectName} id={`${id}-title`}>{project.name}</h3>
      <p className={`${styles.hook} ${id === "miau" ? styles.gradientText : ""}`} data-miau-hook={id === "miau" ? "" : undefined}>
        {project.hook[0]}<br />{project.hook[1]}
      </p>
      <p className={styles.description}>{project.description}</p>
      <dl className={styles.meta}>
        <div><dt>Contexte</dt><dd>{project.context}</dd></div>
        <div>
          <dt>Offre</dt>
          <dd><OfferIcon kind={project.icon} size={40} disabled playOnView={false} playOnHover={false} />{project.offer}</dd>
        </div>
      </dl>
      {project.href ? (
        <a className={styles.cta} href={project.href}><span>{project.cta}<Arrow /></span></a>
      ) : (
        <button className={styles.cta} type="button" disabled><span>{project.cta}<Arrow /></span></button>
      )}
    </div>
  )
}

function Arrow() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
}
