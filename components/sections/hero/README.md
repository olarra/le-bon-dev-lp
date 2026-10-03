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
ni interaction lumineuse au pointeur. Le Hero ne charge plus de moteur WebGPU.

L’holographie vgpu reste utilisée pour les blobs de « Nos garanties », documentés
dans `components/sections/guarantees-timeline/README.md`. La source de référence
et sa licence MIT sont conservées dans `holographic-card/`.
