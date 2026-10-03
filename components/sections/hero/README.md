# Hero

`HeroSection` compose le titre, les actions, le fond et le ruban de logos.
`hero.content.ts` contient textes, palette, logos, tracé et vitesse du ruban.
`useHeroMotion` conserve la parallaxe du titre et suspend les décors hors écran.

## Ruban de logos

Le `Ticker` garde son parcours, sa rotation, sa vitesse et ses variantes desktop,
tablette et téléphone. `pauseOnHover={false}` conserve le mouvement quand le
pointeur approche. La pause hors écran et le mouvement réduit restent prioritaires.

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

La source officielle complète est conservée dans `/fluid/`, avec sa provenance
et sa licence MIT. L’adaptation se trouve dans `./fluid/` :

- `simulation.ts` et les shaders conservent le solveur : advection, vorticité,
  divergence, pression, projection et buffers alternés. Grille de vitesse
  128 × 72, teinture 512 × 288, pas fixe de 1/60 s.
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
et sa licence MIT sont conservées dans `holographic-card/`.
