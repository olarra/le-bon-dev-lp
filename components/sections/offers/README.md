# Les offres — Ivoire et sauge

`OffersSection.tsx` renders the condensed approved copy from `offers.content.ts`:
each offer has a benefit statement, a single "Pour vous si" sentence, five
included services and an aftercare paragraph. There is no secondary description,
and neither the audience sentence nor the aftercare paragraph is a list.
Only Applications has a scope badge beside the icon: "Web ou mobile".
The website price reads "2 500 € HT — cinq pages, contenus fournis";
no application price is shown.
The existing animated icons are retained instead of the wireframe's mockups.
The website offer sits directly on the shared sage surface. Only Applications
has an ivory panel, inside that surface. Five shared grid rows align icons,
introductions, audience sentences, included services and the closing groups.
Each closing group contains aftercare, then the optional price and CTA. This
keeps the website price close to its aftercare paragraph without reserving the
longer Applications paragraph's height above it. Both buttons stay bottom-aligned.
Both actions lead to the existing contact form on this page, with no separate
offer pages. The nested composition and scroll animation remain unchanged.

`offers-reveal.ts` replaces card parallax with the POC's “Par-dessus” pose.
The sage container and background remain stationary. The opaque ivory panel
descends as one object, including its text, icons and actions. Its motion wrapper
is separate from its resin surface and hover interactions.

`offers-reveal-motion.ts` exposes `OFFERS_REVEAL`:

| Parameter | Default | Effect |
| --- | --- | --- |
| `distance` | 100 px | Initial upward displacement, limited by heading clearance |
| `rotationX` / `rotationZ` | 7° / −2° | Initial ivory tilt |
| `scale` | 1.025 | Initial ivory scale |
| `perspective` / `originY` | 1400 px / 0.8 | Perspective and transform origin at 50% 80% |
| `startViewport` | 0.65 | Container top reaches 65% of viewport height; the initial tilt holds until then |
| `endCardProgress` | 0.95 | Land when 95% of the ivory card has entered from the viewport bottom |
| `minScrollDistance` | 160 px | Minimum reveal range for short cards on tall viewports |
| `scrub` | 0.9 s | Smooth catch-up after fast scroll gestures |
| `shadow` | 36 px / 58 px / −10 px / 0.22 | Lift shadow offset, blur, spread and alpha |
| `settle` | 1.5 px | Brief landing compression before returning to exactly zero |
| `headingClearance` | 24 px | Minimum space between the projected card and heading |
| `sheenDuration` | 1.45 s | POC version 02 surface and resin-rim reflections |
| `sheenStart` | 0.999 | Start after the card has settled, as in the POC |

The stable outer wrapper triggers the sequence. The endpoint uses the ivory
card's actual height and its resting offset inside the support: 5% of its height
remains below the viewport when the pose finishes and the shimmer begins. It is
recalculated on resize, including when the card is taller than the viewport.
The desktop pose follows scroll in both directions: it straightens on descent
and lifts back into its original tilt when scrolling up through the same range.
The pose and lift shadow use `sine.inOut` to soften acceleration. GSAP's 0.9 s
scrub lets the pose catch up smoothly after a fast gesture, including past the
end of the scroll range; the shimmer waits for the actual animated landing.
The later start keeps the tilted pose visible before the descent begins. For
short cards on tall viewports, the start moves earlier only as needed to retain
160 px of motion. Refresh and breakpoint changes restore the current scroll pose.
Scrolling upward does not trigger a second reflection.
At completion, translation and rotations are zero, scale is one and the extra
lift shadow becomes transparent, restoring the original static surface shadow.
Card and content opacity never animate.

The clearance helper projects the card's four corners throughout the motion,
including scale, rotation and perspective. It reduces the starting displacement
when needed instead of adding demonstration spacing. Resize, font readiness and
page restoration refresh this local trigger. Initial/restored scroll progress
is applied before paint, including direct loads into the middle of the page.

