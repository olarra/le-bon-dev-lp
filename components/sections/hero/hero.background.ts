import type { HalftoneField } from "@/components/atoms/HalftoneBackground"
import type { ShimmerSettings } from "@/components/atoms/ShimmerHalftone"

/**
 * Keep the designed dot composition still so the copy and CTA lead.
 * The radial ripple remains available by switching this to true.
 */
export const HERO_DOTS_ANIMATED = false

/**
 * The static SVG grid's one colour, used only when HERO_DOTS_ANIMATED is
 * false. The animated grid takes all its colours from --hero-dots-palette in
 * hero.module.css instead (its first stop is the resting grid).
 */
export const HERO_STATIC_DOT_COLOR = "#9dae11"

/**
 * Tuning for the animated grid: a wave travels through the designed dot
 * field, and each dot is coloured across a palette by the wave value at its
 * position, swelling a little in the crests. Colours live in hero.module.css
 * (.hero: --hero-dots-palette), not here.
 */
export const HERO_SHIMMER = {
  // One ripple at a time, emitted from the heading toward every edge.
  waveform: "radial",
  radial: {
    // Same seven-second rhythm on desktop and phone: both the travel and
    // the band widths scale with the stage, not a fixed pixel wavelength.
    duration: 7,
    frontWidth: 0.1,
    trailWidth: 0.34,
    displacement: 2.2,
  },
  // Linear waveform only: spacing between crests and travel speed in px/s.
  wavelength: 460,
  speed: 75,
  // linear only: 20deg = left to right with a slight downward tilt.
  angle: 20,
  // radial only: fractions of the stage; y 0.42 is about the heading's centre.
  origin: { x: 0.5, y: 0.42 },
  palette: "var(--hero-dots-palette)",
  // Linear/noise only. The radial ripple has its own front and trail envelope.
  baseShare: 0.6,
  contrast: 1,
  // A visible swell at the crest, settling back to the continuous base grid.
  variance: 0.5,
  opacityVariance: 0.15,
  // The density map's opacities (max 0.5 desktop / 0.4 phone) were tuned for
  // the soft static grid and washed the palette into pastel. Scale 2 lets
  // full-intensity dots reach 100%; gamma 0.5 keeps mid-field dots near-
  // opaque (intensity 0.25 → 50%), so colours stay saturated and the fade
  // toward the clear zone is carried mostly by dot size.
  opacityScale: 2,
  opacityGamma: 0.5,
  // noise waveform only.
  gain: 1.6,
  scale: 0.0035,
  fps: 30,
} as const satisfies ShimmerSettings

/**
 * Main art-direction controls. Positions/spreads are relative to the hero;
 * spacing/radius are pixels. Strength and opacity run from 0 to 1.
 * The colour palette lives in hero.module.css, independently of ticker tokens.
 */
export const HERO_HALFTONE = {
  desktop: {
    spacing: 15,
    maxRadius: 4.2,
    maxOpacity: 0.5,
    zones: [
      // Tall outer peaks carry the grid into the upper corners.
      { x: -0.03, y: 0.4, spreadX: 0.2, spreadY: 0.27, strength: 0.95 },
      { x: 1.03, y: 0.54, spreadX: 0.24, spreadY: 0.28, strength: 0.9 },
      // Overlapping shoulders descend inward to form one broad wave.
      { x: 0.23, y: 0.67, spreadX: 0.18, spreadY: 0.2, strength: 0.6 },
      { x: 0.79, y: 0.72, spreadX: 0.22, spreadY: 0.19, strength: 0.5 },
      { x: 0.51, y: 0.81, spreadX: 0.22, spreadY: 0.15, strength: 0.35 },
    ],
    clearZone: { x: 0.5, y: 0.3, spreadX: 0.3, spreadY: 0.32, strength: 0.995 },
  },
  mobile: {
    spacing: 11.5,
    maxRadius: 2.8,
    maxOpacity: 0.4,
    // Recompose around the smaller ticker, retaining texture at both edges.
    zones: [
      { x: -0.04, y: 0.48, spreadX: 0.29, spreadY: 0.24, strength: 0.94 },
      { x: 1.04, y: 0.62, spreadX: 0.36, spreadY: 0.27, strength: 0.88 },
      { x: 0.28, y: 0.76, spreadX: 0.25, spreadY: 0.17, strength: 0.38 },
      { x: 0.7, y: 0.81, spreadX: 0.3, spreadY: 0.17, strength: 0.32 },
    ],
    clearZone: { x: 0.5, y: 0.26, spreadX: 0.43, spreadY: 0.33, strength: 0.99 },
  },
} as const satisfies { desktop: HalftoneField; mobile: HalftoneField }
