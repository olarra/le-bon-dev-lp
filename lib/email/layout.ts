import { CONTACT } from "@/lib/contact"
import type { Locale } from "@/lib/i18n/config"
import { SITE } from "@/lib/site"
import { EMAIL_ASSETS } from "./assets"
import { getEmailCopy } from "./copy"
import { emailImageSource, getEmailAssetBaseUrl } from "./media"
import type { EmailRow, EmailTitle, RenderedEmail } from "./types"

const bodyFont = "'Outfit',Arial,Helvetica,sans-serif"
const headingFont = "'Morna','Outfit',Arial,Helvetica,sans-serif"
const monoFont = "'SFMono-Regular',Consolas,'Liberation Mono',monospace"
const forest = "#203e33"
const paper = "#fffef9"
const muted = "#4e5d52"

/** Submitted values are always text, never HTML or link destinations. */
export function escapeEmailText(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!)
}

function lines(value: string) {
  return escapeEmailText(value).replace(/\r\n|\r|\n/g, "<br>")
}

export function paragraph(value: string, greeting = false) {
  return `<p class="${greeting ? "email-greeting" : "email-copy"}" style="margin:0 0 18px;color:${greeting ? forest : muted};font-family:${bodyFont};font-size:${greeting ? 20 : 17}px;font-weight:${greeting ? 500 : 400};line-height:1.65;overflow-wrap:anywhere;word-break:break-word;">${lines(value)}</p>`
}

export function replyNote(prompt: string, instruction: string) {
  return `<p style="margin:0;color:${muted};font-family:${bodyFont};font-size:16px;line-height:1.65;">${lines(prompt)}<br><strong style="color:${forest};font-weight:500;">${lines(instruction)}</strong></p>`
}

export function nextStep(label: string, description: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:10px 0 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#c8f53e" style="background-color:#c8f53e;border-collapse:separate;border-radius:4px;"><tr><td class="next-step-content" style="padding:22px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle" style="padding:0;color:#10251c;">
        <p style="margin:0 0 8px;font-family:${monoFont};font-size:10px;line-height:1.4;letter-spacing:1px;">${escapeEmailText(label)}</p>
        <p class="next-step-heading" style="margin:0;font-family:${bodyFont};font-size:19px;font-weight:600;line-height:1.35;">${lines(description)}</p>
      </td>
      <td class="response-time" width="114" align="right" valign="middle" style="padding:0;color:#10251c;font-family:${bodyFont};font-size:39px;font-weight:600;line-height:1;letter-spacing:-2px;white-space:nowrap;">24<span style="font-size:25px;"> h</span></td>
    </tr></table></td></tr></table>
  </td></tr></table>`
}

export function estimateNext(description: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:3px solid #8aa61f;padding:0 0 0 18px;color:${muted};font-family:${bodyFont};font-size:16px;line-height:1.65;">${lines(description)}</td></tr></table>`
}

function detailRow(row: EmailRow, index: number, numbered: boolean) {
  const number = numbered ? String(index + 1).padStart(2, "0") + " / " : ""
  return `<tr><td style="padding:17px 22px;border-bottom:1px solid #e1e5da;">
    <p style="margin:0 0 6px;color:#687366;font-family:${monoFont};font-size:10px;line-height:1.5;letter-spacing:.8px;text-transform:uppercase;">${escapeEmailText(number + row.label)}</p>
    <p style="margin:0;color:${forest};font-family:${bodyFont};font-size:16px;line-height:1.55;overflow-wrap:anywhere;word-break:break-word;">${lines(row.value)}</p>
  </td></tr>`
}

