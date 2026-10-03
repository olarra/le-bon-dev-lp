# Le bon dev

Site du studio, construit avec Next.js App Router, React et TypeScript.

## Démarrer

```bash
yarn install
yarn dev
```

Copier `.env.example` dans `.env.local` pour configurer `SITE_URL`, l’origine publique
utilisée par les URL canoniques, le sitemap et les données structurées.

Production : `yarn build`, puis `yarn start`. Les tests, builds de validation et
vérifications visuelles ne sont exécutés que sur demande explicite.

## Architecture

- `app/layout.tsx` : document HTML, polices locales, styles et métadonnées.
- `app/(site)/layout.tsx` : navigation, cadre et pied de page communs.
- `app/(site)/page.tsx` : composition de la landing page côté serveur.
- `app/robots.ts`, `app/sitemap.ts` : routes SEO natives.
- `components/sections/<section>/` : vue, contenu, CSS Module et hooks de la section.
- `components/layout/` : navigation et structure du site.
- `components/atoms/` : petits éléments partagés, dont titres, boutons et rubans.
- `components/ui/` : interactions partagées (scroll, stickers, révélation de texte).
- `hooks/` : comportements React réutilisables.
- `lib/` : configuration, types et logique indépendante du rendu.
- `public/images/`, `public/fonts/`, `public/logos/` : assets locaux.
- `holographic-card/` : source de référence vgpu conservée ; l’adaptation aux
  blobs est documentée dans `components/sections/guarantees-timeline/README.md`.
- `tests/` : tests existants de progression, géométrie et nettoyage des animations.

L’export Framer, ses chunks, styles, adaptations de runtime et assets obsolètes
ont été retirés. Ils restent dans l’historique Git. `/legacy` et `/index.html`
redirigent vers `/`.

## Conventions

- Garder les pages et le contenu statique côté serveur ; réserver `use client` aux interactions.
- Les composants décrivent le rendu ; les hooks possèdent l’état et les effets,
  avec leur nettoyage. Les calculs métier restent dans `lib/`.
- Garder les fichiers d’une section ensemble. Extraire un élément lorsqu’il a
  plusieurs usages ; éviter les imports de styles ou de contenu entre sections.
- Les CSS Modules portent les styles locaux. Les tokens, le reset et les
  utilitaires globaux restent dans `app/globals.css`.
- Les titres partagent `AnimatedHeading` et `lib/motion.ts`. Le texte est présent
  dans le HTML serveur ; le hero possède un seul `h1`.
- Utiliser les outils présents : Motion pour les caractères et valeurs animées,
  GSAP pour les séquences au scroll, WAAPI pour les effets locaux, Lenis pour le document.
- Libérer écouteurs, observateurs et animations au démontage. Préserver le rendu
  statique et `prefers-reduced-motion`.
- Créer les nouvelles routes dans `app/(site)/<route>/page.tsx` avec leurs métadonnées.

## Contenu et formulaire

Les fichiers `*.content.ts` centralisent le contenu de chaque section. Les coordonnées
sont dans `lib/contact.ts`, le SEO dans `lib/site.ts`. Les polices Morna, Outfit et
Caveat sont chargées par `next/font/local`.

Le formulaire prépare un brouillon dans la messagerie du visiteur.
`lib/contact-draft.ts` compose le message ; `use-contact-form.ts` gère saisie et copie.
Aucun service d’envoi ni stockage serveur n’est actuellement branché.

## Apparitions au défilement

`RevealController`, monté dans le layout du site, déclenche les éléments
`data-reveal` à 68% du viewport, 72% sous 810 px. `data-reveal-group` donne une
séquence aux voisins proches (120 ms, délai total plafonné à 240 ms) et laisse
les éléments empilés plus bas attendre leur propre position de lecture.
`data-reveal-anchor` rattache une petite composition, comme une étape Méthode,
à son texte. L’opacité monte en 0,7 s et le déplacement se pose en 1,1 s.
Le rythme est dans `lib/motion.ts` ; les poses CSS dans `app/globals.css` sont
lues directement par JavaScript pour éviter toute divergence aux breakpoints.
Les styles inline sont nettoyés après chaque entrée. Mouvement réduit, focus,
restauration du scroll et absence de JavaScript conservent le contenu accessible.
`AnimatedHeading`, le Hero et l’entrée Garanties gardent leurs systèmes dédiés.

Le pied de page réserve le mouvement lié au scroll au grand lettrage opaque,
derrière un cadre immobile. Voir `components/layout/README.md`.

Références étudiées : [iPhone, Apple](https://www.apple.com/iphone-18-pro/)
(groupes explicites et transitions distinctes d’opacité / déplacement) et
[parallaxe, ProtoPie](https://www.protopie.io/blog/parallax-effect)
(vitesses différentes entre plans). Les seuils ci-dessus sont adaptés à cette
page et à ses mesures de scroll, pas repris comme une règle universelle d’Apple.
