# Offer icons

Adapted from the supplied `le-bon-dev-offer-icons` kit. The raster composition,
optical alignment and animation keyframes are unchanged: the browser/cursor plays
for 1.1 seconds, and the four application tiles play a 975 ms wave.

```tsx
import { OfferIcon, type OfferIconHandle } from "@/components/offer-icons";

<OfferIcon ref={iconRef} kind="website" size={88} playOnHover={false} />
```

The offer parent calls `iconRef.current?.play()` on pointer entry and link focus.
`play()` returns `Promise<boolean>`; repeated calls during decoding or animation
are ignored. `cancel()` restores the resting state and invalidates pending image
decoding. By default, an icon also plays once when 60% visible.

Reduced motion, leaving the viewport, hiding the document, and unmounting cancel
animation. The component is decorative unless a `label` is supplied. No action or
navigation waits for animation. No animation runs permanently.

The five production layers are in `/public/le-bon-dev/offer-icons/`. They were
generated from the kit's full 1254 × 1254 transparent PNG canvases using Sharp:

```js
sharp(sourcePng)
  .resize(384, 384, { fit: "contain" })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(destinationWebp);
```

The square canvases, transparent margins and colour space are preserved. Default
asset URLs use `.webp`; `assets` can override individual URLs, including PNGs.
`assetBasePath` changes the directory. The same ivory tile is reused twice.
