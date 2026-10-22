import { NextRequest, NextResponse } from "next/server"
import { isEmail } from "@/lib/contact-form"
import { parseEstimateSubmission } from "@/lib/estimation/schema"
import { getEstimationCopy } from "@/lib/estimation/copy"
import { estimateEmailBody } from "@/lib/estimation/summary"
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
    const summary = estimateEmailBody(submission, copy)
    const sentAt = new Date().toISOString()
    await sendMailjet(
      adminEmail,
      copy.email.subject + " — " + submission.firstName,
      summary + "\n" + copy.status.language + " : " + submission.locale + "\nSource : " + (submission.source || "general") + "\n" + copy.email.sentAt + " : " + sentAt,
      submission.email,
    )

    // A confirmation failure must not cause a duplicate request to the studio.
    let confirmationSent = true
    try {
      await sendMailjet(
        submission.email,
        copy.email.confirmation,
        copy.email.greeting + " " + submission.firstName + ",\n\n" + copy.email.body + "\n\n" + summary + "\n" + copy.email.closing,
      )
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
