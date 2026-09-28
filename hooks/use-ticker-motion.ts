"use client"

import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react"

const HOVER_EASE_MS = 240
const HOVER_SETTLE_EPSILON = 0.01

export type TickerMotionOptions = {
  svgPath: string
  viewBox: string
  totalItems: number
  speedPercentPerSecond?: number
  direction?: "normal" | "reverse"
  scale?: number
  itemWidth?: number
  itemGap?: number
  paused?: boolean
  pausedRef?: { readonly current: boolean }
}

/** Fit absolute M/C coordinate pairs to the container without stretching. */
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

function measurePathLength(d: string): number {
  if (typeof document === "undefined") return 0
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("d", d)
  return path.getTotalLength()
}

export function useTickerMotion({
  svgPath, viewBox, totalItems, speedPercentPerSecond = 5, direction = "normal",
  scale = 1, itemWidth, itemGap = 24, paused = false, pausedRef,
}: TickerMotionOptions) {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const width = el.clientWidth
      const height = el.clientHeight
      setSize(previous => previous.width === width && previous.height === height ? previous : { width, height })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const resolvedPath = useMemo(
    () => size.width && size.height ? resolvePath(svgPath, viewBox, size.width, size.height) : "",
    [svgPath, viewBox, size.width, size.height],
  )

  const pathLength = useMemo(
    () => (size.width && size.height ? measurePathLength(resolvedPath) : 0),
    [resolvedPath, size.width, size.height],
  )
  const stepPercent = useMemo(() => {
    const even = 100 / Math.max(1, totalItems)
    if (!itemWidth || !pathLength) return even
    return Math.max(even, (((itemWidth + itemGap) * scale) / pathLength) * 100)
  }, [totalItems, itemWidth, itemGap, scale, pathLength])
  const loopPercent = stepPercent * totalItems
  const baseOffset = useMotionValue(0)
  const directionSign = direction === "normal" ? 1 : -1
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
    if (!resolvedPath || reducedMotion || paused || pausedRef?.current) return
    const target = speedTargetRef.current
    let factor = speedFactorRef.current
    if (factor !== target) {
      factor += (target - factor) * (1 - Math.exp(-delta / HOVER_EASE_MS))
      if (Math.abs(target - factor) < HOVER_SETTLE_EPSILON) factor = target
      speedFactorRef.current = factor
    }
    if (factor === 0) return
    baseOffset.set(baseOffset.get() + directionSign * speedPercentPerSecond * factor * (delta / 1000))
  })

  return { containerRef, resolvedPath, stepPercent, loopPercent, baseOffset, hoverHandlers }
}
