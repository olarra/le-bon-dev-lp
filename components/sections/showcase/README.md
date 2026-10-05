# Les réalisations

`ShowcaseSection` définit la surface ; `ShowcaseContent` compose les deux projets.
`realisations.content.ts` contient textes, destinations, assets et paramètres.
Sur mobile, chaque projet présente son texte et son bouton avant son illustration.

- `useShowcaseTheme` possède la transition noir → blanc des réalisations.
  Sur mobile, elle se termine dès que le haut de la section entre dans le viewport,
  sans délai de lissage ; sur desktop, elle suit l’arrivée des téléphones.
  La section Méthode conserve son fond sombre.
- `useShowcaseMotion` déroule les téléphones et la coloration du texte.
- Le téléphone central utilise `miau-auth-orange.png`, le visuel fourni avec
  le chat blanc et l’accueil orange. Le PNG conserve sa transparence et ses
  dimensions d’origine (895 × 1757), déclarées dans `PhoneImage`.
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
- La pastille, le sous-titre et les textes des projets portent `data-reveal`.
  Le `RevealController` attend la ligne de lecture à 68% du viewport, 72% sur
  téléphone. L’en-tête forme un `data-reveal-group` : seuls les éléments proches
  partagent le décalage de 120 ms, limité à 240 ms. Les textes de projet arrivent
  depuis leur côté (24 px sur desktop, 20 px sur tablette), puis verticalement
  sous 810 px. L’opacité monte en 0,7 s et le déplacement se pose en 1,1 s.
  Les poses viennent de `app/globals.css`, le rythme de `lib/motion.ts`.
  `AnimatedHeading` conserve son animation de lettres. Les tailles de pastille
  et de titre viennent des tokens partagés de `app/globals.css`.
- `ResinGallery` superpose galerie, moniteur en résine et reflet. Les réglages
  de mouvement et d’alignement restent dans le composant et son CSS Module.
  Le cadre fourni `resin-monitor-wide.png` (1448 × 1086) conserve ses pixels et
  sa transparence ; le CSS recadre ses marges et aligne la galerie ainsi que le
  masque du reflet sur son ouverture, en gardant les deux pieds visibles.
- `SvgFollowScroll` suit les deux visuels ; `showcase-thread.ts` définit le tracé
  et la fin automatique du dessin à l’arrivée du moniteur. La ligne est masquée
  sur mobile.
  Le tracé desktop dessine une vague en S : il revient vers la gauche au-dessus
  des téléphones, s’arrondit vers leur côté droit, puis repart vers le moniteur
  dans une large courbe sous les appareils. Les segments partagent une tangente
  verticale à chaque raccord ; leurs poignées couvrent la moitié de chaque
  intervalle pour éviter les virages serrés. Les points suivent les visuels sur
  desktop et tablette, avec une progression verticale descendante pour le suivi
  au scroll. Le repli serveur utilise la même vague ; les deux tracés compacts
  conservent chacun leur courbe locale.

Les images locales sont dans `public/images/realisations/`.
Les boutons Miau et French Pixel Studio ouvrent leur site dans un nouvel onglet.
Les modes réduit et sans JavaScript conservent les projets visibles.

## Traductions

ShowcaseContent reçoit les textes des projets, les descriptions alternatives des images et les libellés accessibles via `copy`. Les assets et les liens vers les projets restent communs aux langues.
Les dictionnaires sont chargés côté serveur depuis `lib/i18n/` pour `/fr`, `/en`
et `/es`, puis seule la langue active est transmise à la section.
