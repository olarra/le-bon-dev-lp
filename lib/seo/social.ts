import type { Metadata } from "next"
import { LOCALES, OG_LOCALES, type Locale } from "@/lib/i18n/config"
import { SITE } from "@/lib/site"
import cards from "./social-cards.json"

type SocialVariant = keyof typeof cards.variants

export function socialImage(locale: Locale, variant: SocialVariant = "studio") {
  const url = new URL(`/images/social/le-bon-dev-${variant}-${locale}-${cards.version}.jpg`, SITE.url).href
  return {
    url,
    ...(url.startsWith("https://") ? { secureUrl: url } : {}),
    width: cards.width,
    height: cards.height,
    type: "image/jpeg",
    alt: cards.variants[variant][locale].alt,
  }
}

// Each route supplies the complete social object: Next replaces nested metadata
// objects rather than merging the parent's image into a child's Open Graph data.
export function socialMetadata({ locale, path, title, description, variant = "studio" }: {
  locale: Locale
  path: string
  title: string
  description: string
  variant?: SocialVariant
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = socialImage(locale, variant)
  const socialTitle = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`
  return {
    openGraph: {
      type: "website",
      siteName: SITE.name,
      url: new URL(path, SITE.url).href,
      title: socialTitle,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter(language => language !== locale).map(language => OG_LOCALES[language]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  }
}
