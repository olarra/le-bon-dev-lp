# Le studio

- `StudioSection.tsx` assemble le contenu serveur, les chiffres et les convictions.
- `studio.content.ts` contient les textes, images et réglages de la photo.
- `StudioHeading` utilise `AnimatedHeading` et `HEADING_REVEAL` de `lib/motion.ts`.
  Les positions de couleur des lettres sont définies dans le rendu React.
- `StudioScene` et `studio-scene-motion.ts` séparent la vue de la séquence
  jour → coucher de soleil → nuit. La photo démarre lorsqu’elle est visible,
  indépendamment du scroll du texte, et possède une commande de replay.
- `MagicText` révèle les mots au scroll ; `StickerSurface` et `MetalSticker`
  partagent l’effet du contact : repos discret, puis reflets sur l’icône
  la plus proche du curseur. Le suivi couvre toute la section, photo et fond
  compris, avec une direction calculée depuis chaque icône jusqu’aux bords.
  Aucun reflet permanent ni composant dédié au studio.
  Sur mobile, un appui ou un mouvement du doigt pilote le même effet ; le
  relâchement ou le défilement le ramène au repos, sans bloquer les gestes natifs.
- `ResinCta` fournit le bouton partagé, avec une flèche tournée au survol ici.
- `StudioEcosystem` présente les technologies ; `integrations.content.ts`
  contient les noms, assets et paramètres des trois rubans.

Les images locales conservent leur format 2:3. Les modes statique et réduit
conservent le contenu visible.
