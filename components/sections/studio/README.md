# Le studio

- `StudioSection.tsx` assemble le contenu serveur, les chiffres et les convictions.
- `studio.content.ts` contient les textes, images et réglages de la photo.
- `StudioHeading` utilise `AnimatedHeading` et `HEADING_REVEAL` de `lib/motion.ts`.
  Les positions de couleur des lettres sont définies dans le rendu React.
- `StudioScene` et `studio-scene-motion.ts` séparent la vue de la séquence
  jour → coucher de soleil → nuit. La photo démarre lorsqu’elle est visible,
  indépendamment du scroll du texte, et possède une commande de replay.
- `MagicText` révèle les mots du haut au bas du texte sur une même ligne à
  85% du viewport. Dès que la dernière ligne atteint ce seuil, tout le texte
  a sa couleur sombre finale. La progression suit directement le scroll,
  sans retard de rattrapage, sur desktop, tablette et téléphone.
- `StickerSurface` et `MetalSticker`
  partagent l’effet du contact : une lampe fixe au-dessus du viewport éclaire les
  icônes pendant le défilement, le reflet balayant chaque icône visible tandis
  qu’elle s’incline jusqu’à 5° avec la vitesse. À l’arrêt, elle revient à plat
  aussitôt et le reflet s’estompe en 0,7 s environ sans changer de place.
  Un curseur à moins de 3,5 fois sa taille (320 px au minimum) reprend la
  lumière : l’inclinaison, limitée à 10°, croît avec l’écart puis revient à plat
  vers le bord de la portée. Le déplacement reste minime. Le bouclier, presque
  noir, déclare `tone: "dark"` : sa finition est ajoutée en lumière teintée de
  lime et masquée hors de son contenu clair.
  Aucun composant dédié au studio. Sur mobile, un appui près d’une icône garde
  son effet jusqu’au relâchement, même si le doigt défile ensuite. Les autres
  gestes de défilement n’activent pas les icônes ; les gestes natifs restent libres.
- La pastille, chaque repère, les convictions et l’en-tête des technologies
  portent `data-reveal`. Les repères, convictions et en-têtes forment des
  `data-reveal-group` distincts. Les repères sous le bouton et les convictions
  du bandeau inférieur utilisent `data-reveal-viewport="0.9"` : leur arrivée
  commence à 90% du viewport sur desktop, tablette et téléphone, dès que cette
  zone entre à l’écran. La pastille et l’en-tête des technologies gardent 68%
  (72% sur téléphone). Séquence de 120 ms plafonnée à 240 ms, opacité en 0,7 s
  et pose en 1,1 s.
  Les convictions empilées attendent leur propre position de lecture ; les
  éléments distants ne sont jamais entraînés par le premier de leur groupe.
  `SCROLL_REVEAL` dans `lib/motion.ts` règle le rythme. Le contrôleur lit les
  poses CSS : montée de 28 / 24 / 20 px sur desktop / tablette / téléphone.
  Les tailles de pastille et de titre viennent des tokens de `app/globals.css`.
- `ResinCta` fournit le bouton partagé, avec une flèche tournée au survol ici.
- `StudioEcosystem` présente les technologies ; `integrations.content.ts`
  contient les noms, assets et paramètres des trois rubans.

Les images locales conservent leur format 2:3. Les modes statique et réduit
conservent le contenu visible.
