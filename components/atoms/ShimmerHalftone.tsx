"use client"

import { useEffect, useRef } from "react"
import { buildDots, type HalftoneField } from "./HalftoneBackground"
import styles from "./HalftoneBackground.module.css"

export type ShimmerWaveform = "radial" | "linear" | "noise"

export type ShimmerSettings = {
  /**
   * Shape of the wave that travels through the grid.
   * - "radial": one ripple expanding from `origin` to the edges.
   * - "linear": one straight front sweeping across, in the direction `angle`.
   * - "noise": drifting value noise (the Framer "Shimmer Grid" look); reads as
   *   independent patches pulsing rather than one coherent wave.
   */
  waveform: ShimmerWaveform
  /** linear: distance between two crests, in px. */
  wavelength: number
  /** linear: direction of travel in degrees; 0 = left to right, 90 = top to bottom. */
  angle: number
  /** radial: centre of the rings, as fractions of the stage's width/height. */
  origin: { x: number; y: number }
  /** Radial geometry scales with the distance from the origin to the farthest corner. */
  radial: {
    /** Seconds for a ripple to travel across the field and its tail to clear the edges. */
    duration: number
    /** Leading rise / trailing fade, as fractions of that corner distance. */
    frontWidth: number
    trailWidth: number
    /** Gentle outward movement at the crest, in px; dots settle back behind it. */
    displacement: number
  }
  /**
   * All colour stops, in one list: the first is the resting grid (the base,
   * outside the wave), the last is the crest. A comma-separated list of CSS
   * colours, or a `var()` pointing at a custom property that holds such a
   * list. One stop = a single-colour grid with size/opacity pulsing only.
   */
  palette: string
  /**
   * Linear/noise: share of the wave's range (0..1) that stays exactly the first stop, at
   * designed size and opacity: the "base grid". Only values above it run
   * through the palette and swell. Higher = narrower crest bands.
   */
  baseShare: number
  /** noise only: amplitude stretch (soft, tanh) so crests reach the extremes; ~1.6 is plenty. */
  gain: number
  /** Power curve on the wave: >1 narrows crests, <1 widens them. Linear/noise apply this before baseShare. */
  contrast: number
  /** How much dots in the wave swell at its crest, as a fraction of their designed size (0.35 = +35%). */
  variance: number
  /** How much dots in the wave brighten at its crest, as a fraction of their designed opacity. */
  opacityVariance: number
  /**
   * Opacity curve for the animated grid. The density map's opacity is
   * `maxOpacity × intensity`, tuned for the soft static grid; here it becomes
   * `min(1, maxOpacity × opacityScale × intensity^opacityGamma)`. A gamma
   * below 1 keeps mid-field dots near-opaque so their colours stay saturated
   * against the cream (the fade toward the clear zone is then carried mostly
   * by dot size), and a scale of 2 lets full-intensity dots reach 100%.
   */
  opacityScale: number
  opacityGamma: number
  /** linear: px per second. noise: phase units per second (pattern drifts speed/scale px per second). */
  speed: number
  /** noise only: spatial scale, one feature ≈ 1/scale px. */
  scale: number
  /** Redraw rate cap. */
  fps: number
}

type Props = {
  desktop: HalftoneField
  mobile: HalftoneField
  shimmer: ShimmerSettings
  /** Read every frame: when true, drawing is skipped (e.g. while the hero is being covered and blurred). */
  pausedRef?: { readonly current: boolean }
  className?: string
}

type Rgb = readonly [number, number, number]
type AnimatedDot = ReturnType<typeof buildDots>[number] & {
  distance: number
  directionX: number
  directionY: number
  baseAlpha: number
}

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

/**
 * 2D value noise in -1..1 (the same construction as the Framer "Shimmer
 * Grid" component): hashed lattice corners, smoothstep-blended.
 */
function valueNoise(x: number, y: number): number {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const hash = (ix: number, iy: number) => {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123
    return n - Math.floor(n)
  }
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash(i, j)
  const b = hash(i + 1, j)
  const c = hash(i, j + 1)
  const d = hash(i + 1, j + 1)
  const top = a + (b - a) * u
  const bottom = c + (d - c) * u
  return (top + (bottom - top) * v) * 2 - 1
}

/** Parses the normalised "rgb(r, g, b)" / "rgba(r, g, b, a)" form getComputedStyle returns. */
function parseRgb(input: string, fallback: Rgb): Rgb {
  const nums = input.match(/[\d.]+/g)
  return nums && nums.length >= 3 ? [Number(nums[0]), Number(nums[1]), Number(nums[2])] : fallback
}

