# Le studio

The section follows the supplied `le-bon-dev-studio` composition B: one ivory
surface, editorial copy, the full office portrait, and three convictions in a
shared resin base. The requested figures (10 years, +10 delivered projects,
24 h response) sit below the contact CTA. They supersede the kit's instruction
to omit statistics. The previous portrait placeholder and six feature cards
are no longer rendered by `StudioSection`.

Below the panel, `StudioEcosystem` presents “Nos technologies” before the
contact sections, with its original three tickers, local icons,
contact link and pause control. Its full-width tracks use the studio's responsive
gutter so they stay within the page on desktop and mobile. Offscreen pausing and
the static reduced-motion layout remain part of the existing component.
The heading “Les bons outils pour votre projet.” and its
supporting copy describe the studio's technology choices in terms of project
needs, budget, reliability and room to evolve. Accessible labels use the same
terminology.

The tickers now use the 24 distinct tools from the supplied `icons/` folder.
Their SVG/PNG files are preserved unchanged in `public/images/integrations/`,
with one variant each for Docker and GitHub. The generic filenames were mapped
to the actual logos (including Figma, GraphQL and Redux). Names, filenames and
Sentry's dark backdrop are defined in `integrations.content.ts`. Colours render
at full opacity; the white Sentry artwork sits on a small dark tile. The three
rows start at different tools and retain their original scrolling speeds.

## Existing site components

- `StudioHeading` uses `AnimatedHeading` and the Hero's `SECTION_TITLE_EFFECT`
  with full-heading visibility as its local cue. The Morna Bold typeface,
  character spring and stagger are unchanged. Individual glyphs receive a
  forest-to-electric-green gradient, as in the showcase. Two complete phrases
  form the two lines: “Le fond, la forme.” and “La même attention.” Font size
  follows the column width to retain this grouping on small screens.
- The CTA composes the existing showcase resin-button class and links to
  `#contact`. Its arrow points right, then turns 45° upward on hover/focus.
- `MagicText` uses the installed GSAP/ScrollTrigger for one word sequence
  across all three paragraphs, from pale sage to forest green. It starts when the
  copy's top reaches 68% of the viewport, and finishes when its bottom reaches
  45%, with 0.35 s scrub smoothing. Reverse scrolling reverses the colouring.
  Text is rendered once, selectable and accessible.
- The figures and labels are centered. A lime underlay extends below the
  panel; the convictions sit above it in a translucent, blurred glass base.
  Each conviction is one two-line heading in Outfit Regular, with uniform
  weight, size and muted green colour, a 1.35 line height and more space
  between columns. The additional story
  paragraph describes the senior developer and the specialists who can join.
- No dependencies were installed.

## Conviction stickers

The three supplied SVGs (loupe, code shield and cursor) are preserved unchanged
in `public/images/studio/stickers/`. The shared `MetalSticker` displays each original and
uses its alpha channel to mask the chrome foil, specular gloss and fine vinyl grain. The
finish follows the full silhouette, including the magnifier handle. Layered
shadows follow that silhouette too. The small Outfit Regular headings remain
beside their illustrations, including in the mobile vertical layout.

The foil uses the reference's vivid chrome palette with overlay blending. A
narrow bright band flanked by darker reflections provides metallic contrast;
there is no broad white radial wash. The source SVG colours remain unchanged.

`StickerSurface` adapts the supplied Framer Sticker Pack's cursor-driven CSS
material to the existing section. It captures pointer movement over the whole
`#le-studio`, including the text, photo and whitespace, but only the closest
sticker within 380 px receives input. Each sticker has its own coordinates,
measured from its stationary wrapper's centre, and its own interpolated state.
The response is full up to 260 px, then fades smoothly to zero at the edge of
the reaction area. The previous sticker returns to rest when another takes over.
A 70 ms interpolation smooths the foil angle/origin, gloss, up-to-12-degree tilt
and small translation (3 px horizontal, 2 px vertical) without React renders
on pointer moves. Both pointer axes change the foil angle and the specular band.
Scroll and resize update the nearest sticker even with a stationary pointer.
The animation frame stops after settling; leaving the section or window returns
the material gently to rest. Listeners and pending frames are cleaned up on unmount
or when the input/reduced-motion preference changes. Touch uses a static finish;
reduced motion also disables the foil/gloss and tilt. SVGs remain visible without
JavaScript. The illustrations are decorative and do not capture input.

