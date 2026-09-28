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
