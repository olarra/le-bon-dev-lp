import { CONTACT } from "@/lib/contact"
import type { Locale } from "@/lib/i18n/config"
import { getLegalCopy } from "@/lib/legal/copy"
import { LEGAL_COMPLETE, LEGAL_DETAILS, LEGAL_UPDATED_AT } from "@/lib/legal/details"
import { legalHref, type LegalDocument } from "@/lib/legal/navigation"
import { LegalPage } from "./LegalPage"
import styles from "./legal.module.css"

export function LegalDocumentPage({ locale, document }: { locale: Locale; document: LegalDocument }) {
  const copy = getLegalCopy(locale)
  const { publisher, host, publicationDirector, requestRetentionMonths } = LEGAL_DETAILS
  const phone = CONTACT.whatsapp.replace(/^(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6")

  return (
    <LegalPage locale={locale} document={document} introduction={copy[document].introduction}
      updatedAt={LEGAL_UPDATED_AT} draftNotice={LEGAL_COMPLETE ? undefined : copy.draft}>
      {document === "notice" ? <>
        <section aria-labelledby="legal-publisher">
          <h2 id="legal-publisher">{copy.labels.publisher}</h2>
          {!publisher && <p className={styles.pending}>{copy.notice.publisherPending}</p>}
          <dl>
            {publisher && <>
              <div><dt>{copy.labels.name}</dt><dd>{publisher.name}</dd></div>
              <div><dt>{copy.labels.legalForm}</dt><dd>{publisher.legalForm}</dd></div>
              <div><dt>{copy.labels.address}</dt><dd><address>{publisher.address}</address></dd></div>
              <div><dt>{copy.labels.registration}</dt><dd>{publisher.registration}</dd></div>
              {publisher.vatNumber && <div><dt>{copy.labels.vat}</dt><dd>{publisher.vatNumber}</dd></div>}
              {publisher.capital && <div><dt>{copy.labels.capital}</dt><dd>{publisher.capital}</dd></div>}
            </>}
            <div><dt>{copy.labels.email}</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
            <div><dt>{copy.labels.phone}</dt><dd><a href={`tel:${CONTACT.whatsapp}`}>{phone}</a></dd></div>
          </dl>
        </section>
        <section aria-labelledby="legal-publication">
          <h2 id="legal-publication">{copy.notice.publication}</h2>
          <p className={publicationDirector ? undefined : styles.pending}>{publicationDirector ?? copy.missing}</p>
        </section>
        <section aria-labelledby="legal-hosting">
          <h2 id="legal-hosting">{copy.notice.hosting}</h2>
          {host ? <dl>
            <div><dt>{copy.labels.name}</dt><dd>{host.name}</dd></div>
            <div><dt>{copy.labels.address}</dt><dd><address>{host.address}</address></dd></div>
            <div><dt>{copy.labels.phone}</dt><dd>{host.phone}</dd></div>
            <div><dt>{copy.labels.website}</dt><dd><a href={host.website}>{host.website}</a></dd></div>
          </dl> : <p className={styles.pending}>{copy.notice.hostingPending}</p>}
        </section>
        <section aria-labelledby="legal-contents">
          <h2 id="legal-contents">{copy.notice.contents}</h2>
          <p>{copy.notice.rights}</p>
          <p>{copy.notice.external}</p>
          <p><a href={legalHref(locale, "privacy")}>{copy.notice.privacyLink}</a></p>
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
        <section aria-labelledby="privacy-recipients">
          <h2 id="privacy-recipients">{copy.privacy.recipients}</h2>
          <p>{copy.privacy.recipientsText}</p>
          <p>{copy.privacy.mailjet} <a href="https://www.mailjet.com/legal/dpa/">{copy.privacy.mailjetLink}</a>.</p>
          <p className={host ? undefined : styles.pending}>{host?.dataProcessing[locale] ?? copy.privacy.hostingPending}</p>
        </section>
        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">{copy.privacy.retention}</h2>
          <p className={requestRetentionMonths ? undefined : styles.pending}>
            {requestRetentionMonths ? copy.privacy.retentionText(requestRetentionMonths) : copy.privacy.retentionPending}
          </p>
          <p>{copy.privacy.clients}</p>
          <p>{copy.privacy.draftStorage}</p>
          <p>{copy.privacy.trackers}</p>
        </section>
        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">{copy.privacy.rights}</h2>
          <p>{copy.privacy.rightsText}</p>
          <p>{copy.privacy.contact} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
          <p>{copy.privacy.complaint} <a href="https://www.cnil.fr/fr/plaintes">{copy.privacy.cnilLink}</a>.</p>
        </section>
      </>}
    </LegalPage>
  )
}
