# Les offres — Ivoire et sauge

`OffersSection.tsx` renders the condensed approved copy from `offers.content.ts`:
each offer has a benefit statement, a single "Pour vous si" sentence, five
included services and an aftercare paragraph. There is no secondary description,
and neither the audience sentence nor the aftercare paragraph is a list.
Only Applications has a scope badge beside the icon: "Web ou mobile".
The website price reads "2 500 € HT — cinq pages, contenus fournis";
no application price is shown.
`offers-reveal.ts`, `offers-reveal-motion.ts` and `offers-mobile-reveal.ts`
retain the original card animation from the committed implementation.
The sage support stays stationary. At 810 px and above, the ivory panel starts
raised and tilted, then settles into place as the user scrolls. The original
settings are 100 px maximum lift, 7° / −2° rotations, 1.025 scale, 1400 px
perspective, and a transform origin at 50% 80%. Heading clearance limits the lift.
The scroll range starts with the container at 65% viewport height and ends when
95% of the card has entered. The 0.9 s scrub, reverse-scroll pose, lift shadow,
1.5 px landing settle and 1450 ms landing reflection are restored together.
Below 810 px, the original card entrance is a 36 px rise/fade over 650 ms at
75% viewport height; its reflection starts once the card reaches 25% and the
entrance has finished. Restored positions and keyboard focus reveal it immediately.

`offers-content-entrance.ts` handles only the heading and content, independently
of the restored card controller. It does not transform the card or its wrappers.
`AnimatedHeading` keeps its existing letter effect and `HEADING_REVEAL` settings.
Offres supplies animation controls so its section controller starts the heading
before the content in the same frame on a direct refresh. Other headings keep
their existing viewport observer. The title's server-rendered pending opacity
prevents it from appearing fully formed and then disappearing during hydration.

The supplied reference recording (11:45:58), compared with Offres (11:45:16),
shows a sustained fade during the rise, overlapping left and bottom blocks,
and a slightly later right block. One desktop/tablet timeline owns both offers;
below 810 px, each offer has its own timeline. Its schedule is:

| Content | Start | Motion |
| --- | --- | --- |
| Left / right icon | 40 / 200 ms | 16 px rise, 0.98 → 1 scale, fade over 900 ms |
| Card badge | 40 ms after its icon | Opacity only, 900 ms |
| Left / right copy | 80 / 240 ms | 32 px rise and fade over 950 ms |
| Aftercare and price | 120 ms | 24 px rise and fade over 950 ms |
| Buttons | 180 ms | 16 px rise and fade over 950 ms |

Opacity and transforms share `power1.inOut` and the full duration, so the
movement remains visible throughout the fade instead of settling before it.
On phones, the column offset is removed; copy/bottom rises shrink to
24 / 18 px and icons/buttons to 12 px. Titles, promises, audience and the complete feature list form
one copy block per column; individual paragraphs and list items have no
independent scroll triggers. Icon wrappers keep the entrance separate from
the existing sticker lighting. The text entrance has no bounce.

The section title starts at 80% of the viewport. The card container's top
reaching 90% starts the complete content sequence independently of the card's
scroll-linked pose. On phones, the stationary card slot is the anchor for
Applications. The content reveal therefore
starts as the panel enters, instead of leaving it empty while waiting for the
heading below its icon to cross a separate threshold. On a direct load
inside the section, both start in the same controller pass, with the title first.
Every content beat starts within 240 ms and finishes within 1190 ms, even
when scrolling stops. Later copy, including content below the fold, belongs
to that same sequence and cannot wait indefinitely for another threshold.

The heading wrapper itself stays stationary. A passive scroll listener with
one requestAnimationFrame reads its current position, avoiding cached offsets
when the Guarantees layout or fonts settle above it. Refreshing directly inside
an offer plays the same sequence without requiring a scroll gesture, including
when the browser restores the position after hydration. Server-rendered CSS
holds the animated content at opacity zero until GSAP installs all starting
poses, avoiding a visible-to-hidden text jump. The desktop card faces stay opaque
throughout the pose animation. Only cards entirely above the viewport skip text playback; an offer
whose heading has passed but whose body is still visible continues to animate.
Keyboard focus settles the content sequence, including animations already running.
Once all pending content blocks have started, their scroll listener schedules no further work.
Reduced motion bypasses the pending pose; a local noscript style also makes
all content visible without JavaScript.
Breakpoint changes preserve blocks already seen. GSAP clears text styles on
completion and reverts its context on teardown; event listeners and queued
frames are also removed.

