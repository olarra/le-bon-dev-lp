"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap, type MotionValue } from "unframer"
import styles from "./Ticker.module.css"

export type TickerChild = { key: string; content: ReactNode }

/**
 * Time constant (ms) of the exponential ease the ribbon uses to slow to a
 * pause on hover and pick back up on leave: half the remaining speed gone
 * every ~166ms, visibly settled after roughly 0.7s - a glide, not a brake.
 */
const HOVER_EASE_MS = 240
/**
 * Below this fraction of full speed the ribbon snaps to fully stopped (or
 * fully running), so a hovered ticker actually idles instead of creeping
 * imperceptibly forever and updating every item each frame to do it.
 */
const HOVER_SETTLE_EPSILON = 0.01

type Props = {
  /** The curve's SVG path `d` and the viewBox it was authored in (Framer's Ticker "svg" prop). */
  svgPath: string
  viewBox: string
  children: TickerChild[]
  /** How many times each child repeats around the loop (Framer's "repeat" prop). */
  repeat?: number
  /** Percent of the path travelled per second (Framer's "speed.speed" prop: 5 = one full loop every 20s). */
  speedPercentPerSecond?: number
  direction?: "normal" | "reverse"
  /** Per-item scale (Framer's "scale.scale" prop: 1 on desktop/tablet, .6 on phone). */
  scale?: number
  /**
   * Rendered width of one item in px at scale 1. When given, items are never
   * placed closer along the curve than `itemWidth + itemGap` (both scaled by
   * `scale`): on a curve too short to hold every item at that spacing, the
   * surplus items wait off the end of the path and enter as others leave, so
   * the wave keeps the same card/gap proportions at every viewport width
   * instead of squeezing every item on and overlapping them. Omit to fall
   * back to the source's even distribution of all items around the loop.
   */
  itemWidth?: number
  /** Minimum gap between items in px at scale 1 (only used with `itemWidth`). */
  itemGap?: number
  className?: string
}

/**
 * Scales and centers an SVG path's coordinates to fit a container of the
 * given pixel size, the same "contain" fit the source computes at runtime
 * (uniform scale = min(width ratio, height ratio), centered on both axes).
 * Only rewrites absolute coordinate pairs, which is all this path uses
 * (M/C commands) — not a general SVG path parser.
 */
function resolvePath(d: string, viewBox: string, containerWidth: number, containerHeight: number): string {
  const [vbMinX, vbMinY, vbWidth, vbHeight] = viewBox.split(" ").map(Number)
  if (!containerWidth || !containerHeight || !vbWidth || !vbHeight) return d
  const scale = Math.min(containerWidth / vbWidth, containerHeight / vbHeight)
  const scaledWidth = vbWidth * scale
  const scaledHeight = vbHeight * scale
  const tx = (containerWidth - scaledWidth) / 2 - vbMinX * scale
  const ty = (containerHeight - scaledHeight) / 2 - vbMinY * scale
  return d.replace(/(-?[\d.]+)[,\s]+(-?[\d.]+)/g, (_match, x: string, y: string) => {
    const nx = Number.parseFloat(x) * scale + tx
    const ny = Number.parseFloat(y) * scale + ty
    return `${nx} ${ny}`
  })
}

/**
 * Length in px of an already scaled/centered path, via SVG geometry on a
 * detached element (no layout involved). 0 during SSR, which callers treat
 * as "unknown" and fall back to even distribution.
 */
function measurePathLength(d: string): number {
  if (typeof document === "undefined") return 0
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("d", d)
  return path.getTotalLength()
}

/**
 * Faithful recreation of the published page's own inline "Ticker" component:
 * items travel along a custom SVG curve via the native CSS `offset-path` /
 * `offset-distance` motion-path APIs, driven by a single, continuously
 * incrementing Framer Motion value (wrapped 0-100%), exactly as the source
 * does. Reverse-engineered from the page's own bundle
 * (bpadVW8emH4mj6vFMuTUA....mjs — its `Mt`/`Bt`/`Vt`/`Ut` functions), since
 * this component isn't one of the ones `unframer` can export: it's inlined
 * directly in the page rather than a standalone Smart Component module.
 */