The shimmer directly reuses version 02 (“Reflet de résine”) from the supplied
`deux-shimmers-resine.html`: the ivory gradient, surface sweep, masked 3px rim
sweep and Web Animations keyframes are copied from that reference. Both sweeps
run together for 1450ms with `cubic-bezier(.28,.1,.28,1)` and a −16° skew.
`offers-sheen.ts` shares their keyframes across desktop and mobile: the reflection
always travels left → right. Their opacity follows
the POC's 0/12/82/100% offsets.
Only the decorative layers animate opacity; the card and content stay opaque.
The surface sweep sits below content, while the second sweep is masked to the
resin rim. Existing static edge highlights remain. There is no button shimmer.
The effect starts when the pose is complete. After the reveal, hovering, focusing
or activating "Estimer mon application" can replay it across the entire card,
alongside the existing icon animation. An already-running reflection is not
restarted by a second interaction. Hidden tabs/offscreen cards do not start it.
Both Web Animations are cancelled on teardown or a media-preference change.
Motion parents allow shadows to overflow; only the decorative layers clip.

Below the site's 810 px breakpoint, `offers-mobile-reveal.ts` reveals Applications
with a 36px slide up and opacity 0 → 1 over 650ms (`power2.out`). The timed entrance
starts when its stable wrapper crosses 75% viewport height, so it continues even
when scrolling stops. There is no rotation, perspective or scale animation.
The card stays visible on reverse scroll. Restored positions and keyboard focus
show the content immediately; the media context restores all styles on teardown.
The shimmer has a separate threshold: it starts once the reveal has finished and
the card's top reaches 25% viewport height, matching the mobile reference. It
plays once on descent. The card stays visible and stationary on return, with no
automatic reflection replay. The CTA can replay the full-card reflection.
An offscreen/restored position does not consume this pass before it is visible.
Mobile uses the desktop's exact surface and resin-rim gradients, keyframes and
1450ms timing. Both layers cover the full card height: there is no mobile height
cap, fading mask or colour override. The surface stays below all content, while
the rim remains confined to its 3px border. The Applications icon waits for the
entrance, while the Sites internet icon retains viewport-entry playback. Touch
replay remains available once the card is visible. Desktop is unchanged.
`MOBILE_OFFER_REVEAL` exposes distance, entrance duration, entrance and shimmer
viewport thresholds, and shimmer duration.

With reduced motion, GSAP creates no pose animation or shimmer. A
preference/breakpoint change reverts the transforms. No pinning,
extra smooth scrolling, wheel handlers or perpetual animation loop is added.
The GSAP media context, local trigger, scrub tween, landing reflection, resize
observer, listeners and queued refresh are cleaned up on unmount. Late font
readiness is ignored after teardown. Guarantees' timeline is not modified.

The page's `SectionTransitions` includes all main sections. On desktop, a wheel
gesture at a section's final reading screen triggers a one-second Lenis arrival
at the next section; upward navigation returns to the previous section's final
reading screen. Long sections keep their internal scroll and existing timelines.
Guarantees and Offers share one continuous reading range: crossing between them
in either direction remains natural, without an arrival animation or a stop.
Touch, keyboard and reduced-motion input remain native. `SECTION_TRANSITION` in
`section-transition-controller.ts` exposes duration and gesture timing.

Surface colours, corner radii and the 3–4 px molded rim are CSS variables at the
top of `offers.module.css`. The faces stay opaque; masked gradients and inset
shadows form the resin edges. Mobile keeps the nested composition in one column.

Icons use the supplied kit via `components/offer-icons`, at 88 px. The parent
enables playback only once the desktop pose is complete; each icon then plays
once when visible. Mouse entry and CTA focus can replay it after the pose.
Mobile keeps once-on-entry playback. A short touch tap on an icon or non-interactive
card area also replays it. Movement beyond 10px, scrolling, cancellation, multi-touch
and presses longer than 500ms do not replay it. Links retain their native action;
no touch event is prevented or captured manually. Reduced motion disables playback. The
existing icon visibility guard handles direct loads below the section without
consuming an offscreen replay. See that component's README for asset optimization
and cancellation details.
