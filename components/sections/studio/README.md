# Le studio

- `StudioSection.tsx` assemble le contenu serveur, les chiffres et les convictions.
- `studio.content.ts` contient les textes, images et réglages de la photo.
- `StudioHeading` utilise `AnimatedHeading` et `HEADING_REVEAL` de `lib/motion.ts`.
  Les positions de couleur des lettres sont définies dans le rendu React.
- `StudioScene` et `studio-scene-motion.ts` séparent la vue de la séquence
  jour → coucher de soleil → nuit. La photo démarre lorsqu’elle est visible,
  indépendamment du scroll du texte, et possède une commande de replay.
- `MagicText` révèle les mots au scroll ; `StickerSurface` et `MetalSticker`
  partagent l’effet du contact : seule l’icône visible la plus proche réagit sur
  toute la section. La distance atténue sa réaction sans la désactiver.
  L’inclinaison est limitée à 10°, le déplacement reste minime
  et les reflets sont discrets. Le simple défilement ramène les icônes au repos.
  Aucun composant dédié au studio. Sur mobile, un appui près d’une icône garde
  son effet jusqu’au relâchement, même si le doigt défile ensuite. Les autres
  gestes de défilement n’activent pas les icônes ; les gestes natifs restent libres.
- `ResinCta` fournit le bouton partagé, avec une flèche tournée au survol ici.
- `StudioEcosystem` présente les technologies ; `integrations.content.ts`
  contient les noms, assets et paramètres des trois rubans.

Les images locales conservent leur format 2:3. Les modes statique et réduit
conservent le contenu visible.
