import { NextRequest, NextResponse } from "next/server"
import { isEmail, parseContactSubmission } from "@/lib/contact-form"
import { contactConfirmationEmail, contactNotificationEmail } from "@/lib/email/contact"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { sendMailjet } from "@/lib/mailjet"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const pub = process.env.MAIL_MJ_API_KEY_PUBLIC
  const priv = process.env.MAIL_MJ_API_KEY_PRIVATE
  const adminEmail = process.env.MAIL_USERNAME

  if (!pub || !priv || !adminEmail || !isEmail(adminEmail)) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }

  const body: unknown = await request.json().catch(() => null)
  if (body && typeof body === "object" && "website" in body && body.website) {
    return NextResponse.json({ ok: true })
  }

  const submission = parseContactSubmission(body)
  if (!submission) {
    return NextResponse.json({ error: "invalid" }, { status: 400 })
  }
  const { email, locale } = submission

  try {
    const { contact } = await getDictionary(locale)
    const sentAt = new Date().toISOString()

    // Notify the studio; replying to this email reaches the visitor.
    await sendMailjet({
      to: adminEmail,
      replyTo: email,
      ...contactNotificationEmail(submission, contact, sentAt),
    })

    // Confirm in the visitor's language. A failed confirmation must not
    // invite a second submission of a request the studio already received.
    let confirmationSent = true
    try {
      await sendMailjet({ to: email, ...contactConfirmationEmail(submission, contact) })
    } catch (error) {
      confirmationSent = false
      console.error("Mailjet confirmation:", error instanceof Error ? error.message : "Send failed")
    }

    return NextResponse.json({ ok: true, confirmationSent })
  } catch (error) {
    console.error("Mailjet notification:", error instanceof Error ? error.message : "Send failed")
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }
}
