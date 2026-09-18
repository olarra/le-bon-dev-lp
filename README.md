# Agenius (Next.js)

Migration of the Framer site "Agenius" to React components, section by section.

```bash
yarn install
yarn dev
```

## Routes

- `/` — the React page. Sections are migrated here one at a time; today it has the Hero.
- `/legacy` — the original Framer export (`public/index.html`), served byte for byte for
  visual comparison.

## Structure

- `framer/` — components exported from the Framer project with `npx unframer 815f6a41f6dbdd5f --jsx`.
  Generated code, do not edit; re-run the export when the Framer project changes.
  `framer/styles.css` holds the colour tokens, fonts and base Framer styles.
- `components/atoms/` — reusable building blocks that wrap the Framer runtime (`unframer`):
  `FitTextHeading`, `AnimatedHeading` (per-character appear effect), `FloatingLabel`
  (appear + loop wavy label), `CtaButton`, `Breakpoint` (SSR-safe breakpoint gate).
- `components/sections/hero/` — the hero section: `HeroSection.tsx` (markup),
  `hero.content.ts` (copy, colours, animation values), `hero.module.css` (layout copied
  from the Framer CSS, including the tablet/phone overrides).
- `components/layout/PageFrame.tsx` — page shell matching Framer's root layout.
- `lib/breakpoints.ts` — Framer breakpoints (desktop ≥1200, tablet 810–1199, phone <810).

## Notes

- `reactStrictMode` is off (unframer requirement: double mounting breaks Framer animations).
- Oswald is self-hosted from `public/assets/...` (same files the Framer export uses).

## Hero wave colours

Edit `WAVE_PALETTE` in `components/sections/hero/hero.content.ts` to recolour the
moving cards. Each entry has a `background` and `foreground` (SVG logo colour),
in wave order; the palette repeats automatically. The current palette uses forest,
ink, lime, mint and sage to match Le bon dev. `WaveBrandCard.tsx` uses the supplied
SVG files in `public/logos/clients/` as alpha masks, preserving their shapes and
cutouts while applying `foreground`. No SVG edits are needed to change colours.
`BRAND_LOGOS` controls the six brands and their individual logo box sizes. The
supplied `cartes.json` guided the light/dark pairings; its background values do
not replace the existing wave palette.