The material and pointer controller live in `components/ui/metal-sticker.tsx`,
`metal-sticker.module.css` and `sticker-surface.tsx`. The contact section reuses
them with its own supplied SVGs and independent pointer state. Artwork and
responsive sizes remain local to each section.
The contact envelope uses ivory shading and a forest-green fold to stand out
against its lime backing.
Contact uses the optional `backing="circle"` variant: a lime SVG disc with a
white edge sits behind the inset artwork. Both layers share the transform,
shadow and finish, masked to the disc. Its saturated `#C7F51F` lime base uses
a 176-degree white-to-transparent-to-black light overlay (18%, 0% at 40%, 18%)
for a restrained highlight and a deeper lower edge. Both sections share the chrome gradient,
narrow gloss, grain and cursor response. At rest, the contact's gloss is
transparent and parked entirely outside the disc (200% horizontal background
position); its foil stays at 8% to keep the artwork and lime readable. Only
the nearest sticker's proximity smoothly restores the studio's full finish:
68% foil with overlay blending and 85% gloss with normal blending. Leaving
the reaction area parks the reflection again. Touch and no-JS keep the quiet
resting state. The studio's appearance is unchanged.

No Framer editor, dragging, tap effects, idle loops or additional dependencies
are included. Sticker visual review is left to the user as requested.

## Photo sequence

`StudioScene` renders three separate image layers. `studio-scene-motion.ts`
owns their native Web Animations, observers and cancellation. Settings are
grouped in `STUDIO_PHOTO_MOTION` in `studio.content.ts`.

1. Prepare and decode images within 600 px of the viewport.
2. At 60% visibility, reveal the day image with a diagonal clip-path wipe
   lasting 1.2 s. The finished clip is the full rectangle, not a permanent
   angled crop.
3. Once the wipe is complete, the three images are decoded and 75% is visible,
   start the six-second cycle. For a portrait taller than the viewport, this
   threshold uses the available viewport height.
4. Day stays opaque. Sunset fades in over 0–3 s, then night over 3–6 s, using
   the kit's `cubic-bezier(.42,0,.58,1)` for each fade.
5. Hold the night. There is no loop or scroll pinning. Re-entering does not
   restart the sequence. Hiding the tab or moving almost all of the photo
   offscreen pauses the animation; returning resumes it.
6. A small sun/arrow/moon button on the photo replays the light sequence on
   click, touch or keyboard activation. It softly returns to daylight in
   550 ms first, without repeating the entrance wipe. It is disabled during
   playback, and hidden without JavaScript, before decoding/reveal, or with
   reduced motion. Hovering the image or the contact CTA does not restart it.

The image clock is independent of the paragraph scroll progress so the change
of light continues while someone stops to read. On mobile, the text/CTA/figures
precede the photo, followed by the compact vertical convictions.

Reduced motion displays the day and fully coloured text immediately. The same
static content is present without JavaScript. A failed secondary image keeps
the day. Cleanup invalidates pending loads, cancels animations and disconnects
all scene observers/listeners; the text component reverts its GSAP context.

## Assets

Original PNG masters are preserved byte for byte in `/assets/studio/`, checked
against the supplied SHA-256 manifest. The three production derivatives are
in `/public/images/studio/`: 1024 × 1536 WebP, quality 92, effort 6. No cropping,
resizing, regeneration, extra logo, or image transforms are applied.

## Verification

The lighter conviction typography and new stickers are left for the user's
visual review, as requested. The checks below preceded those adjustments.

- TypeScript and whitespace checks pass.
- Chrome layouts checked at 1568, 1024, 900, 768, 390 and 320 px: the main
  title and each conviction retain exactly two lines without overflow.
  The full 2:3 portrait and all three figures remain present.
- Inspected both crossfade midpoints; the image bounds stay fixed throughout
  the sequence. Mobile starts from a fresh page at the visibility cue.
- Paragraph colours checked before, during and after the continuous reveal,
  including reverse scrolling. Heading stays unrevealed while half visible.
  All 77 words of the expanded three-paragraph story reach their final colour.
- Mobile photo stays idle when the section's text enters, and still at 40%
  photo visibility. The wipe starts at 60%, then the cycle at 75%.
- Replay, its soft daylight reset, disabled state during playback, offscreen
  pause/resume, centered figures and CTA arrow rotation checked in Chrome.
- Reduced motion checked on page load and when changed during playback.
  No-JavaScript rendering retains the heading, copy, figures and day image.
- A blocked night image leaves the day visible; delayed decoding prevents
  the fades from starting early. A simulated document visibility change
  pauses and resumes both fades together.
