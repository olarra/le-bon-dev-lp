# Method icons

Adapted from the supplied `le-bon-dev-icons-animes` kit. `MethodIcon` renders
the original illustrated layers; `motion.ts` preserves the supplied native
Web Animations keyframes, timings and transform origins. No animation library
is added.

| Kind | Layers | Motion |
| --- | --- | --- |
| `cadrage` | notebook, pencil | Two writing gestures and a slight notebook response; 1.25 s. |
| `jalons` | step-high + flag, step-mid, step-low | Blocks rise in sequence; the flag follows the upper block and pivots; 1.08 s. |
| `rocket` | flame + rocket | The group takes off slightly, with a separate flame pulse; 1.35 s. |
| `care` | sprout, wrench | The wrench turns, then the sprout straightens; 1.2 s. |

## Timeline integration

`MethodTimeline` owns the controllers and uses the existing card activation
position (the marker crossing 52% of the viewport). The first card is already
highlighted and plays once when its icon is at least 60% visible. Later icons
play when their card becomes active; merely entering the viewport or hovering
does not start them. Scrolling back deactivates later cards and cancels their
motion. Crossing their marker again starts a fresh play.

Visibility gates playback so restored scroll positions do not animate hidden
cards. Images are decoded before playback. Deactivation, leaving the visible
area, hiding the document, reduced motion, and unmounting invalidate pending
decoding and cancel running animations. Controllers and observers are cleaned
up with the timeline.

All pieces are visible at rest and in server-rendered HTML. Their canvas
reserves space, and transforms do not move the surrounding copy or rail.
`--method-icon-size` sets the square canvas: 112 px on desktop, 80 px on mobile.

## Assets

Ten transparent WebP layers live in `/public/le-bon-dev/method-icons/` (about
130 KiB combined). The original PNGs in the supplied kit are unchanged.
The conversion matches the offer-icon pipeline:

```js
sharp(sourcePng)
  .resize(384, 384, { fit: "contain" })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(destinationWebp)
```

Keep the complete square canvases, transparent margins and layer order.
Cropping individual layers would break their alignment and pivot positions.
