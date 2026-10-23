import type { InlineEmailAttachment } from "./email/types"

type MailjetMessage = {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  inlineAttachments?: readonly InlineEmailAttachment[]
}

/** Mailjet v3.1 transport; templates and translations are owned by the site. */
export async function sendMailjet({ to, subject, text, html, replyTo, inlineAttachments }: MailjetMessage) {
  const pub = process.env.MAIL_MJ_API_KEY_PUBLIC
  const priv = process.env.MAIL_MJ_API_KEY_PRIVATE
  const sender = process.env.MAIL_USERNAME

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${pub}:${priv}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: sender, Name: "Le bon dev" },
          To: [{ Email: to }],
          ReplyTo: { Email: replyTo || sender },
          Subject: subject,
          TextPart: text,
          ...(html ? { HTMLPart: html } : {}),
          ...(inlineAttachments?.length ? {
            InlinedAttachments: inlineAttachments.map(attachment => ({
              ContentType: attachment.contentType,
              Filename: attachment.filename,
              ContentID: attachment.contentId,
              Base64Content: attachment.base64Content,
            })),
          } : {}),
        },
      ],
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`Mailjet ${response.status}`)
  const status = result?.Messages?.[0]?.Status
  if (status !== "success") throw new Error(`Mailjet message status: ${status}`)
}
