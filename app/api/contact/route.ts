import { NextRequest, NextResponse } from "next/server"
import { isEmail, parseContactSubmission } from "@/lib/contact-form"
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
  const { name, email, company, phone, project, message, locale } = submission

  try {
    const { contact } = await getDictionary(locale)

    // Notify the studio; replying to this email reaches the visitor.
    await sendMailjet(
      adminEmail,
      `Prise de contact — ${name}`,
      `Nom : ${name}\nE-mail : ${email}\nEntreprise : ${company || "—"}\nTéléphone : ${phone || "—"}\nProjet : ${contact.form.projectTypes[project]}\nLangue : ${locale}\n\n${message}`,
      email,
    )

    // Confirm in the visitor's language. A failed confirmation must not
    // invite a second submission of a request the studio already received.
    let confirmationSent = true
    try {
      await sendMailjet(
        email,
        contact.confirmation.subject,
        `${contact.confirmation.greeting} ${name},\n\n${contact.confirmation.body}\n\n${contact.confirmation.closing}`,
      )
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