export function recap({ title, subtitle, rows, numbered = false, contact }: {
  title: string
  subtitle?: string
  rows: readonly EmailRow[]
  numbered?: boolean
  contact?: { title: string; rows: readonly EmailRow[] }
}) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d6ddcf;border-radius:4px;">
      <tr><td bgcolor="#f0f2e8" style="padding:20px 22px;background-color:#f0f2e8;border-bottom:1px solid #d6ddcf;">
        <h2 style="margin:0;color:${forest};font-family:${bodyFont};font-size:22px;line-height:1.3;font-weight:600;">${escapeEmailText(title)}</h2>
        ${subtitle ? `<p style="margin:5px 0 0;color:#687366;font-family:${bodyFont};font-size:13px;line-height:1.6;">${escapeEmailText(subtitle)}</p>` : ""}
      </td></tr>
      ${rows.map((row, index) => detailRow(row, index, numbered)).join("")}
      ${contact ? `<tr><td bgcolor="#f8f8f1" style="padding:19px 22px;background-color:#f8f8f1;">
        <p style="margin:0 0 8px;color:#687366;font-family:${monoFont};font-size:10px;line-height:1.5;letter-spacing:.8px;text-transform:uppercase;">${escapeEmailText(contact.title)}</p>
        ${contact.rows.map(row => `<p style="margin:0 0 4px;color:${forest};font-family:${bodyFont};font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word;"><span style="color:#687366;">${escapeEmailText(row.label)} :</span> ${lines(row.value)}</p>`).join("")}
      </td></tr>` : ""}
    </table>
  </td></tr></table>`
}

export function signatureText(locale: Locale) {
  const copy = getEmailCopy(locale)
  return `${copy.signoff}\nJesús Garnica\n${copy.role}\n${CONTACT.email}\n${CONTACT.whatsapp}\n${SITE.url}/${locale}`
}

function signature(locale: Locale, assetBaseUrl: string | null) {
  const copy = getEmailCopy(locale)
  const phone = CONTACT.whatsapp.replace(/^(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6")
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-top:28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #d6ddcf;">
      <tr><td colspan="2" style="padding:26px 0 18px;color:${muted};font-family:${bodyFont};font-size:15px;line-height:1.6;">${escapeEmailText(copy.signoff)}</td></tr>
      <tr>
        <td width="76" valign="middle" style="padding-right:18px;"><img src="${escapeEmailText(emailImageSource("lebondev-mark-forest", assetBaseUrl))}" width="55" height="33" alt="" style="display:block;border:0;width:55px;height:auto;"></td>
        <td valign="middle">
          <p style="margin:0 0 2px;color:${forest};font-family:${bodyFont};font-size:19px;font-weight:600;line-height:1.4;">Jesús Garnica</p>
          <p style="margin:0;color:#687366;font-family:${bodyFont};font-size:13px;line-height:1.5;">${escapeEmailText(copy.role)}</p>
        </td>
      </tr>
      <tr><td colspan="2" style="padding-top:18px;color:${muted};font-family:${bodyFont};font-size:13px;line-height:1.8;">
        <a class="signature-contact" href="mailto:${escapeEmailText(CONTACT.email)}" style="color:${muted};text-decoration:none;">${escapeEmailText(CONTACT.email)}</a><span class="signature-separator" style="padding:0 10px;color:#9da795;"> / </span><a class="signature-contact" href="tel:${escapeEmailText(CONTACT.whatsapp)}" style="color:${muted};text-decoration:none;">${escapeEmailText(phone)}</a>
      </td></tr>
    </table>
  </td></tr></table>`
}

