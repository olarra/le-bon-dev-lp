# Les réalisations

`ShowcaseSection` définit la surface ; `ShowcaseContent` compose les deux projets.
`realisations.content.ts` contient textes, destinations, assets et paramètres.
Sur mobile, chaque projet présente son texte et son bouton avant son illustration.

- `useShowcaseTheme` possède la transition noir → blanc des réalisations.
  Sur mobile, elle se termine dès que le haut de la section entre dans le viewport,
  sans délai de lissage ; sur desktop, elle suit l’arrivée des téléphones.
  La section Méthode conserve son fond sombre.
- `useShowcaseMotion` déroule les téléphones et la coloration du texte.
- `AnimatedHeading` partage les réglages de `lib/motion.ts` ; `ResinCta` est
  commun aux projets et au studio.
- `OfferSticker` partage les SVG métalliques des offres, à 40 px dans les
  métadonnées. `useStickerMotion` anime le sticker le plus proche du curseur.
  `FEATURE_FLAG_RESINE_ICON_ENABLED` permet de rétablir les anciennes icônes.
- `ResinGallery` superpose galerie, moniteur en résine et reflet. Les réglages
  de mouvement et d’alignement restent dans le composant et son CSS Module.
- `SvgFollowScroll` suit les deux visuels ; `showcase-thread.ts` définit le tracé
  et la fin automatique du dessin à l’arrivée du moniteur. La ligne est masquée
  sur mobile.

Les images locales sont dans `public/images/realisations/`.
Le bouton Miau reste désactivé tant que son URL est absente du contenu.
Les modes réduit et sans JavaScript conservent les projets visibles.
