import type { ContactSubmission } from "@/lib/contact-form"
import { LANGUAGE_NAMES } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/types"
import { getEmailCopy } from "./copy"
import { formatEmailDate } from "./format"
import { nextStep, paragraph, recap, renderEmail, replyNote, signatureText } from "./layout"
import type { EmailContent, EmailRow } from "./types"

type ContactCopy = Dictionary["contact"]

export function contactConfirmationEmail(submission: ContactSubmission, contact: ContactCopy): EmailContent {
  const copy = getEmailCopy(submission.locale)
  const subject = contact.confirmation.subject
  const greeting = `${contact.confirmation.greeting} ${submission.name},`

  return {
    subject,
    text: [
      greeting,
      copy.contact.intro,
      copy.contact.nextResponse,
      `${copy.replyPrompt}\n${copy.replyInstruction}`,
      signatureText(submission.locale),
      copy.contact.footnote,
    ].join("\n\n"),
    ...renderEmail({
      locale: submission.locale,
      subject,
      eyebrow: copy.contact.eyebrow,
      title: copy.contact.title,
      preheader: copy.contact.preheader,
      body: paragraph(greeting, true)
        + paragraph(copy.contact.intro)
        + nextStep(copy.next, copy.contact.nextResponse)
        + replyNote(copy.replyPrompt, copy.replyInstruction),
      footnote: copy.contact.footnote,
    }),
  }
}

export function contactNotificationEmail(submission: ContactSubmission, contact: ContactCopy, sentAt: string): EmailContent {
  const copy = getEmailCopy(submission.locale)
  const subject = `${copy.contact.notificationSubject} — ${submission.name}`
  const rows: EmailRow[] = [
    { label: contact.form.name, value: submission.name },
    { label: contact.form.email, value: submission.email },
    { label: contact.form.company, value: submission.company || "—" },
    { label: contact.form.phone, value: submission.phone || "—" },
    { label: contact.form.project, value: contact.form.projectTypes[submission.project] },
    { label: contact.form.message, value: submission.message },
    { label: copy.language, value: LANGUAGE_NAMES[submission.locale] },
    { label: copy.receivedAt, value: formatEmailDate(sentAt, submission.locale) },
  ]

  return {
    subject,
    text: [
      copy.notificationIntro,
      ...rows.map(row => `${row.label} : ${row.value}`),
      copy.notificationReply,
      signatureText(submission.locale),
      copy.notificationFootnote,
    ].join("\n\n"),
    ...renderEmail({
      locale: submission.locale,
      subject,
      eyebrow: copy.contact.notificationEyebrow,
      title: copy.contact.notificationTitle,
      preheader: copy.notificationIntro,
      body: paragraph(copy.notificationIntro)
        + recap({ title: copy.contact.notificationRecap, rows })
        + paragraph(copy.notificationReply),
      footnote: copy.notificationFootnote,
    }),
  }
}
