"use client"

import { useEffect, useRef, type RefObject } from "react"

export type ScrollPathBox = { x: number; y: number; width: number; height: number }
export type ScrollPathLayout = {
  width: number
  height: number
  anchors: ScrollPathBox[]
  compact: boolean
}

type Props = {
  containerRef: RefObject<HTMLElement | null>
  anchors: readonly RefObject<HTMLElement | null>[]
  buildPath: (layout: ScrollPathLayout) => string
  fallback: { viewBox: string; desktop: string; mobile: string }
  className?: string
}

const DRAW = { viewportLine: 0.73, samples: 500, compactQuery: "(max-width: 899px)" } as const

/** The POC's line-following effect: the tip follows a viewport reading line.
 * Measure SVG geometry only on resize; scrolling updates only its dash offset.
 * Both fallback paths are complete before JS and with reduced motion. */
export function SvgFollowScroll({ containerRef, anchors, buildPath, fallback, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wideRef = useRef<SVGPathElement>(null)
  const narrowRef = useRef<SVGPathElement>(null)

  // Parent/anchor refs must be attached before this child's effect runs.
  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    const wide = wideRef.current
    const narrow = narrowRef.current
    if (!container || !svg || !wide || !narrow) return
    const compact = window.matchMedia(DRAW.compactQuery)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let active = wide
    let length = 0
    let sampledY: number[] = []
    let scrollFrame = 0
    let measureFrame = 0
    let disposed = false

    const draw = () => {
      scrollFrame = 0
      if (reduced.matches) {
        wide.style.strokeDashoffset = "0"
        narrow.style.strokeDashoffset = "0"
        return
      }
      const y = window.innerHeight * DRAW.viewportLine - container.getBoundingClientRect().top
      // The layout paths descend monotonically, so a binary search is enough.
      let low = 0
      let high = sampledY.length
      while (low < high) {
        const mid = (low + high) >>> 1
        if (sampledY[mid] <= y) low = mid + 1
        else high = mid
      }
      const progress = Math.max(0, low - 1) / DRAW.samples
      active.style.strokeDashoffset = `${length * (1 - progress)}`
    }

    const measure = () => {
      measureFrame = 0
      const root = container.getBoundingClientRect()
      const boxes = anchors.flatMap(ref => {
        const box = ref.current?.getBoundingClientRect()
        return box ? [{ x: box.left - root.left, y: box.top - root.top, width: box.width, height: box.height }] : []
      })
      if (boxes.length !== anchors.length || !root.width || !root.height) return
      const layout = { width: root.width, height: root.height, anchors: boxes }
      svg.setAttribute("viewBox", `0 0 ${root.width} ${root.height}`)
      wide.setAttribute("d", buildPath({ ...layout, compact: false }))
      narrow.setAttribute("d", buildPath({ ...layout, compact: true }))
      active = compact.matches ? narrow : wide
      length = active.getTotalLength()
      active.style.strokeDasharray = `${length} ${length}`
      sampledY = Array.from({ length: DRAW.samples + 1 }, (_, i) => active.getPointAtLength(length * i / DRAW.samples).y)
      draw()
    }
    const requestMeasure = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure)
    }
    const requestDraw = () => {
      if (!reduced.matches && !scrollFrame) scrollFrame = requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(requestMeasure)
    observer.observe(container)
    anchors.forEach(ref => { if (ref.current) observer.observe(ref.current) })
    window.addEventListener("scroll", requestDraw, { passive: true })
    window.addEventListener("resize", requestMeasure)
    compact.addEventListener("change", requestMeasure)
    reduced.addEventListener("change", draw)
    void document.fonts.ready.then(() => { if (!disposed) requestMeasure() })
    measure()

    return () => {
      disposed = true
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(measureFrame)
      observer.disconnect()
      window.removeEventListener("scroll", requestDraw)
      window.removeEventListener("resize", requestMeasure)
      compact.removeEventListener("change", requestMeasure)
      reduced.removeEventListener("change", draw)
    }
  }, [containerRef, anchors, buildPath])

  return (
    <svg ref={svgRef} className={className} viewBox={fallback.viewBox} preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <path ref={wideRef} d={fallback.desktop} data-scroll-line="desktop" vectorEffect="non-scaling-stroke" />
      <path ref={narrowRef} d={fallback.mobile} data-scroll-line="mobile" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
