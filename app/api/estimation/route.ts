import { NextRequest, NextResponse } from "next/server"
import { isEmail } from "@/lib/contact-form"
import { estimationConfirmationEmail, estimationNotificationEmail } from "@/lib/email/estimation"
import { parseEstimateSubmission } from "@/lib/estimation/schema"
import { getEstimationCopy } from "@/lib/estimation/copy"
import { sendMailjet } from "@/lib/mailjet"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const adminEmail = process.env.MAIL_USERNAME
  if (!process.env.MAIL_MJ_API_KEY_PUBLIC || !process.env.MAIL_MJ_API_KEY_PRIVATE || !adminEmail || !isEmail(adminEmail)) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }
  const text = await request.text().catch(() => "")
  if (text.length > 32000) return NextResponse.json({ error: "invalid" }, { status: 413 })
  let body: unknown
  try { body = JSON.parse(text) } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }) }
  if (body && typeof body === "object" && "website" in body && body.website) {
    return NextResponse.json({ ok: true, confirmationSent: true })
  }
  const submission = parseEstimateSubmission(body)
  if (!submission) return NextResponse.json({ error: "invalid" }, { status: 400 })

  try {
    const copy = await getEstimationCopy(submission.locale)
    const sentAt = new Date().toISOString()
    await sendMailjet({
      to: adminEmail,
      replyTo: submission.email,
      ...estimationNotificationEmail(submission, copy, sentAt),
    })

    // A confirmation failure must not cause a duplicate request to the studio.
    let confirmationSent = true
    try {
      await sendMailjet({ to: submission.email, ...estimationConfirmationEmail(submission, copy) })
    } catch (error) {
      confirmationSent = false
      console.error("Estimate confirmation:", error instanceof Error ? error.message : "Send failed")
    }
    return NextResponse.json({ ok: true, confirmationSent })
  } catch (error) {
    console.error("Estimate notification:", error instanceof Error ? error.message : "Send failed")
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }
}
