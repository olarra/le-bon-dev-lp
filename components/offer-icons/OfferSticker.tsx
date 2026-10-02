import { MetalSticker } from "@/components/ui/metal-sticker"
import type { IconKind } from "./motion"

const ASSETS = {
  website: "/images/offers/stickers/offer-web.svg",
  applications: "/images/offers/stickers/offer-app.svg",
} satisfies Record<IconKind, string>

// The applications artwork is near-black; the website one is lime.
const TONES: Partial<Record<IconKind, "dark" | "light">> = { applications: "dark" }

export function OfferSticker({ kind, className }: { kind: IconKind; className?: string }) {
  return <MetalSticker src={ASSETS[kind]} className={className} tone={TONES[kind]} />
}
