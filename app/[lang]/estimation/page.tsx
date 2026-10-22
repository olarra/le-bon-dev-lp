import Link from "next/link"
import { notFound } from "next/navigation"
import { BrandLogo } from "@/components/atoms/BrandLogo"
import { EstimateWizard } from "@/components/estimation/EstimateWizard"
import { EstimateIcon } from "@/components/estimation/EstimateIcon"
import { isLocale, LANGUAGE_NAMES, LOCALES } from "@/lib/i18n/config"
import { getEstimationCopy } from "@/lib/estimation/copy"
import { estimationMetadata } from "@/lib/estimation/metadata"
import { estimationHref, projectType } from "@/lib/estimation/schema"
import { CONTACT } from "@/lib/contact"
import { SITE } from "@/lib/site"
import styles from "@/components/estimation/estimation.module.css"

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ type?: string | string[] }> }

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return estimationMetadata(lang, await getEstimationCopy(lang))
}

export default async function EstimationPage({ params, searchParams }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [copy, query] = await Promise.all([getEstimationCopy(lang), searchParams])
  const prefill = projectType(query.type)
  return (
    <div className={styles.page}>
      <header className={styles.pageToolbar}>
        <Link className={styles.brand} href={"/" + lang} aria-label={SITE.name + " — " + copy.actions.home}><BrandLogo placement="header" /></Link>
        <div className={styles.toolbarActions}>
          <Link href={"/" + lang} className={styles.homeLink} aria-label={copy.actions.home}><EstimateIcon name="back" size={16} /><span>{copy.actions.home}</span></Link>
          <nav className={styles.languages} aria-label={copy.status.language}>
            {LOCALES.map(language => <a key={language} href={estimationHref(language, prefill)} hrefLang={language} lang={language}
              aria-label={LANGUAGE_NAMES[language]} aria-current={language === lang ? "page" : undefined}>{language.toUpperCase()}</a>)}
          </nav>
        </div>
      </header>
      <main className={styles.pageMain}>
        <header className={styles.pageIntro}>
          <p className={styles.eyebrow}>{copy.page.eyebrow}</p>
          <h1>{copy.page.title}</h1>
          <p>{copy.page.description}</p>
        </header>
        <EstimateWizard locale={lang} copy={copy} prefill={prefill} />
        <section className={styles.pageExplanation} aria-labelledby="estimate-explanation">
          <div>
            <h2 id="estimate-explanation">{copy.page.explanationTitle}</h2>
            <p className={styles.pricing}>{copy.page.pricing}</p>
            <a className={styles.pageContact} href={"mailto:" + CONTACT.email}>{CONTACT.email}<EstimateIcon name="arrow" size={16} /></a>
          </div>
          <div>{copy.page.explanation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
      </main>
    </div>
  )
}
