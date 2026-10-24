import { checkRateLimit } from "@vercel/firewall"
import { checkBotId } from "botid/server"
import { NextRequest, NextResponse } from "next/server"
import { isEmail } from "@/lib/contact-form"
import { visitNotificationEmail } from "@/lib/email/visit"
import { sendMailjet } from "@/lib/mailjet"
import { SITE } from "@/lib/site"
import { getVisitPage, isAutomatedVisit, VISIT_RATE_LIMIT_ID } from "@/lib/visits/config"
import { visitNotificationsEnabled } from "@/lib/visits/server"
import { getVisitLocation } from "@/lib/visits/location"

export const runtime = "nodejs"
export const maxDuration = 30

function ignored() {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: NextRequest) {
  if (!visitNotificationsEnabled()) return ignored()

  // Fixed production origin, JSON-only POST, and no prefetch/cross-site requests.
  const headers = request.headers
  const fetchSite = headers.get("sec-fetch-site")
  if (headers.get("origin") !== SITE.url
    || (fetchSite !== null && fetchSite !== "same-origin")
    || !headers.get("content-type")?.toLowerCase().startsWith("application/json")
    || /prefetch|prerender/i.test(`${headers.get("purpose")} ${headers.get("sec-purpose")}`)
    || headers.get("dnt") === "1" || headers.get("sec-gpc") === "1"
    || isAutomatedVisit(headers.get("user-agent"))) return ignored()

  const adminEmail = process.env.MAIL_USERNAME
  if (!process.env.MAIL_MJ_API_KEY_PUBLIC || !process.env.MAIL_MJ_API_KEY_PRIVATE
    || !adminEmail || !isEmail(adminEmail)) {
    console.warn("Visit notification skipped: Mailjet is not configured.")
    return ignored()
  }

  // The client cannot choose a recipient, subject, URL or email body.
  if (Number(headers.get("content-length")) > 256) return ignored()
  const raw = await request.text().catch(() => "")
  if (!raw || raw.length > 256) return ignored()
  let body: unknown
  try { body = JSON.parse(raw) } catch { return ignored() }
  if (!body || typeof body !== "object" || !("path" in body) || Object.keys(body).length !== 1) return ignored()
  const page = getVisitPage(body.path)
  if (!page) return ignored()

  try {
    const verification = await checkBotId({ advancedOptions: { checkLevel: "basic" } })
    // "Good" crawlers and requests bypassing detection must not send emails either.
    if (!verification.isHuman || verification.isBot || verification.isVerifiedBot || verification.bypassed) return ignored()

    // Shared Vercel counter, not an in-memory counter lost on every cold start.
    const limit = await checkRateLimit(VISIT_RATE_LIMIT_ID, { request, timeout: 2_500 })
    if (limit.error) {
      console.warn(`Visit notification skipped: firewall ${limit.error}.`)
      return ignored()
    }
    if (limit.rateLimited) return ignored()

    await sendMailjet({
      to: adminEmail,
      ...visitNotificationEmail(page, new Date().toISOString(), getVisitLocation(headers)),
    })
  } catch {
    // Fail closed if bot detection/rate limiting is unavailable; no sensitive request logs.
    console.error("Visit notification failed: bot detection, rate limiting or delivery unavailable.")
  }

  return ignored()
}
