import { EMAIL_ASSETS } from "./assets"

/** The configured public base serves the LWS artwork; an empty value keeps the CID fallback. */
export function getEmailAssetBaseUrl(): string | null {
  const value = process.env.MAIL_ASSET_BASE_URL?.trim()
  if (!value) return null
  const url = new URL(value)
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("MAIL_ASSET_BASE_URL must be an HTTPS base URL without credentials, query or fragment")
  }
  return url.href.replace(/\/+$/, "")
}

export function emailImageSource(contentId: string, baseUrl: string | null): string {
  const asset = EMAIL_ASSETS.find(item => item.contentId === contentId)
  if (!asset) throw new Error("Unknown email artwork")
  return baseUrl ? `${baseUrl}${asset.publicPath}` : `cid:${contentId}`
}
