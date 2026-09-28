# Nos garanties

- `GuaranteesTimelineSection` rend les textes et le titre côté serveur.
- `GuaranteesTimeline` compose la timeline desktop et les cartes mobiles.
- `morph-controller.ts` possède déclenchements, progression et nettoyage.
- `morph-progress.ts` et `mobile-stack-layout.ts` contiennent les calculs purs.
- `morph-renderer.ts` gère les illustrations, avec des images de repli.
- `GuaranteeArt` rend les blobs inline : identifiants uniques, tracé maître
  `data-morph-path` et couches qui le réutilisent avec `use`.
- `morph-content.ts` centralise les tracés, palettes et échelles des illustrations.

Les couleurs suivent le morphing ; éclairage et filtres restent fixes.
Chaque carte statique utilise le matériau et le tracé correspondant à son contenu.
Les ombres peuvent dépasser le SVG.
