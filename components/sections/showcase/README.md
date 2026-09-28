# Les réalisations

Two projects in normal document flow. The surface starts in the Offers section's
dark green-black behind the full introduction. As the Miau phones enter
the viewport, a short scroll interval turns the surface white. The previous
carousel files remain available but are no longer mounted here.

The implementation reuses Morna Bold / Outfit, `AnimatedHeading` and the Hero's
character entrance, `OfferIcon`, GSAP / ScrollTrigger and CSS modules. It adds no
animation package, Tailwind configuration or provider.

## Content and destinations

`realisations.content.ts` holds the copy, asset paths, link destinations and
`MIAU_REVEAL` settings. Miau's destination is currently `null` and its button is
disabled until its URL is supplied. French Pixel Studio uses the destination
from the supplied POC: `https://www.frenchpixelstudio.fr/`.

## Motion

- `useShowcaseTheme` changes only the background and text palette.
  `SHOWCASE_THEME_REVEAL` follows Miau's stable visual from `top 100%` to `top 82%`.
  The badge, title and subtitle enter on a fully dark surface, continuous with
  Offers. The transition starts as the phones enter the bottom of the viewport,
  then targets white over 18% of viewport height. `sine.inOut` distributes the
  colour change more evenly than a cubic ease, while 0.35 s scrubbing smooths
  individual wheel steps. The viewport landmarks stay unchanged. No decorative
  layer, extra space or pinned scrolling is added. Reverse scrolling restores
  the dark theme.
- Palette endpoints live in `showcase.module.css`. Text approaches white while
  the dark surface brightens, switches to black at a contrasting background,
  then settles into the final forest/green palette. This avoids unreadable
  mid-grey text during a simultaneous foreground/background crossfade. The
  header observes the theme attribute and updates its own contrast.
- The existing title and Miau colour reveals animate their own percentage,
  independently of the theme; both use whichever palette is currently active.
- The phone visual reserves the zoomed opening footprint at 25 / 23. Its
  centered inner composition keeps the original 5 / 4 proportions and final
  phone sizes, so the extra room prevents clipping without shrinking devices.
- Miau starts at 1.2× scale with the side phones close behind authentication.
  The group pulls back to 1× as the sides separate, matching the supplied
  iPhone frames. There is no opposing scale-up on the central phone. Responsive
  image sizes account for the enlarged opening pose.
- Side displacement and vertical movement are fractions of its width. The
  narrower layout uses a slightly smaller final spread.
- ScrollTrigger starts when the visual's bottom reaches 110% of viewport
  height and finishes at `center 56%`, with 0.45 s smoothing. This keeps the
  enlarged pose visible before unfolding. On short viewports the start moves
  earlier to preserve at least 18% of viewport height as scroll travel; it adds
  no scroll track. The final composition holds; scrolling up reverses it.
- Authentication always has the highest stacking order. Phones have full
  opacity throughout; no rotations or screen replacements are involved.
- The title's individual glyphs receive the progressive green colour. Applying
  background clipping to their parent would make transformed glyphs invisible
  in Chrome. Their movement still comes from the shared Hero heading effect.
- `ResinGallery` uses the supplied resin monitor, including its stand. Its
  outer stage reserves a 1256 / 932 display window from the original
  1536 × 1024 PNG, removing only empty margins. It supplies 1200 px perspective.
  Only the inner device moves; its gallery, illustrated monitor and reflection
  share that transform. The editorial content stays outside it.
- `RESIN_GALLERY_REVEAL` in `ResinGallery.tsx` groups the motion settings:
  `top 91%` to `top 26%`, smoothstep easing, 0.22 s scroll smoothing, rotation X
  8° → 0°, scale 0.96 → 1, translation Y 38 → 0 px. Below 700 px the initial
  rotation and translation become 6° and 22 px. The final pose holds and
  scrolling back reverses it; there is no pinning or opacity animation.
- Alignment parameters are grouped at the top of `resin-gallery.module.css`.
  The gallery slightly underlaps the resin's inner edge. Gallery typography
  responds to the visual's width, with the POC's compact navigation on narrow
  frames. The monitor PNG's existing alpha preserves the bezel and the stand.
- The reflection sits above the gallery AND monitor. Its silhouette combines
  the PNG's actual alpha with `monitor-screen-mask.svg`, which fills only the
  screen opening. The empty margins and opening inside the stand stay clear.
  The POC's lighting parameters remain: 110° gradient, pseudo-element inset
  -100%, opacity 0.65, and `--shine` from -20% to 20% on the same tween as the
  device. It is decorative, non-interactive and never loops.
- `SvgFollowScroll` uses the POC's viewport reading line (73% of viewport height)
  and cached SVG samples. Once the monitor's centre reaches 65% of viewport
  height, the remaining stroke finishes automatically over 0.9 s, even if
  scrolling stops. `THREAD_COMPLETION` groups this timing in `showcase-thread.ts`.
  Scrolling back before that point smoothly returns to the scroll-driven draw.
  It progresses independently from the phones. The path changes columns
  between projects and stays in the outer margin beside mobile copy. Geometry
  is recalculated on resize and font readiness. The gallery anchor is its
  untransformed outer wrapper, so its movement and shimmer cannot affect the
  thread geometry. Restored positions past the finish show the full line.
