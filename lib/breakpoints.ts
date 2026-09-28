export const BREAKPOINTS = ["desktop", "tablet", "phone"] as const
export type Breakpoint = (typeof BREAKPOINTS)[number]

export const MEDIA_QUERIES: Record<Breakpoint, string> = {
  desktop: "(min-width: 1200px)",
  tablet: "(min-width: 810px) and (max-width: 1199.98px)",
  phone: "(max-width: 809.98px)",
}
