import type { HalftoneField } from "@/components/atoms/HalftoneBackground"

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