- CSS defaults show the light theme, final devices and complete line. Reduced
  motion keeps these defaults and disables the gallery shimmer; the `noscript`
  rule also exposes the shared animated heading. Without JS, the shimmer stays
  hidden.
- GSAP media contexts, resize observers, animation frames and scroll listeners
  are disposed on unmount.

In `app/page.tsx`, only the downward transition from Hero into Nos garanties
snaps. All later sections and all upward scrolling remain continuous, including
both sides of Réalisations. Hero, Garanties and Offres components were not edited.

## Illustration sources

The four individual PNG exports in Downloads were inspected for actual alpha,
not merely an alpha channel declaration. Their surroundings are transparent;
the opaque reference montage and the earlier white-background exports are not
used. All output files are lossless WebP, with no redrawing, colour changes,
blending, rotation or stretching.

| Output in `public/images/realisations` | Original export, 26 September 2026 | Crop (x, y, width, height) |
| --- | --- | --- |
| `miau-auth.webp` | `ChatGPT Image Sep 26, 2026, 01_33_51 PM.png` | 143, 43, 740, 1458 |
| `miau-orion.webp` | `ChatGPT Image Sep 26, 2026, 01_34_01 PM.png` | 143, 43, 740, 1458 |
| `miau-map.webp` | `ChatGPT Image Sep 26, 2026, 01_34_11 PM.png` | 143, 43, 740, 1458 |
| `french-pixel-studio.webp` (previous monitor, no longer mounted) | `ChatGPT Image Sep 26, 2026, 01_39_41 PM.png` | 126, 33, 1284, 966 |

Identical crops normalize the phone margins while retaining their resin edges
and a small transparent border. Next Image serves responsive versions at
quality 90; explicit image dimensions prevent loading from changing layout.

The French Pixel Studio artwork and previous standalone frame were extracted from
`/Users/jesusgo/Downloads/french-pixel-resin-poc(3).html` into
`public/images/realisations/french-pixel/`. All four PNGs are byte-identical to
the embedded originals, with no resampling, cropping or colour changes:

| Asset | Original dimensions | Original bytes |
| --- | --- | --- |
| `resin-frame.png` | 1610 × 977 | 364022 |
| `bluebirds.png` | 1444 × 2048 | 8196623 |
| `sleeping-cat.png` | 1450 × 2048 | 7247969 |
| `moon-waves.png` | 1456 × 2048 | 6989198 |

`resin-contour-mask.svg` is the URL-decoded mask from that same POC. The
standalone frame and its mask are preserved but are no longer mounted.

The active `resin-monitor.png` is a byte-identical copy of
`/Users/jesusgo/Downloads/ChatGPT Image Sep 26, 2026, 04_15_55 PM.png`
(1536 × 1024, 1273863 bytes). Actual alpha was verified around the silhouette,
inside the screen and inside the stand; the apparent green background in
some previews is RGB data in transparent pixels. The browser displays the
original alpha. CSS crops the display to (140, 52, 1256, 932), without modifying
the source image. Screen bounds (187, 94)–(1349, 750) slightly underlap the bezel.

The monitor is served directly, while Next Image delivers responsive artwork
copies at quality 95 from the preserved original PNGs. The POC's small wood
mounts and white mats remain behind the resin illustration.

## Verification

- TypeScript: `npx tsc --noEmit --incremental false`
- Existing scroll controller checks:
  `node --experimental-strip-types --test tests/section-transitions.test.ts`
- Browser checks at 320, 390, 768, 1024 and 1440 px: initial, unfolding, final,
  held and reverse phone poses; no horizontal or visual-container overflow;
  gallery initial/intermediate/final/held/reverse poses; no gallery overflow,
  image-loading layout shift or thread/editorial collisions. Also checked
  live reduced-motion changes and desktop/mobile no-JavaScript fallbacks.
- The Miau zoom refinement also covers a short 1440 × 650 viewport. Verified
  the 1.2× opening size, continuous pullback while spreading, the held and
  reversed poses, stable copy, and the existing monitor motion.
- The theme transition was checked at five widths, including both sides of
  the foreground switch: body text contrast ≥ 4.5:1 and large text ≥ 3:1,
  stable layout, reverse scrolling, header synchronisation and reduced motion.
- The final theme timing was verified in the browser at 1568 × 1028,
  1440 × 800, 1440 × 650 and 390 × 844: introduction fully dark before phone
  entry, full white while only the upper part of the phones is visible, stable
  copy and layout, readable text and reverse scrolling. Desktop and mobile
  screenshots were inspected. A wheel gesture also produces continuous
  intermediate colours; restored scroll positions and reduced motion pass.
- The thread's timed finish was checked at 1568 × 900, 1440 × 650 and
  390 × 844. With scrolling stopped and the monitor near the centre, the tail
  continues through intermediate lengths and reaches zero dash offset.
  Reverse scrolling, restored positions and reduced motion pass. The monitor,
  phone poses, curve geometry and copy layout remain independent of this finish.
- Pixel comparisons with the reflection on/off confirm changes on the art,
  gallery interface, bezel and stand, with none in the transparent margins or
  opening inside the stand. A contrasting backdrop check confirms that the
  screen opening has no transparent seams.
