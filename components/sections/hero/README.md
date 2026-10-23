# Hero

`HeroSection` compose le titre, les actions, le fond et le ruban de logos.
`hero.content.ts` contient textes, palette, logos, tracé et vitesse du ruban.
`useHeroMotion` conserve la parallaxe du titre et suspend les décors hors écran.

## Ruban de logos

Le `Ticker` suit un tracé SVG avec rotation des cartes et variantes desktop,
tablette et téléphone. Sur téléphone, son conteneur conserve au moins 640 px de
large, centré et recadré par le hero : l’onde reste ample et la vitesse calculée
en pourcentage du tracé ne diminue plus avec les écrans étroits.
`pauseOnHover={false}` conserve le mouvement quand le pointeur approche.
La pause hors écran et le mouvement réduit restent prioritaires.

Chaque `WaveBrandCard` conserve son fond, ses dimensions, ses coins arrondis et
son logo SVG masqué, avec les couleurs définies dans `hero.content.ts`.
Les cartes utilisent uniquement HTML/CSS, sans canvas, reflet holographique
ni interaction lumineuse au pointeur.

## Essai de fond fluide WebGPU

`HeroFluid` ajoute l’exemple vgpu **Interactive Fluid** derrière le contenu et le
ruban. Deux sources entretiennent les volutes au repos ; le pointeur ou le toucher
remue le fluide et dépose une traînée vert sauge à citron. Le rendu transparent
laisse apparaître le dégradé clair existant. `HERO_FLUID_ENABLED`, dans
`hero.background.ts`, permet de désactiver cet essai.

La source officielle complète est conservée dans `references/vgpu/fluid/`, avec sa provenance
et sa licence MIT. L’adaptation se trouve dans `./fluid/` :

- `simulation.ts` et les shaders conservent le solveur : advection, vorticité,
  divergence, pression, projection et buffers alternés. Grille de vitesse
  128 × 72, teinture 512 × 288, pas fixe de 1/60 s.
- Les sources et la traînée du pointeur utilisent le ratio réel du canvas pour
  calculer leur rayon, indépendamment de la grille fixe 16:9. Ce ratio est mis à
  jour au redimensionnement pour éviter des halos étirés sur un écran vertical.
- Les couleurs des sources et du pointeur passent au vert ; `display.wgsl`
  transforme la densité en opacité prémultipliée, plafonnée à 62 %, sur le fond
  clair. Le contour supérieur et inférieur s’estompe dans la section.
- `pointer-input.ts` écoute la section avec des événements passifs, sans capture
  du pointeur ni modification de `touch-action`, pour conserver les liens et
  le défilement tactile.
- `renderer.ts` limite le DPR à 1,5, suspend la boucle hors écran et dans un
  onglet masqué, et remet l’horloge à zéro à la reprise. Le démontage et les
  erreurs libèrent la boucle, les écouteurs, les observateurs et le contexte GPU.

Le chargement est dynamique. Sans WebGPU, en mouvement réduit ou en couleurs
forcées, le fond CSS reste affiché. Les préférences sont suivies en direct.
`vgpu` et le chargeur WGSL étaient déjà installés ; aucune dépendance ajoutée.
Cet essai n’a pas fait l’objet de vérifications automatisées ou visuelles.

L’holographie vgpu reste utilisée pour les blobs de « Nos garanties », documentés
dans `components/sections/guarantees-timeline/README.md`. La source de référence
et sa licence MIT sont conservées dans `references/vgpu/holographic-card/`.

## Traductions

HeroSection reçoit les textes traduits du Hero et de TopBar via les props `copy` et `topbar`. La géométrie du ruban, les logos et le fluide WebGPU gardent leur configuration existante.
Les dictionnaires sont chargés côté serveur depuis `lib/i18n/` pour `/fr`, `/en`
et `/es`, puis seule la langue active est transmise à la section.
