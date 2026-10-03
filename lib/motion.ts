export type HeadingReveal = {
  startDelay: number
  threshold: number
  effect: { opacity: number; scale: number; rotateY: number }
  transition: { type: "spring"; bounce: number; delay: number; duration: number }
}

export const HEADING_REVEAL: HeadingReveal = {
  startDelay: 0,
  threshold: 0,
  effect: { opacity: 1, scale: 0, rotateY: 10 },
  transition: { type: "spring", bounce: 0.6, delay: 0.03, duration: 1.5 },
}

/** One-shot reading beats, independent of scroll speed after they start.
 * Distances live in app/globals.css: RevealController reads the rendered pose
 * directly, keeping the server and animation in sync at every breakpoint. */
export const SCROLL_REVEAL = {
  viewport: 0.68,
  phoneViewport: 0.72,
  duration: 1.1,
  ease: "power3.out",
  opacityDuration: 0.7,
  opacityEase: "power1.inOut",
  stagger: 0.12,
  maxStagger: 0.24,
  // Only nearby members of an explicit group may join the current beat.
  // Stacked content further down the page waits for its own reading position.
  groupReach: 0.16,
  phone: "(max-width: 809.98px)",
  tablet: "(min-width: 810px) and (max-width: 1199.98px)",
  desktop: "(min-width: 1200px)",
} as const

/** Separate footer entrance and parallax. Rise distances come from CSS;
 * both motions measure the stationary frame and leave the logo uncropped. */
export const FOOTER_WORDMARK = {
  heightRatio: 0.12,
  maxDistance: 24,
  scrub: 0.35,
  revealViewport: 0.85,
  revealDuration: 1.1,
} as const
