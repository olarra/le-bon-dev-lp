import { useId } from "react"

export type HandArrowShape = {
  /** Path from the note's side to the pointing end. */
  d: string
  /**
   * Authored coordinate box. Keep its aspect ratio equal to the CSS box the
   * arrow is given, so the curve scales uniformly and nothing distorts.
   */
  viewBox: string
}

/**
 * Hand-drawn style arrow: one curved stroke with an open arrowhead added as
 * an SVG marker, so the head automatically follows the curve's direction at
 * its end (orient="auto") - only the path needs authoring. Colour comes from
 * CSS `color` via currentColor. The marker id is unique per instance (useId)
 * since several arrows share the page.
 */
export function HandArrow({ shape, className }: { shape: HandArrowShape; className?: string }) {
  const markerId = `hand-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  return (
    <svg className={className} viewBox={shape.viewBox} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="7.5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M2 1.5 8 5 2 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </marker>
      </defs>
      <path
        d={shape.d}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  )
}
