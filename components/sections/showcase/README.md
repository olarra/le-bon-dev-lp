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
  métadonnées. `useStickerMotion` éclaire les icônes depuis une lampe fixe au-dessus
  du viewport : pendant le défilement, le reflet balaie chaque icône visible et
  elle s’incline jusqu’à 5° avec la vitesse. À l’arrêt, elle revient à plat
  aussitôt tandis que le reflet s’estompe en 0,7 s environ sans changer de place.
  Un curseur à moins de 3,5 fois sa taille (320 px au minimum) reprend la lumière :
  l’inclinaison, limitée à 10°, croît avec l’écart puis revient à plat vers le
  bord de la portée. Un appui près d’une icône conserve son effet jusqu’au
  relâchement du doigt.
  `FEATURE_FLAG_RESINE_ICON_ENABLED` permet de rétablir les anciennes icônes.
- `ResinGallery` superpose galerie, moniteur en résine et reflet. Les réglages
  de mouvement et d’alignement restent dans le composant et son CSS Module.
- `SvgFollowScroll` suit les deux visuels ; `showcase-thread.ts` définit le tracé
  et la fin automatique du dessin à l’arrivée du moniteur. La ligne est masquée
  sur mobile.

Les images locales sont dans `public/images/realisations/`.
Les boutons Miau et French Pixel Studio ouvrent leur site dans un nouvel onglet.
Les modes réduit et sans JavaScript conservent les projets visibles.
