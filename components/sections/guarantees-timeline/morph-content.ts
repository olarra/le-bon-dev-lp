// Master paths from the satin resin assets, all in the same 600 × 420 viewBox.
// Their shared material is rendered inline by GuaranteeBlob.
export const MORPH_BLOBS = [
  "M300 64 C390 38 449 106 466 195 C486 289 419 343 313 350 C209 372 129 329 122 246 C99 152 200 95 300 64 Z",
  "M300 62 C402 60 452 109 451 204 C450 300 405 351 306 348 C207 351 140 309 144 218 C146 124 196 65 300 62 Z",
  "M302 60 C376 70 399 140 440 208 C492 295 400 351 303 348 C213 346 123 323 149 235 C181 162 195 45 302 60 Z",
] as const

// Lime for budget, eucalyptus for follow-up, sage for handover.
// Only these base colours blend during the morph; the satin lighting is fixed.
export const MORPH_PALETTES = [
  ["#e1efb5", "#cbdc92", "#bad078", "#95b25f"],
  ["#cbe6df", "#a8cfc4", "#94c1b5", "#74a395"],
  ["#d7e5cf", "#b9d1aa", "#a4bf94", "#819f74"],
] as const

export const ILLUSTRATION_SCALES = [0.98, 0.88, 0.90] as const
