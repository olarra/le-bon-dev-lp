# Cartes de partage — Le bon dev

Les six JPEG sont déjà générés dans `public/images/social/`. Ils sont utilisés
par les pages du site ; aucune génération n’est nécessaire lors d’un partage.
Ouvrir `index.html` directement pour consulter les deux compositions en FR/EN/ES.
Cette galerie reste un fichier de travail local, sans route de prévisualisation.
Les JPEG et les polices sont intégrés au HTML pour éviter les refus d’accès aux
fichiers liés en navigation locale. Un clic agrandit la carte dans la galerie ;
« Télécharger » enregistre le JPEG intégré. Aucun accès à un autre dossier ni
serveur local n’est nécessaire pour la consulter.

## Direction graphique

La page [Business Cards du design system Figma](https://www.figma.com/design/mMjUU8E3UANlGiw9gjhUhr/Le-Bon-Dev-%E2%80%94-Design-System?node-id=59-2)
a servi de référence : typographie affirmée et grands aplats. Le symbole de
marque est entièrement visible et centré dans la bande latérale. Le logo et
le symbole proviennent des SVG déjà intégrés au site.
Les couleurs sont celles du site validé : forêt `#203e33`, forêt sombre `#14271e`,
lime `#c8f53e` et crème `#f4f2ec`. Les polices sont Morna et Outfit.

- **Studio** : fond forêt, signature « Votre vision. Notre savoir-faire. »,
  bande forêt plus claire, symbole lime et rappel de l’activité. Utilisé sur
  l’accueil et les pages légales.
- **Estimation** : fond crème, bande lime et titre « Votre projet commence ici. ».
  Le délai annoncé reste celui du formulaire : 24 heures ouvrées.

Les deux compositions réservent le tiers droit à une bande de 400 px. Le
symbole de 320 px y est centré avec 40 px de marge de chaque côté ; le libellé
et le domaine partagent cet axe. Le texte principal reste dans la colonne gauche.

Les cartes font 1200 × 630 px, en JPEG sans transparence. Les textes, les logos
et les polices sont incorporés à l’image ; le réseau social n’a pas à charger
une police, exécuter du JavaScript ou appeler un service de génération.

## Métadonnées et SEO

`lib/seo/social.ts` fournit l’Open Graph complet à chaque page : titre,
description, URL canonique publique, langue, image, dimensions, type et texte
alternatif. X reçoit `summary_large_image`. Les pages d’estimation utilisent
leur propre composition, y compris la route interceptée du formulaire.

Les titres, descriptions, canonical et hreflang existants sont conservés.
Le JSON-LD du site inclut désormais le logo du studio et l’image représentative
de chaque accueil traduit. Les grands aperçus d’image sont autorisés par
`max-image-preview:large`. Les pages légales incomplètes gardent leur `noindex`.

La version de Next.js du projet inclut WhatsApp, Facebook, LinkedIn, X,
Slack et Discord dans ses agents recevant les métadonnées dans le HTML initial.
Aucune configuration supplémentaire ni détection de navigateur n’est ajoutée.

Les URL d’image reposent sur `SITE_URL=https://lebondev.fr` et deviennent
publiques avec le déploiement du site. Ne pas déplacer ou protéger
`public/images/social/`. Le recadrage et la mise en cache restent propres
à chaque service. La galerie locale montre les fichiers livrés, pas une
simulation de ces services.

## Modifier les cartes

- Textes, traductions, descriptions d’image et version : `lib/seo/social-cards.json`.
- Composition, couleurs et export : `scripts/generate-social-cards.cjs`.
- Balises utilisées par les pages : `lib/seo/social.ts`.

Après modification de la composition ou des textes, `yarn social:cards`
régénère les JPEG et cette galerie, sans lancer le site ni accéder à un service
externe. Les métadonnées et l’export utilisent le même manifeste pour les noms
de fichier. Lors d’un changement d’image après publication, augmenter la
version du manifeste et conserver les anciens fichiers pour les liens en cache.

## Références et état

- [Open Graph : images, dimensions, type et textes alternatifs](https://ogp.me/).
- [LinkedIn : images de partage et ratio recommandé](https://www.linkedin.com/help/linkedin/answer/a521928/making-your-website-shareable-on-linkedin?lang=en).
- [Next.js : métadonnées et images Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).

Création et intégration effectuées le 23 octobre 2026. Le propriétaire a validé
les deux compositions et leurs déclinaisons, avec symbole entier et bande
latérale élargie. Aucune vérification
visuelle, aucun test, lint, contrôle TypeScript, build de validation ou essai
de partage n’a été exécuté, conformément à la préférence du propriétaire.
Les aperçus réels seront à examiner après déploiement, sur demande explicite.
