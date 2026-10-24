"use client"

import { useEffect, useRef } from "react"
import styles from "./HalftoneBackground.module.css"

type Ellipse = {
  /** Centre and spread in fractions of the full layer's width/height. */
  x: number
  y: number
  spreadX: number
  spreadY: number
  strength: number
}

export type HalftoneField = {
  /** Spacing and radii are CSS pixels, independent of the viewport ratio. */
  spacing: number
  maxRadius: number
  maxOpacity: number
  zones: readonly Ellipse[]
  clearZone: Ellipse
}

export type Size = { width: number; height: number }
export type Dot = { x: number; y: number; radius: number; opacity: number }

// Keep the finer desktop grid while still bounding the SVG on large screens.
const MAX_CIRCLES = 6000

function gaussian(x: number, y: number, zone: Ellipse): number {
  return zone.strength * Math.exp(-0.5 * (((x - zone.x) / zone.spreadX) ** 2 + ((y - zone.y) / zone.spreadY) ** 2))
}

function smoothstep(start: number, end: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)))
  return t * t * (3 - 2 * t)
}

/** Shared with ShimmerHalftone, so the animated variant keeps the exact same composition. */
export function buildDots({ width, height }: Size, field: HalftoneField): Dot[] {
  if (!width || !height) return []

  let spacing = field.spacing
  while (Math.ceil(width / spacing) * Math.ceil(height / spacing) > MAX_CIRCLES) spacing += 1

  const dots: Dot[] = []
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      const nx = x / width
      const ny = y / height
      // Smooth union stays within [0, 1] without clipping overlapping peaks.
      const density = 1 - field.zones.reduce((remaining, zone) => remaining * (1 - gaussian(nx, ny, zone)), 1)
      // Protect the central text while allowing stronger outer shoulders.
      const clearance = (1 - gaussian(nx, ny, field.clearZone)) ** 1.5
      const edgeFade = smoothstep(0, 0.16, ny) * (1 - smoothstep(0.74, 1, ny))
      const intensity = density * clearance * edgeFade
      // Retain tiny circles along the tails while letting their opacity recede.
      const radius = field.maxRadius * intensity ** 0.7
      const opacity = field.maxOpacity * intensity

      // Discard only subpixel, virtually transparent tails; no visible cutoff.
      if (radius < 0.04 && opacity < 0.003) continue
      dots.push({ x, y, radius, opacity })
    }
  }
  return dots
}

type Props = {
  color: string
  desktop: HalftoneField
  mobile: HalftoneField
  className?: string
}

/** One continuous field, measured only on resize: no mirrored/cropped panels. */
export function HalftoneBackground({ color, desktop, mobile, className }: Props) {
  const layerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const image = imageRef.current
    if (!layer || !image) return

    let disposed = false
    let width = 0
    let height = 0
    let currentUrl: string | null = null
    let pending: { url: string; image: HTMLImageElement } | null = null

    const cancelPending = () => {
      if (!pending) return
      pending.image.onload = null
      pending.image.onerror = null
      pending.image.removeAttribute("src")
      URL.revokeObjectURL(pending.url)
      pending = null
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width)
      const nextHeight = Math.round(entry.contentRect.height)
      if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return
      width = nextWidth
      height = nextHeight
      cancelPending()

      const field = width < 810 ? mobile : desktop
      const dots = buildDots({ width, height }, field)
      // Resolve currentColor here: an SVG image does not inherit page styles.
      const fill = getComputedStyle(layer).color
      // Keep every number at its original precision. Without a viewBox, one
      // SVG unit stays one CSS pixel, including at fractional layer sizes.
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><g fill="${fill}">${dots.map((dot) => `<circle cx="${dot.x}" cy="${dot.y}" r="${dot.radius}" opacity="${dot.opacity}"/>`).join("")}</g></svg>`
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
      const replacement = new Image()
      const request = { url, image: replacement }
      pending = request
      let decodeFailed = false
      const showReplacement = () => {
        if (disposed || pending !== request) return
        replacement.onload = null
        replacement.onerror = null
        const previousUrl = currentUrl
        image.src = url
        currentUrl = url
        pending = null
        if (previousUrl) URL.revokeObjectURL(previousUrl)
      }
      const discardReplacement = () => {
        if (pending !== request) return
        replacement.onload = null
        replacement.onerror = null
        URL.revokeObjectURL(url)
        pending = null
      }
      replacement.onload = () => { if (decodeFailed) showReplacement() }
      replacement.onerror = discardReplacement
      replacement.src = url

      // Decode offscreen before swapping sources so resizing never clears
      // the visible field while its replacement is being prepared. A loaded
      // SVG remains usable if the browser rejects the optional decode step.
      void replacement.decode().then(showReplacement).catch(() => {
        decodeFailed = true
        if (replacement.complete) {
          if (replacement.naturalWidth > 0) showReplacement()
          else discardReplacement()
        }
      })
    })
    observer.observe(layer)
    return () => {
      disposed = true
      observer.disconnect()
      cancelPending()
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [color, desktop, mobile])

  return (
    <div ref={layerRef} className={[styles.layer, className].filter(Boolean).join(" ")} style={{ color }} aria-hidden="true">
      {/* Runtime vector texture: one DOM node, with no raster size cap. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imageRef} className={styles.field} alt="" draggable={false} />
    </div>
  )
}
