import { CONTACT } from "@/lib/contact"
import { SITE } from "@/lib/site"
import { LOCALES, type Locale } from "@/lib/i18n/config"

export function SiteStructuredData({ locale, description, title }: { locale: Locale; description: string; title: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [{
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: `${SITE.url}/fr`,
    description,
    email: CONTACT.email,
    telephone: CONTACT.whatsapp,
    }, {
      "@type": "WebSite", "@id": `${SITE.url}/#website`,
      name: SITE.name, url: `${SITE.url}/fr`, inLanguage: LOCALES,
      publisher: { "@id": `${SITE.url}/#organization` },
    }, {
      "@type": "WebPage", "@id": `${SITE.url}/${locale}#webpage`,
      name: title, description, url: `${SITE.url}/${locale}`, inLanguage: locale,
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#organization` },
    }],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
