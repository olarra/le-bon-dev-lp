import { LANGUAGE_NAMES } from "@/lib/i18n/config"
import { SITE } from "@/lib/site"
import type { VisitPage } from "@/lib/visits/config"
import type { VisitLocation } from "@/lib/visits/location"
import { EMAIL_ASSETS } from "./assets"
import { formatEmailDate } from "./format"
import { escapeEmailText } from "./layout"
import { emailImageSource, getEmailAssetBaseUrl } from "./media"
import { EMAIL_THEME } from "./theme"
import type { EmailContent, EmailRow } from "./types"

/** Compact internal alert, using the same artwork and brand as the forms. */
export function visitNotificationEmail(page: VisitPage, receivedAt: string, location: VisitLocation): EmailContent {
  const { bodyFont, headingFont, monoFont, forest, deepForest, paper, muted, lime, canvas, border } = EMAIL_THEME
  const pageName = page.kind === "estimation" ? "Estimation" : "Le studio"
  const place = [location.city, location.country].filter(Boolean).join(", ") || "Localisation indisponible"
  const subject = `Nouvelle visite — ${pageName} — Le bon dev`
  const date = formatEmailDate(receivedAt, "fr")
  const pageUrl = `${SITE.url}${page.path}`
  const coordinates = location.latitude !== null && location.longitude !== null
    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : null
  const mapUrl = coordinates
    ? `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=10/${location.latitude}/${location.longitude}`
    : null
  const geography: EmailRow[] = [
    { label: "Région (code)", value: location.region || "—" },
    { label: "Code postal", value: location.postalCode || "—" },
  ]
  const details: EmailRow[] = [
    { label: "Adresse IP", value: location.ip || "Non disponible" },
    { label: "Page", value: page.path },
    { label: "Langue", value: LANGUAGE_NAMES[page.locale] },
    ...(coordinates ? [{ label: "Coordonnées estimées", value: coordinates }] : []),
  ]
  const locationNote = "Localisation approximative issue de l’IP. Un VPN ou un relais réseau peut indiquer un autre lieu."
  const assetBaseUrl = getEmailAssetBaseUrl()
  const assetOrigin = escapeEmailText(assetBaseUrl ?? SITE.url)
  const wordmark = escapeEmailText(emailImageSource("lebondev-wordmark", assetBaseUrl))
  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
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
      .visit-outer{padding:16px 8px!important;}
      .visit-header{padding:22px!important;}
      .visit-body{padding:26px 22px 24px!important;}
      .visit-footer{padding:18px 22px!important;}
      .visit-logo{width:145px!important;}
      .visit-title{font-size:29px!important;}
      .visit-place{font-size:23px!important;}
      .visit-geography{display:block!important;width:100%!important;padding-bottom:8px!important;}
      .visit-label{width:105px!important;padding-right:12px!important;font-size:12px!important;}
    }
  </style>
  <!--[if mso]><style>body,table,td,p,h1,a,span{font-family:Arial,Helvetica,sans-serif!important;}</style><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body bgcolor="${canvas}" style="margin:0;padding:0;background-color:${canvas};color:${forest};font-family:${bodyFont};">
  <div style="display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeEmailText(`${place} · ${pageName} · ${date}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${canvas}"><tr><td class="visit-outer" align="center" style="padding:32px 16px;">
    <!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="${paper}" style="width:100%;max-width:560px;background-color:${paper};border:1px solid ${border};border-collapse:separate;border-spacing:0;border-radius:8px;overflow:hidden;">
      <tr><td height="4" bgcolor="${lime}" style="height:4px;background-color:${lime};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td class="visit-header" bgcolor="${deepForest}" style="padding:24px 32px;background-color:${deepForest};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle"><a href="${escapeEmailText(pageUrl)}" style="color:${paper};text-decoration:none;"><img class="visit-logo" src="${wordmark}" alt="Le bon dev" width="164" height="26" style="display:block;width:164px;height:auto;color:${paper};font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;"></a></td>
          <td align="right" valign="middle" style="color:${lime};font-family:${monoFont};font-size:10px;line-height:1.5;letter-spacing:1.4px;white-space:nowrap;">VISITE</td>
        </tr></table>
      </td></tr>
      <tr><td class="visit-body" style="padding:30px 32px 28px;">
        <h1 class="visit-title" style="margin:0 0 8px;color:${forest};font-family:${headingFont};font-size:32px;line-height:1.15;letter-spacing:-.8px;font-weight:700;">Nouvelle visite.</h1>
        <p style="margin:0 0 24px;color:${muted};font-family:${bodyFont};font-size:14px;line-height:1.6;">${escapeEmailText(date)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f4e9" style="background-color:#f1f4e9;border-collapse:separate;border-radius:5px;"><tr><td style="padding:20px;">
          <p style="margin:0 0 8px;color:${muted};font-family:${monoFont};font-size:10px;line-height:1.5;letter-spacing:1px;">LOCALISATION ESTIMÉE</p>
          <p class="visit-place" style="margin:0 0 16px;color:${forest};font-family:${bodyFont};font-size:25px;font-weight:600;line-height:1.3;overflow-wrap:anywhere;word-break:break-word;">${escapeEmailText(place)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            ${geography.map(row => `<td class="visit-geography" width="50%" valign="top" style="width:50%;padding-right:10px;font-family:${bodyFont};font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word;"><span style="color:${muted};font-size:11px;">${escapeEmailText(row.label)}</span><br><span style="color:${forest};font-weight:600;">${escapeEmailText(row.value)}</span></td>`).join("")}
          </tr></table>
        </td></tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;table-layout:fixed;">
          ${details.map(row => `<tr><td class="visit-label" width="155" valign="top" style="width:155px;padding:12px 20px 12px 0;border-bottom:1px solid ${border};color:${muted};font-family:${bodyFont};font-size:13px;line-height:1.6;">${escapeEmailText(row.label)}</td><td valign="top" style="padding:12px 0;border-bottom:1px solid ${border};color:${forest};font-family:${bodyFont};font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word;">${escapeEmailText(row.value)}</td></tr>`).join("")}
        </table>
        ${mapUrl ? `<p style="margin:16px 0 0;font-family:${bodyFont};font-size:13px;line-height:1.6;"><a href="${escapeEmailText(mapUrl)}" style="color:${forest};text-decoration:underline;text-underline-offset:3px;">Voir la zone sur la carte <span aria-hidden="true">&#8599;&#65038;</span></a></p>` : ""}
        <p style="margin:18px 0 0;color:${muted};font-family:${bodyFont};font-size:11px;line-height:1.65;">${escapeEmailText(locationNote)}</p>
      </td></tr>
      <tr><td class="visit-footer" bgcolor="#f4f2ec" style="padding:18px 32px;background-color:#f4f2ec;border-top:1px solid ${border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="color:${muted};font-family:${bodyFont};font-size:11px;line-height:1.6;">Notification privée du studio</td>
          <td align="right" style="padding-left:12px;font-family:${bodyFont};font-size:12px;line-height:1.6;"><a href="${escapeEmailText(pageUrl)}" style="color:${forest};font-weight:600;text-decoration:none;">${escapeEmailText(pageName)} <span aria-hidden="true">&#8599;&#65038;</span></a></td>
        </tr></table>
      </td></tr>
    </table>
    <!--[if mso]></td></tr></table><![endif]-->
  </td></tr></table>
</body>
</html>`

  return {
    subject,
    text: [
      "Nouvelle visite sur Le bon dev.",
      `Détectée le : ${date}`,
      `Localisation estimée : ${place}`,
      ...geography.map(row => `${row.label} : ${row.value}`),
      ...details.map(row => `${row.label} : ${row.value}`),
      `Lien de la page : ${pageUrl}`,
      ...(mapUrl ? [`Carte : ${mapUrl}`] : []),
      locationNote,
      "Notification privée du studio",
    ].join("\n\n"),
    html,
    inlineAttachments: EMAIL_ASSETS.filter(asset => html.includes(`cid:${asset.contentId}`)),
  }
}
