# Les réalisations

`ShowcaseSection` définit la surface ; `ShowcaseContent` compose les deux projets.
`realisations.content.ts` contient textes, destinations, assets et paramètres.

- `useShowcaseTheme` possède la transition noir → blanc à l’arrivée de Miau.
  La section Méthode conserve son fond sombre.
- `useShowcaseMotion` déroule les téléphones et la coloration du texte.
- `AnimatedHeading` partage les réglages de `lib/motion.ts` ; `ResinCta` est
  commun aux projets et au studio.
- `ResinGallery` superpose galerie, moniteur en résine et reflet. Les réglages
  de mouvement et d’alignement restent dans le composant et son CSS Module.
- `SvgFollowScroll` suit les deux visuels ; `showcase-thread.ts` définit le tracé
  et la fin automatique du dessin à l’arrivée du moniteur.

Les images locales sont dans `public/images/realisations/`.
Le bouton Miau reste désactivé tant que son URL est absente du contenu.
Les modes réduit et sans JavaScript conservent les projets visibles.
