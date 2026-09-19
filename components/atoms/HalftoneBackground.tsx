"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)
      setSize((previous) => previous.width === width && previous.height === height ? previous : { width, height })
    })
    observer.observe(layer)
    return () => observer.disconnect()
  }, [])

  const field = size.width < 810 ? mobile : desktop
  const dots = useMemo(() => buildDots(size, field), [size, field])

  return (
    <div ref={layerRef} className={[styles.layer, className].filter(Boolean).join(" ")} style={{ color }} aria-hidden="true">
      {/* No viewBox scaling: one SVG unit is one CSS pixel on every screen. */}
      <svg className={styles.field} width="100%" height="100%" focusable="false">
        <g fill="currentColor">
          {dots.map((dot) => (
            <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.radius} opacity={dot.opacity} />
          ))}
        </g>
      </svg>
    </div>
  )
}
