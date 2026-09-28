import { MetalSticker } from "@/components/ui/metal-sticker"
import type { IconKind } from "./motion"

const ASSETS = {
  website: "/images/offers/stickers/offer-web.svg",
  applications: "/images/offers/stickers/offer-app.svg",
} satisfies Record<IconKind, string>

export function OfferSticker({ kind, className }: { kind: IconKind; className?: string }) {
  return <MetalSticker src={ASSETS[kind]} className={className} />
}