export function Ticker({
  svgPath,
  viewBox,
  children,
  repeat = 2,
  speedPercentPerSecond = 5,
  direction = "normal",
  scale = 1,
  itemWidth,
  itemGap = 24,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const resolvedPath = useMemo(
    () => resolvePath(svgPath, viewBox, size.width, size.height),
    [svgPath, viewBox, size.width, size.height],
  )

  const items = useMemo(() => {
    const out: { key: string; content: ReactNode; itemIndex: number }[] = []
    for (let r = 0; r < repeat; r++) {
      children.forEach((child, i) => {
        out.push({ key: `${child.key}-${r}`, content: child.content, itemIndex: r * children.length + i })
      })
    }
    return out
  }, [children, repeat])

  const totalItems = items.length
  const pathLength = useMemo(
    () => (size.width && size.height ? measurePathLength(resolvedPath) : 0),
    [resolvedPath, size.width, size.height],
  )
  // Spacing between consecutive items, in percent of the path. Never tighter
  // than the source's even distribution; raised to the minimum pixel spacing
  // when the curve is too short for that, which makes the loop longer than
  // the path itself - the extra length is the off-path queue (see Props).
  const stepPercent = useMemo(() => {
    const even = 100 / totalItems
    if (!itemWidth || !pathLength) return even
    return Math.max(even, (((itemWidth + itemGap) * scale) / pathLength) * 100)
  }, [totalItems, itemWidth, itemGap, scale, pathLength])
  const loopPercent = stepPercent * totalItems
  const baseOffset = useMotionValue(0)
  const directionSign = direction === "normal" ? 1 : -1

  // Hovering anywhere on the ribbon eases the *whole* wave to a stop, and
  // leaving eases it back up - one shared speed multiplier, not a per-card
  // effect. Refs rather than state: the factor changes every frame while it
  // settles and nothing needs to re-render for it, so the only added
  // per-frame cost is one multiply inside the loop that was already running.
  // Touch pointers are ignored: there is no hover to "leave" on touch, so a
  // tap would otherwise park the ribbon until the next tap elsewhere.
  const speedTargetRef = useRef(1)
  const speedFactorRef = useRef(1)
  const setSpeedTarget = (event: ReactPointerEvent<HTMLDivElement>, target: number) => {
    if (event.pointerType !== "touch") speedTargetRef.current = target
  }
  const hoverHandlers = {
    onPointerEnter: (event: ReactPointerEvent<HTMLDivElement>) => setSpeedTarget(event, 0),
    onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => setSpeedTarget(event, 1),
  }

  useAnimationFrame((_time, delta) => {
    const target = speedTargetRef.current
    let factor = speedFactorRef.current
    if (factor !== target) {
      // Exponential approach: frame-rate independent (same curve at 60Hz and
      // 120Hz) and naturally decelerating, like friction, rather than a linear
      // ramp that stops with a visible kink.
      factor += (target - factor) * (1 - Math.exp(-delta / HOVER_EASE_MS))
      if (Math.abs(target - factor) < HOVER_SETTLE_EPSILON) factor = target
      speedFactorRef.current = factor
    }
    // Fully paused: skip the motion-value write, so none of the items'
    // derived transforms recompute or touch the DOM until the pointer leaves.
    if (factor === 0) return
    baseOffset.set(baseOffset.get() + directionSign * speedPercentPerSecond * factor * (delta / 1000))
  })

  if (!resolvedPath) {
    return <div ref={containerRef} className={[styles.viewport, className].filter(Boolean).join(" ")} {...hoverHandlers} />
  }

  return (
    <div ref={containerRef} className={[styles.viewport, className].filter(Boolean).join(" ")} {...hoverHandlers}>
      {items.map((item) => (
        <TickerItem key={item.key} baseOffset={baseOffset} itemIndex={item.itemIndex} stepPercent={stepPercent} loopPercent={loopPercent} path={resolvedPath} scale={scale}>
          {item.content}
        </TickerItem>
      ))}
    </div>
  )
}

function TickerItem({
  baseOffset,
  itemIndex,
  stepPercent,
  loopPercent,
  path,
  scale,
  children,
}: {
  baseOffset: MotionValue<number>
  itemIndex: number
  stepPercent: number
  loopPercent: number
  path: string
  scale: number
  children: ReactNode
}) {
  const phase = itemIndex * stepPercent
  // Position around the loop: 0-100 is on the path; anything above is the
  // off-path queue, parked invisibly at the path's end until it wraps back
  // to 0 and re-enters. With loopPercent === 100 this is exactly the source's
  // behaviour (every item always on the path, fading in over the first 10%
  // and out over the last 10%).
  const loopPosition = useTransform(baseOffset, (v) => wrap(0, loopPercent, v + phase))
  const opacity = useTransform(loopPosition, (p) => (p > 100 ? 0 : p < 10 ? p / 10 : p > 90 ? (100 - p) / 10 : 1))
  const offsetDistance = useTransform(loopPosition, (p) => `${Math.min(p, 100)}%`)

  return (
    <motion.div
      className={styles.item}
      style={
        {
          offsetPath: `path('${path}')`,
          offsetDistance,
          opacity,
          scale,
          position: "absolute",
          top: 0,
          left: 0,
        } as unknown as CSSProperties
      }
    >
      {children}
    </motion.div>
  )
}
