import type { Locale } from "@/lib/i18n/config"

export function formatEmailDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Paris", timeZoneName: "short",
  }).format(new Date(isoDate))
}
