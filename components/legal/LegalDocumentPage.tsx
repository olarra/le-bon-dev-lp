import { CONTACT } from "@/lib/contact"
import type { Locale } from "@/lib/i18n/config"
import { getLegalCopy } from "@/lib/legal/copy"
import { LEGAL_DETAILS, LEGAL_UPDATED_AT } from "@/lib/legal/details"
import { legalHref, type LegalDocument } from "@/lib/legal/navigation"
import { visitNotificationsEnabled } from "@/lib/visits/server"
import { LegalPage } from "./LegalPage"
import styles from "./legal.module.css"

export function LegalDocumentPage({ locale, document }: { locale: Locale; document: LegalDocument }) {
  const copy = getLegalCopy(locale)
  const { publisher, host, requestRetentionMonths, visitNotificationRetentionDays } = LEGAL_DETAILS
  const visitsEnabled = visitNotificationsEnabled()
  const phone = CONTACT.whatsapp.replace(/^(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6")

  return (
    <LegalPage locale={locale} document={document} introduction={copy[document].introduction}
      updatedAt={LEGAL_UPDATED_AT}>
      {document === "notice" ? <>
        <section aria-labelledby="legal-publisher">
          <h2 id="legal-publisher">{copy.labels.publisher}</h2>
          {publisher ? <>
            <p>{copy.notice.publisherText(publisher.name, publisher.tradingName)}</p>
            <p>{copy.notice.activityText(publisher.cooperative.name, publisher.cooperative.registration)}</p>
          </> : <p className={styles.pending}>{copy.notice.publisherPending}</p>}
          <dl>
            {publisher && <div><dt>{copy.labels.address}</dt><dd>
              {publisher.address ? <address>{publisher.address}</address> : <span className={styles.pending}>{copy.missing}</span>}
            </dd></div>}
            <div><dt>{copy.labels.email}</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
            <div><dt>{copy.labels.phone}</dt><dd><a href={`tel:${CONTACT.whatsapp}`}>{phone}</a></dd></div>
          </dl>
        </section>
        <section aria-labelledby="legal-hosting">
          <h2 id="legal-hosting">{copy.notice.hosting}</h2>
          {host ? <dl>
            <div><dt>{copy.labels.name}</dt><dd>{host.name}</dd></div>
            <div><dt>{copy.labels.address}</dt><dd><address>{host.address}</address></dd></div>
            <div><dt>{copy.labels.phone}</dt><dd>{host.phone}</dd></div>
            <div><dt>{copy.labels.email}</dt><dd><a href={`mailto:${host.email}`}>{host.email}</a></dd></div>
            <div><dt>{copy.labels.website}</dt><dd><a href={host.website}>{host.website}</a></dd></div>
          </dl> : <p className={styles.pending}>{copy.notice.hostingPending}</p>}
        </section>
        <section aria-labelledby="legal-contents">
          <h2 id="legal-contents">{copy.notice.contents}</h2>
          <p>{copy.notice.rights}</p>
        </section>
        <section aria-labelledby="legal-privacy">
          <h2 id="legal-privacy">{copy.notice.privacy}</h2>
          <p>{copy.notice.privacyText}</p>
          <p><a href={legalHref(locale, "privacy")}>{copy.notice.privacyLink}</a></p>
        </section>
        <section aria-labelledby="legal-usage">
          <h2 id="legal-usage">{copy.notice.usage}</h2>
          <p>{copy.notice.accuracy} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
          <p>{copy.notice.external}</p>
        </section>
      </> : <>
        <section aria-labelledby="privacy-controller">
          <h2 id="privacy-controller">{copy.privacy.controller}</h2>
          <p>{copy.privacy.controllerText}</p>
          {publisher && <p>{publisher.name} — <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>}
          <p><a href={legalHref(locale, "notice")}>{copy.privacy.controllerLink}</a></p>
        </section>
        <section aria-labelledby="privacy-purposes">
          <h2 id="privacy-purposes">{copy.privacy.purposes}</h2>
          <p>{copy.privacy.collected}</p>
          <p>{copy.privacy.required}</p>
          <p>{copy.privacy.basis}</p>
        </section>
        {visitsEnabled && <section aria-labelledby="privacy-visits">
          <h2 id="privacy-visits">{copy.privacy.visits}</h2>
          <p>{copy.privacy.visitsText}</p>
          <p>{copy.privacy.visitsProtection}</p>
          <p>{copy.privacy.visitsChoice}</p>
          <details className={styles.dataDetails}>
            <summary>{copy.privacy.visitsDataTitle}</summary>
            <p>{copy.privacy.visitsData}</p>
          </details>
        </section>}
        <section aria-labelledby="privacy-recipients">
          <h2 id="privacy-recipients">{copy.privacy.recipients}</h2>
          <p>{copy.privacy.recipientsText}</p>
          {visitsEnabled && <p>{copy.privacy.visitsRecipients}</p>}
          <p>{copy.privacy.mailjet} <a href="https://www.mailjet.com/legal/dpa/">{copy.privacy.mailjetLink}</a>.</p>
          <p className={host ? undefined : styles.pending}>
            {host ? <>{host.dataProcessing[locale]} <a href={host.dataProcessingUrl}>{copy.privacy.hostingLink}</a>.</> : copy.privacy.hostingPending}
          </p>
        </section>
        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">{copy.privacy.retention}</h2>
          <p className={requestRetentionMonths ? undefined : styles.pending}>
            {requestRetentionMonths ? copy.privacy.retentionText(requestRetentionMonths) : copy.privacy.retentionPending}
          </p>
          <p>{copy.privacy.clients}</p>
          {visitsEnabled && <p className={visitNotificationRetentionDays ? undefined : styles.pending}>
            {visitNotificationRetentionDays
              ? copy.privacy.visitsRetentionText(visitNotificationRetentionDays)
              : copy.privacy.visitsRetentionPending}
          </p>}
        </section>
        <section aria-labelledby="privacy-storage">
          <h2 id="privacy-storage">{copy.privacy.storage}</h2>
          <p>{copy.privacy.trackers}</p>
          <p>{copy.privacy.draftStorage}</p>
        </section>
        <section aria-labelledby="privacy-security">
          <h2 id="privacy-security">{copy.privacy.security}</h2>
          <p>{copy.privacy.securityText}</p>
        </section>
        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">{copy.privacy.rights}</h2>
          <p>{copy.privacy.rightsText}</p>
          <p>{copy.privacy.contact} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
          <p>{copy.privacy.complaint} <a href="https://www.cnil.fr/fr/plaintes">{copy.privacy.cnilLink}</a>.</p>
        </section>
        <section aria-labelledby="privacy-updates">
          <h2 id="privacy-updates">{copy.privacy.updates}</h2>
          <p>{copy.privacy.updatesText}</p>
        </section>
      </>}
    </LegalPage>
  )
}
