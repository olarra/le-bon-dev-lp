import { useId } from "react"

const SHAPES = {
  open: "M926.31 39.9769C873.007 -13.3256 786.58 -13.3256 733.273 39.9769L385.922 387.332L39.9793 733.283C-13.3264 786.585 -13.3264 873.012 39.9793 926.319L734.694 1621.03C788.001 1674.34 874.424 1674.34 927.731 1621.03L1178.57 1370.2C1231.87 1316.89 1231.87 1230.46 1178.57 1177.16L831.367 829.959L1177.31 484.017C1230.62 430.711 1230.62 344.287 1177.31 290.981L926.31 39.9769Z",
  close: "M292.236 39.9769C345.543 -13.3256 431.966 -13.3256 485.273 39.9769L832.624 387.332H832.62L1178.57 733.283C1231.87 786.585 1231.87 873.012 1178.57 926.319L483.851 1621.03C430.549 1674.34 344.122 1674.34 290.815 1621.03L39.9799 1370.2C-13.3266 1316.89 -13.3266 1230.46 39.9799 1177.16L387.179 829.959L41.2364 484.017C-12.0661 430.711 -12.0661 344.287 41.2364 290.981L292.236 39.9769Z",
} as const

/** Shared hero and offer-label bracket, with a unique gradient per instance. */
export function BrandBracket({ side, className }: { side: keyof typeof SHAPES; className?: string }) {
  const gradientId = `brand-bracket-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const opening = side === "open"
  return (
    <svg className={className} width="35" height="48" viewBox="0 0 1219 1661" fill="none" aria-hidden="true" focusable="false">
      <path d={SHAPES[side]} fill={`url(#${gradientId})`} />
      <defs>
        <linearGradient
          id={gradientId}
          x1={opening ? "453.364" : "765.182"}
          y1="830.313"
          x2={opening ? "1139.87" : "78.6771"}
          y2="830.313"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--hero-bracket-dark, #183c2d)" />
          <stop offset="0.793711" stopColor="var(--hero-bracket-light, #4f7751)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