export function renderEmail({ locale, subject, eyebrow, title, preheader, body, footnote, withSignature = true }: {
  locale: Locale
  subject: string
  eyebrow: string
  title: EmailTitle
  preheader: string
  body: string
  footnote: string
  withSignature?: boolean
}): RenderedEmail {
  const copy = getEmailCopy(locale)
  const siteUrl = escapeEmailText(`${SITE.url}/${locale}`)
  const assetBaseUrl = getEmailAssetBaseUrl()
  const assetOrigin = escapeEmailText(assetBaseUrl ?? SITE.url)
  const html = `<!doctype html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeEmailText(subject)}</title>
  <!--[if !mso]><!-->
  <style>
    @font-face{font-family:Outfit;font-style:normal;font-weight:400;src:url('${assetOrigin}/fonts/outfit/Outfit-Regular.ttf') format('truetype');}
    @font-face{font-family:Outfit;font-style:normal;font-weight:500;src:url('${assetOrigin}/fonts/outfit/Outfit-Medium.ttf') format('truetype');}
    @font-face{font-family:Outfit;font-style:normal;font-weight:600;src:url('${assetOrigin}/fonts/outfit/Outfit-SemiBold.ttf') format('truetype');}
    @font-face{font-family:Morna;font-style:normal;font-weight:700;src:url('${assetOrigin}/fonts/morna/morna-bold.woff2') format('woff2');}
  </style>
  <!--<![endif]-->
  <style>
    body{margin:0!important;padding:0!important;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    table{border-collapse:collapse;}
    img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
    a[x-apple-data-detectors]{color:inherit!important;font:inherit!important;text-decoration:none!important;}
    @media only screen and (max-width:600px){
      .email-outer{padding:12px 8px!important;}
      .email-card{width:100%!important;}
      .email-hero{padding:27px 24px 30px!important;}
      .email-logo{width:159px!important;height:auto!important;}
      .email-masthead{font-size:8px!important;letter-spacing:.5px!important;}
      .email-title{font-size:34px!important;line-height:1.1!important;}
      .hero-rule{padding:24px 0!important;}
      .email-symbol{display:none!important;width:0!important;}
      .email-body{padding:28px 24px 30px!important;}
      .email-copy{font-size:16px!important;}
      .next-step-content{padding:20px 18px!important;}
      .next-step-heading{font-size:17px!important;}
      .response-time{width:87px!important;font-size:35px!important;}
      .signature-contact{display:block!important;}
      .signature-separator{display:none!important;}
      .email-footer{padding:20px 24px!important;}
      .footer-copy,.footer-link{display:block!important;width:100%!important;text-align:left!important;}
      .footer-link{padding:9px 0 0!important;}
    }
  </style>
  <!--[if mso]><style>body,table,td,p,h1,h2,a,span{font-family:Arial,Helvetica,sans-serif!important;}</style><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body bgcolor="#e8ebe5" style="margin:0;padding:0;background-color:#e8ebe5;color:#10251c;font-family:${bodyFont};">
  <div style="display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeEmailText(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e8ebe5"><tr><td class="email-outer" align="center" style="padding:32px 16px;">
    <!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
    <table class="email-card" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="${paper}" style="width:100%;max-width:640px;background-color:${paper};border:1px solid #dce1d7;border-collapse:separate;border-spacing:0;border-radius:5px;overflow:hidden;box-shadow:0 12px 44px #2633260c;">
      <tr><td height="5" bgcolor="#c8f53e" style="height:5px;background-color:#c8f53e;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td class="email-hero" bgcolor="#14271e" style="padding:36px 40px 40px;background-color:#14271e;color:${paper};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle"><a href="${siteUrl}" style="color:${paper};text-decoration:none;"><img class="email-logo" src="${escapeEmailText(emailImageSource("lebondev-wordmark", assetBaseUrl))}" alt="Le bon dev" width="184" height="30" style="display:block;width:184px;height:auto;border:0;color:${paper};font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;"></a></td>
          <td class="email-masthead" align="right" valign="middle" style="color:#b8c5b8;font-family:${monoFont};font-size:9px;line-height:1.8;letter-spacing:1px;">${escapeEmailText(copy.studio)}<br>${escapeEmailText(copy.webMobile)}</td>
        </tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="hero-rule" style="padding:28px 0 26px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#3b4e3e" style="height:1px;background-color:#3b4e3e;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr></table>
        <p style="margin:0 0 14px;color:#c0cec1;font-family:${monoFont};font-size:10px;line-height:1.5;letter-spacing:1.4px;text-transform:uppercase;">${escapeEmailText(eyebrow)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="bottom"><h1 class="email-title" style="margin:0;color:${paper};font-family:${headingFont};font-size:42px;font-weight:700;line-height:1.09;letter-spacing:-.035em;">${escapeEmailText(title.line)}<br>${escapeEmailText(title.prefix ?? "")}<span style="color:#c8f53e;">${escapeEmailText(title.highlight)}</span></h1></td>
          <td class="email-symbol" width="90" align="right" valign="bottom" style="padding:0 0 6px 14px;"><img src="${escapeEmailText(emailImageSource("lebondev-mark-lime", assetBaseUrl))}" alt="" width="76" height="46" style="display:block;width:76px;height:auto;border:0;opacity:.66;"></td>
        </tr></table>
      </td></tr>
      <tr><td class="email-body" bgcolor="${paper}" style="padding:36px 40px 38px;background-color:${paper};">${body}${withSignature ? signature(locale, assetBaseUrl) : ""}</td></tr>
      <tr><td class="email-footer" bgcolor="#f4f2ec" style="padding:21px 40px;background-color:#f4f2ec;border-top:1px solid #e0e3d9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td class="footer-copy" valign="middle" style="color:#687366;font-family:${bodyFont};font-size:11px;line-height:1.65;">${escapeEmailText(copy.tagline)}<br>${escapeEmailText(copy.description)}</td>
          <td class="footer-link" align="right" valign="middle" style="padding-left:16px;white-space:nowrap;"><a href="${siteUrl}" style="color:${forest};font-family:${bodyFont};font-size:12px;font-weight:500;text-decoration:none;">lebondev.fr&nbsp; <span aria-hidden="true">&#8599;&#65038;</span></a></td>
        </tr></table>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding:18px 12px 0;color:#687366;font-family:${bodyFont};font-size:11px;line-height:1.7;">${lines(footnote)}</td></tr></table>
    <!--[if mso]></td></tr></table><![endif]-->
  </td></tr></table>
</body>
</html>`

  return { html, inlineAttachments: EMAIL_ASSETS.filter(asset => html.includes(`cid:${asset.contentId}`)) }
}
