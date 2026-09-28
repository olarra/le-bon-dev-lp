import { CONTACT } from "@/lib/contact"
import { SITE } from "@/lib/site"

export function SiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: CONTACT.email,
    telephone: CONTACT.whatsapp,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
