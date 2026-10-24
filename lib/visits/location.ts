import { isIP } from "node:net"

export type VisitLocation = {
  ip: string | null
  city: string | null
  region: string | null
  country: string | null
  postalCode: string | null
  latitude: number | null
  longitude: number | null
}

function headerText(headers: Headers, name: string): string | null {
  const value = headers.get(name)
  if (!value || value.length > 512) return null
  try {
    // Vercel URL-encodes non-ASCII city names. Keep values plain text for email.
    return decodeURIComponent(value).replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 120) || null
  } catch {
    return null
  }
}

function coordinate(value: string | null, maximum: number): number | null {
  if (!value || !/^-?\d+(\.\d+)?$/.test(value)) return null
  const number = Number(value)
  return Number.isFinite(number) && Math.abs(number) <= maximum ? number : null
}

/** Called only behind the production Vercel gate; no client-supplied location. */
export function getVisitLocation(headers: Headers): VisitLocation {
  // Prefer Vercel's forwarding header; do not use arbitrary client-IP headers.
  const candidate = (headers.get("x-vercel-forwarded-for")
    || headers.get("x-real-ip") || headers.get("x-forwarded-for"))?.split(",")[0]?.trim()
  const countryCode = headerText(headers, "x-vercel-ip-country")?.toUpperCase()
  const country = countryCode && /^[A-Z]{2}$/.test(countryCode)
    ? new Intl.DisplayNames(["fr"], { type: "region" }).of(countryCode) ?? countryCode
    : null

  return {
    ip: candidate && isIP(candidate) ? candidate : null,
    city: headerText(headers, "x-vercel-ip-city"),
    region: headerText(headers, "x-vercel-ip-country-region"),
    country,
    postalCode: headerText(headers, "x-vercel-ip-postal-code"),
    latitude: coordinate(headerText(headers, "x-vercel-ip-latitude"), 90),
    longitude: coordinate(headerText(headers, "x-vercel-ip-longitude"), 180),
  }
}