/** Splits a CSS colour list on top-level commas only (rgb(1, 2, 3) stays whole). */
function splitColorList(list: string): string[] {
  const out: string[] = []
  let depth = 0
  let current = ""
  for (const ch of list) {
    if (ch === "(") depth++
    if (ch === ")") depth--
    if (ch === "," && depth === 0) {
      out.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  out.push(current)
  return out.map((s) => s.trim()).filter(Boolean)
}

/**
 * Animated variant of HalftoneBackground: the same designed density field
 * (positions, base radii and opacities come from the shared buildDots, so the
 * clear zone around the text and the edge fades are untouched), drawn on a
 * canvas with a wave travelling through it. Each dot's colour is sampled
 * from a palette by the wave value at its position; dots in a crest also
 * swell and brighten a little. A radial ripple has a defined leading edge
 * and a longer trailing fade, with a small outward nudge at the crest.
 * Linear sweeps and drifting noise remain available.
 *
 * Colours are read from CSS at layout time: the palette list is expanded from
 * its custom property and each stop is resolved through the canvas element's
 * own `color`, so `var()` values work.
 *
 * Cost: one wave evaluation and one arc fill per dot per frame, capped at
 * `fps`. The loop stops when the layer is off screen and skips drawing while
 * `pausedRef` is set; reduced-motion users get one static frame.
 */
export function ShimmerHalftone({ desktop, mobile, shimmer, pausedRef, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    // Only reached if a CSS colour can't be read at all.
    const fallback: Rgb = [145, 157, 86]
    let palette: Rgb[] = [fallback]
    let dots: AnimatedDot[] = []
    let field: HalftoneField = desktop
    let width = 0
    let height = 0
    /** Radial: cycle fraction. Linear: px travelled. Noise: noise units. */
    let phase = 0
    let last = 0
    let elapsed = 0
    let frame = 0
    let inView = true
    const minFrameMs = 1000 / Math.max(1, shimmer.fps)
    const contrast = Math.max(0.01, shimmer.contrast)
    const baseShare = Math.min(0.99, Math.max(0, shimmer.baseShare))
    const gain = Math.max(0.01, shimmer.gain)
    const wavelength = Math.max(1, shimmer.wavelength)
    const angle = (shimmer.angle * Math.PI) / 180
    const dirX = Math.cos(angle)
    const dirY = Math.sin(angle)
    const twoPi = Math.PI * 2
    let radialTravel = 1
    let frontWidth = 1
    let trailWidth = 1
    const radialDuration = Math.max(0.1, shimmer.radial.duration)

    /**
     * Resolves the palette: a var() list is expanded via the host's computed
     * custom property, and each stop is resolved through the canvas's own
     * `color`. The first stop is the resting grid's colour.
     */
    const resolvePalette = () => {
      let list = shimmer.palette.trim()
      const varName = list.match(/^var\((--[\w-]+)\)$/)?.[1]
      if (varName) list = getComputedStyle(host).getPropertyValue(varName).trim()
      const stops = splitColorList(list).map((stop) => {
        canvas.style.color = stop
        return parseRgb(getComputedStyle(canvas).color, fallback)
      })
      canvas.style.color = ""
      palette = stops.length ? stops : [fallback]
    }

    const sample = (t: number): Rgb => {
      if (palette.length === 1) return palette[0]
      const p = Math.min(palette.length - 1, Math.max(0, t * (palette.length - 1)))
      const i = Math.floor(p)
      const c0 = palette[i]
      const c1 = palette[Math.min(palette.length - 1, i + 1)]
      const f = p - i
      return [c0[0] + (c1[0] - c0[0]) * f, c0[1] + (c1[1] - c0[1]) * f, c0[2] + (c1[2] - c0[2]) * f]
    }

    /** Final envelope, from the resting grid (0) to the crest (1). */
    const waveAt = (dot: AnimatedDot): number => {
      if (reducedMotion.matches) return 0
      const { x, y } = dot
      let value: number
      switch (shimmer.waveform) {
        case "radial": {
          const crestRadius = phase * radialTravel
          const offset = dot.distance - crestRadius
          // A shorter leading rise makes the outward direction legible; the
          // longer wake settles gently back to the base grid. Outside this
          // one band, dots retain their designed size and resting colour.
          const span = offset >= 0 ? frontWidth : trailWidth
          // Grow the next ripple from rest so even the faint central dots
          // stay continuous when the previous ripple finishes its cycle.
          const emission = smoothstep(crestRadius / frontWidth)
          return Math.pow(emission * (1 - smoothstep(Math.abs(offset) / span)), contrast)
        }
        case "linear": {
          const p = x * dirX + y * dirY
          value = 0.5 + 0.5 * Math.sin((twoPi * (p - phase)) / wavelength)
          break
        }
        default: {
          // tanh, not a clamp: a clamp turns strong noise into flat plateaus
          // with sharp edges; tanh saturates smoothly.
          const s = shimmer.scale
          value = (Math.tanh(valueNoise(x * s + phase, y * s - phase * 0.7) * gain) + 1) * 0.5
        }
      }
      return smoothstep((Math.pow(value, contrast) - baseShare) / (1 - baseShare))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        const wave = waveAt(dot)
        const radius = dot.radius * (1 + shimmer.variance * wave)
        if (radius <= 0.05) continue
        const alpha = Math.min(1, dot.baseAlpha * (1 + shimmer.opacityVariance * wave))
        // Scale movement down in the soft tails around the heading so the
        // larger, visible dots carry the motion, preserving the clear zone.
        const displacement = shimmer.waveform === "radial"
          ? shimmer.radial.displacement * (dot.radius / field.maxRadius) * wave
          : 0
        const [r, g, b] = sample(wave)
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(dot.x + dot.directionX * displacement, dot.y + dot.directionY * displacement, radius, 0, twoPi)
        ctx.fill()
      }
    }

    const layout = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      // Capped: retina beyond 2x is invisible on soft dots and quadruples the fill cost.
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      resolvePalette()
      field = width < 810 ? mobile : desktop
      const originX = width * shimmer.origin.x
      const originY = height * shimmer.origin.y
      const reach = Math.hypot(Math.max(originX, width - originX), Math.max(originY, height - originY))
      frontWidth = Math.max(1, reach * shimmer.radial.frontWidth)
      trailWidth = Math.max(1, reach * shimmer.radial.trailWidth)
      // Wait for the tail to leave every corner before emitting the next ripple.
      radialTravel = reach + trailWidth
      const maxOpacity = field.maxOpacity || 1
      const gamma = Math.max(0.05, shimmer.opacityGamma)
      dots = buildDots({ width, height }, field).map((dot) => {
        const dx = dot.x - originX
        const dy = dot.y - originY
        const distance = Math.hypot(dx, dy)
        return {
          ...dot,
          distance,
          directionX: distance ? dx / distance : 0,
          directionY: distance ? dy / distance : 0,
          baseAlpha: maxOpacity * shimmer.opacityScale * Math.pow(dot.opacity / maxOpacity, gamma),
        }
      })
      draw()
    }

    const loop = (now: number) => {
      frame = 0
      if (!inView || reducedMotion.matches || document.hidden) return
      frame = requestAnimationFrame(loop)
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      if (pausedRef?.current) {
        // Hold the phase where it is, so resuming continues rather than jumps.
        elapsed = 0
        return
      }
      switch (shimmer.waveform) {
        case "radial":
          phase = (phase + dt / radialDuration) % 1
          break
        case "linear":
          phase = ((phase + shimmer.speed * dt) % wavelength + wavelength) % wavelength
          break
        default:
          phase += shimmer.speed * dt
      }
      // Keep the leftover time: resetting the clock on each draw can turn
      // a 30fps cap into an uneven 20fps cadence on a 60Hz display.
      elapsed += dt * 1000
      if (elapsed + 0.01 < minFrameMs) return
      elapsed = Math.max(0, elapsed - minFrameMs * Math.floor((elapsed + 0.01) / minFrameMs))
      draw()
    }
    const start = () => {
      if (frame || !inView || reducedMotion.matches || document.hidden) return
      last = performance.now()
      elapsed = 0
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }
    const syncPlayback = () => {
      stop()
      // A calm base grid, including when the OS preference changes live.
      if (reducedMotion.matches) draw()
      start()
    }

    layout()
    const resize = new ResizeObserver(layout)
    resize.observe(host)
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    visibility.observe(host)
    reducedMotion.addEventListener("change", syncPlayback)
    document.addEventListener("visibilitychange", syncPlayback)
    start()

    return () => {
      resize.disconnect()
      visibility.disconnect()
      reducedMotion.removeEventListener("change", syncPlayback)
      document.removeEventListener("visibilitychange", syncPlayback)
      stop()
    }
  }, [desktop, mobile, shimmer, pausedRef])

  return (
    <div ref={hostRef} className={[styles.layer, className].filter(Boolean).join(" ")} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.field} />
    </div>
  )
}
