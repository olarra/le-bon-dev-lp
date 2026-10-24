import type { EstimationCopy } from "@/lib/estimation/copy"
import type { EstimateSubmission } from "@/lib/estimation/schema"
import { estimateEmailBody, estimateSummary } from "@/lib/estimation/summary"
import { LANGUAGE_NAMES } from "@/lib/i18n/config"
import { getEmailCopy } from "./copy"
import { formatEmailDate } from "./format"
import { estimateNext, paragraph, recap, renderEmail, replyNote, signatureText } from "./layout"
import type { EmailContent, EmailRow } from "./types"

function contactRows(submission: EstimateSubmission, copy: EstimationCopy): EmailRow[] {
  const fields = ["firstName", "email", "company", "phone"] as const
  return fields.map(field => ({ label: copy.fields[field], value: submission[field] || "—" }))
}

function answerRows(submission: EstimateSubmission, copy: EstimationCopy): EmailRow[] {
  return estimateSummary(submission, copy, true).map(row => ({
    label: row.label,
    value: row.value || copy.status.unspecified,
  }))
}

export function estimationConfirmationEmail(submission: EstimateSubmission, estimation: EstimationCopy): EmailContent {
  const copy = getEmailCopy(submission.locale)
  const subject = estimation.email.confirmation
  const greeting = `${estimation.email.greeting} ${submission.firstName},`

  return {
    subject,
    text: [
      greeting,
      copy.estimate.intro,
      copy.estimate.nextResponse,
      estimateEmailBody(submission, estimation),
      `${copy.replyPrompt}\n${copy.replyInstruction}`,
      signatureText(submission.locale),
      copy.estimate.footnote,
    ].join("\n\n"),
    ...renderEmail({
      locale: submission.locale,
      subject,
      eyebrow: copy.estimate.eyebrow,
      title: copy.estimate.title,
      preheader: copy.estimate.preheader,
      body: paragraph(greeting, true)
        + paragraph(copy.estimate.intro)
        + estimateNext(copy.estimate.nextResponse)
        + recap({
          title: copy.recapTitle,
          subtitle: copy.recapSubtitle,
          rows: answerRows(submission, estimation),
          numbered: true,
          contact: { title: copy.contactDetails, rows: contactRows(submission, estimation) },
        })
        + replyNote(copy.replyPrompt, copy.replyInstruction),
      footnote: copy.estimate.footnote,
    }),
  }
}

export function estimationNotificationEmail(submission: EstimateSubmission, estimation: EstimationCopy, sentAt: string): EmailContent {
  const copy = getEmailCopy(submission.locale)
  const subject = `${estimation.email.subject} — ${submission.firstName}`
  const metadata: EmailRow[] = [
    { label: copy.language, value: LANGUAGE_NAMES[submission.locale] },
    { label: copy.source, value: submission.source ? `${estimation.types[submission.source].title} (${submission.source})` : copy.generalSource },
    { label: copy.receivedAt, value: formatEmailDate(sentAt, submission.locale) },
  ]

  return {
    subject,
    text: [
      copy.notificationIntro,
      estimateEmailBody(submission, estimation),
      ...metadata.map(row => `${row.label} : ${row.value}`),
      copy.notificationReply,
      copy.notificationFootnote,
    ].join("\n\n"),
    ...renderEmail({
      locale: submission.locale,
      subject,
      eyebrow: copy.estimate.notificationEyebrow,
      title: copy.estimate.notificationTitle,
      preheader: copy.notificationIntro,
      body: paragraph(copy.notificationIntro)
        + recap({
          title: estimation.groups.recap,
          rows: answerRows(submission, estimation),
          numbered: true,
          contact: { title: estimation.groups.contact, rows: [...contactRows(submission, estimation), ...metadata] },
        })
        + paragraph(copy.notificationReply),
      footnote: copy.notificationFootnote,
      audience: "studio",
    }),
  }
}
