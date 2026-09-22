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
| `startViewport` / `endViewport` | 0.9 / 0.35 | Container top crosses 90% → 35% of viewport height |
| `scrub` | 0.25 s | GSAP's short scroll catch-up |
| `shadow` | 36 px / 58 px / −10 px / 0.22 | Lift shadow offset, blur, spread and alpha |
| `settle` | 1.5 px | Brief landing compression before returning to exactly zero |
| `headingClearance` | 24 px | Minimum space between the projected card and heading |
| `sheenDuration` | 1.45 s | POC version 02 surface and resin-rim reflections |
| `sheenStart` | 0.999 | Start after the card has settled, as in the POC |

The stable outer wrapper triggers the sequence. The endpoint stays at least
112 px below the viewport top. Scrolling backwards reverses the pose naturally.
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
run together for 1450ms with `cubic-bezier(.28,.1,.28,1)`, translating from −130%
to +130% with a −16° skew. Their opacity follows the POC's 0/12/82/100% offsets.
Only the decorative layers animate opacity; the card and content stay opaque.
The surface sweep sits below content, while the second sweep is masked to the
resin rim. Existing static edge highlights remain. There is no button shimmer.
The effect starts when the pose is complete, cancels when it reverses, and
rearms only below 15% progress. Hidden tabs/offscreen cards do not start it.
Both Web Animations are cancelled on teardown or a media-preference change.
Motion parents allow shadows to overflow; only the decorative layers clip.

Below the site's 810 px breakpoint, or with reduced motion, GSAP creates no
pose animation. A preference/breakpoint change reverts the transforms. No pinning,
extra smooth scrolling, wheel handlers or perpetual animation loop is added.
The GSAP media context, local trigger, scrub tween, landing reflection, resize
observer, listeners and queued refresh are cleaned up on unmount. Late font
readiness is ignored after teardown. Guarantees' timeline is not modified.

The page's existing `SectionStop` includes `offres` alongside `garanties-timeline`.
It catches the current downward wheel gesture at the section entrance and resumes
on the next gesture; touch, keyboard and reduced-motion input remain native.

Surface colours, corner radii and the 3–4 px molded rim are CSS variables at the
top of `offers.module.css`. The faces stay opaque; masked gradients and inset
shadows form the resin edges. Mobile keeps the nested composition in one column.

Icons use the supplied kit via `components/offer-icons`, at 88 px. The parent
enables playback only once the desktop pose is complete; each icon then plays
once when visible. Mouse entry and CTA focus can replay it after the pose.
Mobile keeps once-on-entry playback. Reduced motion disables playback. The
existing icon visibility guard handles direct loads below the section without
consuming an offscreen replay. See that component's README for asset optimization
and cancellation details.
