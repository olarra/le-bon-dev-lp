// Master paths from the satin resin assets, all in the same 600 × 420 viewBox.
// Their shared material is rendered inline by GuaranteeBlob.
export const MORPH_BLOBS = [
  "M300 64 C390 38 449 106 466 195 C486 289 419 343 313 350 C209 372 129 329 122 246 C99 152 200 95 300 64 Z",
  "M300 62 C402 60 452 109 451 204 C450 300 405 351 306 348 C207 351 140 309 144 218 C146 124 196 65 300 62 Z",
  "M302 60 C376 70 399 140 440 208 C492 295 400 351 303 348 C213 346 123 323 149 235 C181 162 195 45 302 60 Z",
] as const

// Forest green, petrol blue and moss green, in reading order.
// Only the base colours blend with the shape; the foil light follows scroll.
export const MORPH_PALETTES = [
  ["#27614c", "#174b38", "#10382a", "#0a271d"],
  ["#2b526e", "#1b3d56", "#122c40", "#0b1e2e"],
  ["#486b2b", "#34521c", "#253d13", "#192b0c"],
] as const

export const ILLUSTRATION_SCALES = [0.98, 0.88, 0.90] as const