The surface/rim reflection plays after the original card landing and remains
available through the Applications CTA, using `offers-sheen.ts` (1450 ms,
transform/opacity only). The original controller owns its replay guard and
cancellation; the content controller adds no duplicate reflection listeners.

The eyebrow and title sizes come from the shared `--eyebrow-*` and
`--section-title-size` tokens in `app/globals.css`.
The supplied `offer-web.svg` and `offer-app.svg` use the shared contact
`MetalSticker` finish at 88 px; the near-black `offer-app.svg` declares
`tone="dark"`, so its finish is added as lime-tinted light and masked off the
artwork's bright tiles. `useStickerMotion` lights the icons from a fixed
lamp above the viewport: while the page scrolls, the highlight sweeps across each
visible icon as it travels, and the icon leans up to 5° with the scroll speed.
When scrolling pauses the lean settles flat at once, while the shine fades over
about 0.7 s and the highlight holds its position, so the next flick continues the
same sweep. No cursor is needed.
A cursor within 3.5× the icon's size (at least 320 px, up to 480 px) takes
the light over: the tilt grows with the offset, holds at 10°, then eases back flat
toward the edge of that reach, while the reflections fade over its outer half.
Scrolling hands a still mouse's icon back to the scroll light until it moves
again. Translation stays within 1.25 px. Hidden sections do not measure on every
event. Their SVG shapes and colours are preserved, and reduced motion keeps them
static.
A touch or pen press on or close to an icon keeps that icon active until release,
including during native scrolling. A gesture elsewhere does not activate icons
as they enter the viewport.
Quick taps retain 180 ms of feedback. All touch listeners are passive.
`FEATURE_FLAG_RESINE_ICON_ENABLED` in `lib/feature-flags.ts` defaults to `false`.
Set it to `true` to restore the original resin icons and their existing playback.
Their components, animation code and image assets are retained.
The website offer sits directly on the shared sage surface. Only Applications
has an ivory panel, inside that surface. Five shared grid rows align icons,
introductions, audience sentences, included services and the closing groups.
Each closing group contains aftercare, then the optional price and CTA. This
keeps the website price close to its aftercare paragraph without reserving the
longer Applications paragraph's height above it. Both buttons stay bottom-aligned.
Both actions lead to the existing contact form on this page, with no separate
offer pages. The nested composition retains its five aligned grid rows.

SectionTransitions handles only the downward entrance from the Hero into Nos garanties. Other sections retain ordinary scrolling.

Surface colours, corner radii and the 3–4 px molded rim are CSS variables at the
top of `offers.module.css`. The faces stay opaque; masked gradients and inset
shadows form the resin edges. Mobile keeps the nested composition in one column.

When the resin flag is enabled, icons use `components/offer-icons`, at 88 px.
The original desktop controller enables them after the card settles. On phones,
Sites internet keeps viewport-entry playback while Applications waits for its
card entrance. Mouse entry and CTA focus can replay them once enabled.
Mobile keeps once-on-entry playback. A short touch tap on an icon or non-interactive
card area also replays it. Movement beyond 10px, scrolling, cancellation, multi-touch
and presses longer than 500ms do not replay it. Links retain their native action;
no touch event is prevented or captured manually. Reduced motion disables playback. The
existing icon visibility guard handles direct loads below the section without
consuming an offscreen replay. See that component's README for asset optimization
and cancellation details.

## Traductions

OffersSection reçoit les offres et leurs libellés traduits via `copy`. Les identifiants `sites-vitrines` et `saas-mobile` restent stables dans les trois langues ; les animations conservent leurs déclencheurs.
Les dictionnaires sont chargés côté serveur depuis `lib/i18n/` pour `/fr`, `/en`
et `/es`, puis seule la langue active est transmise à la section.
