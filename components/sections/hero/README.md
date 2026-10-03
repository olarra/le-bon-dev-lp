# Hero

`HeroSection` compose le titre, les actions, le fond et le ruban de logos.
`hero.content.ts` contient textes, palette, logos, tracé et vitesse du ruban.
`useHeroMotion` conserve la parallaxe du titre et suspend les décors hors écran.

## Ruban et finition holographique

Le `Ticker` garde son parcours, sa rotation, sa vitesse et ses variantes desktop,
tablette et téléphone. `pauseOnHover={false}` conserve le mouvement quand le
pointeur approche. La pause hors écran et le mouvement réduit restent prioritaires.

Chaque `WaveBrandCard` conserve son fond, ses dimensions, ses coins arrondis et
son logo SVG. Un canvas transparent se place entre le fond et le logo ; le
`overflow: hidden` de la carte limite le reflet à sa surface. Sans interaction,
le canvas est invisible et la carte garde exactement son apparence initiale.

- `use-wave-hologram.ts` charge le moteur côté client si WebGPU est disponible.
  Il remplace les ressources quand les cartes changent au passage d’un breakpoint
  et les libère si le mouvement réduit ou les couleurs forcées sont activés.
- `wave-foil-renderer.ts` partage un contexte GPU et le cache des pipelines entre
  toutes les cartes actives. La résolution des petites surfaces est plafonnée à
  deux fois leurs dimensions CSS, indépendamment de leur rotation.
- Une lumière large suit le pointeur, même en dehors du ruban. Son rayon vaut
  32 % de la largeur du viewport, borné entre 220 et 420 px CSS. Il est converti
  dans les coordonnées de chaque carte pour garder une portée cohérente sur
  téléphone, tablette et desktop. Le shader atténue progressivement la lumière
  jusqu’au bord de ce champ ; la carte commence donc à refléter avant le survol.
  Le moteur applique seulement une transition sur les 64 derniers pixels de
  portée, sans cumuler deux fortes atténuations. L’intensité monte avec une
  constante de 110 ms et redescend avec une constante de 240 ms.
- Trois repères invisibles par carte convertissent le pointeur en coordonnées
  locales, rotation et échelle comprises, avec des API disponibles dans Firefox.
  Leur position est relue pendant le mouvement : même avec un pointeur immobile,
  les cartes traversent la lumière et leur reflet évolue. La gravure reste fixée
  à la surface ; la lumière n’éclaire jamais le fond du hero.
- Sur tactile, une pression joue le rôle du pointeur jusqu’au relâchement ou à
  l’annulation du geste. Les écouteurs sont passifs et laissent défiler la page.
- Le moteur dessine uniquement les cartes éclairées, à 60 images/s au maximum.
  Il s’arrête une fois les reflets éteints lorsque le pointeur est loin du ruban,
  et immédiatement quand le ruban ou l’onglet n’est plus visible.

`wave-foil.wgsl` adapte les gravures ondulées, la diffraction et la nacre de
l’exemple [Holographic Card de vgpu](https://vgpu.sh/examples/holographic-card).
La sortie utilise un alpha prémultiplié ; le fond graphite, le triangle et les
textes de démonstration sont remplacés par les cartes et logos existants. La
densité de gravure est adaptée aux petites cartes de 158 × 100 px.
Le reflet principal couvre une surface large, avec une bande lumineuse diffuse
et un éclat central élargi de moindre intensité. La gravure garde ses détails
sans concentrer toute la lumière dans un trait étroit.

La source complète téléchargée reste dans `holographic-card/`, accompagnée de
sa provenance et de sa licence MIT. Elle sert de référence et n’est pas importée
par le hero. `next.config.mjs` configure les imports WGSL pour webpack et
Turbopack ; `vgpu-env.d.ts` apporte leurs types.

Au démontage, au changement de breakpoint ou en cas d’échec/perte du GPU, le
moteur arrête sa boucle, retire ses écouteurs et observateurs et libère le contexte
avec ses ressources. Le rendu HTML/CSS reste visible en repli. Les préférences
de mouvement réduit conservent les cartes statiques et désactivent le reflet.

Cette intégration n’a pas fait l’objet de tests ou de vérification navigateur.
