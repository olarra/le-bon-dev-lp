# Le bon dev

Site du studio, construit avec Next.js App Router, React et TypeScript.

## Démarrer

```bash
yarn install
yarn dev
```

Copier `.env.example` dans `.env.local` pour configurer `SITE_URL` et Mailjet.
`SITE_URL` reste `https://lebondev.fr` : cette origine unique alimente les URL
canoniques, les images de partage, le sitemap et les données structurées. Le domaine est indépendant
des traductions et pourra être changé ultérieurement.

Production : `yarn build`, puis `yarn start`. Les tests, builds de validation et
vérifications visuelles ne sont exécutés que sur demande explicite.

## Architecture

- `app/[lang]/layout.tsx` : document HTML avec sa langue, polices et métadonnées traduites.
- `app/[lang]/(site)/layout.tsx` : navigation, cadre et pied de page communs.
- `app/[lang]/(site)/page.tsx` : composition de la landing page côté serveur.
- `app/[lang]/(legal)/` : mentions légales et confidentialité dans les trois langues.
- `app/api/contact/route.ts` : réception du formulaire et envoi via Mailjet.
- `app/api/estimation/route.ts` : réception des réponses du parcours d’estimation.
- `lib/email/` : templates HTML et texte de contact et d’estimation, traductions et images intégrées.
- `app/robots.ts`, `app/sitemap.ts` : routes SEO natives.
- `lib/seo/` : métadonnées de partage et contenu des cartes Open Graph en FR/EN/ES.
- `lib/i18n/` : langues autorisées, dictionnaires typés et chargement côté serveur.
- `components/sections/<section>/` : vue, contenu, CSS Module et hooks de la section.
- `components/layout/` : navigation et structure du site.
- `components/atoms/` : petits éléments partagés, dont titres, boutons et rubans.
- `components/ui/` : interactions partagées (scroll, stickers, révélation de texte).
- `hooks/` : comportements React réutilisables.
- `lib/` : configuration, types et logique indépendante du rendu.
- `public/images/`, `public/fonts/`, `public/logos/` : assets locaux.
- `holographic-card/` : source de référence vgpu conservée ; l’adaptation aux
  blobs est documentée dans `components/sections/guarantees-timeline/README.md`.
- `fluid/` : source officielle de l’exemple Interactive Fluid ; l’essai de fond
  WebGPU du Hero est documenté dans `components/sections/hero/README.md`.
- `tests/` : tests existants de progression, géométrie et nettoyage des animations.

L’export Framer, ses chunks, styles, adaptations de runtime et assets obsolètes
ont été retirés. Ils restent dans l’historique Git. `/`, `/legacy` et `/index.html`
redirigent directement et définitivement vers `/fr`.

## Conventions

- Garder les pages et le contenu statique côté serveur ; réserver `use client` aux interactions.
- Les composants décrivent le rendu ; les hooks possèdent l’état et les effets,
  avec leur nettoyage. Les calculs métier restent dans `lib/`.
- Garder les fichiers d’une section ensemble. Extraire un élément lorsqu’il a
  plusieurs usages ; éviter les imports de styles ou de contenu entre sections.
- Les CSS Modules portent les styles locaux. Les tokens, le reset et les
  utilitaires globaux restent dans `app/globals.css`.
- Les titres partagent `AnimatedHeading` et `lib/motion.ts`. Le texte est présent
  dans le HTML serveur ; le hero possède un seul `h1`.
- Utiliser les outils présents : Motion pour les caractères et valeurs animées,
  GSAP pour les séquences au scroll, WAAPI pour les effets locaux, Lenis pour le document.
- Libérer écouteurs, observateurs et animations au démontage. Préserver le rendu
  statique et `prefers-reduced-motion`.
- Conserver une page par langue ; les rubriques sont des ancres dans cette page.

## Langues et navigation

Les routes déclaratives Next.js sont `/fr`, `/en` et `/es`, sans segment `/home`.
`generateStaticParams` fournit ces trois langues ; les autres préfixes sont refusés.
La version espagnole est commune à l’Espagne et au Mexique. Aucune redirection
n’est décidée à partir de l’IP ou de la langue du navigateur.

Chaque page a son titre, sa description, son URL canonique, ses métadonnées sociales
et ses liens `hreflang` réciproques `fr`, `en`, `es` et `x-default` vers `/fr`.
Le sitemap expose les mêmes trois URL et leurs variantes. Les données structurées
décrivent le studio, le site et la page courante sans inventer d’adresse locale.

Les cartes Open Graph sont des JPEG de 1200 × 630 px : une composition pour
le studio et une pour l’estimation, chacune en français, anglais et espagnol.
Les métadonnées déclarent les URL publiques absolues, les dimensions, le type
et le texte alternatif ; X utilise `summary_large_image`. Le logo du studio
et l’image de la page figurent aussi dans les données structurées de l’accueil.
Les fichiers sont dans `public/images/social/`, avec une galerie locale dans
`design/social-cards/index.html`. Voir `design/social-cards/README.md` pour
les sources Figma, la composition et les adaptations. Aucune route de
prévisualisation ni génération d’image lors d’un partage n’est ajoutée.

Les dictionnaires sont chargés côté serveur, puis seule la copie utile est passée
à chaque composant. Le français réutilise les contenus de section existants ;
`lib/i18n/en.ts` et `es.ts` contiennent les traductions. Les marques et interfaces
illustrées des projets restent celles des réalisations présentées.

Le menu dessert Garanties, Offres, Réalisations, Méthode et Studio ; le bouton
de contact dessert `#contact`. `SectionNavigation` (dans `smooth-scroll.tsx`)
intercepte les liens de la page, met à jour le fragment et confie le défilement à
Lenis, avec le décalage du header défini dans `app/globals.css`. Le focus rejoint
la section à l’arrivée ; le mouvement réduit utilise un déplacement immédiat.
Les ancres restent identiques dans toutes les langues.
Le sélecteur propose des liens accessibles et indexables et reprend la section
consultée lors du changement de langue. Les menus mobiles se ferment sur navigation.

## Contenu et formulaire

Les coordonnées sont dans `lib/contact.ts`, le domaine dans `lib/site.ts`, les
métadonnées traduites dans `lib/i18n/`. Les polices Morna, Outfit et Caveat sont
chargées par `next/font/local`.

Le formulaire envoie un JSON à `/api/contact`. `lib/contact-form.ts` définit les
identifiants de projet et les règles de saisie. La route appelle directement
`sendMailjet({ to, subject, text, html, replyTo, inlineAttachments })` pour notifier le studio puis confirmer
dans la langue du visiteur, suivant le déroulé du projet de référence.
La route lit le corps avec `request.json()` et valide les champs avant l’envoi.
Le helper `lib/mailjet.ts` utilise l’API Mailjet v3.1 avec un délai maximal de 8 secondes.
L’adresse du visiteur est utilisée en Reply-To. L’échec de la confirmation ne fait
pas échouer une demande déjà reçue par le studio. Le formulaire conserve la saisie
en cas d’erreur et empêche un second envoi pendant la requête. Sans JavaScript,
les liens e-mail et WhatsApp restent disponibles.

Les deux formulaires utilisent le template approuvé, dont l’aperçu est conservé
dans `design/email-proposal/index.html`. `lib/email/layout.ts` porte la mise en page
commune (forest, lime, logo et signature), `lib/email/contact.ts` et
`lib/email/estimation.ts` composent les variantes visiteur et studio. Les textes
existent en français, anglais et espagnol. La confirmation de contact est courte ;
celle d’estimation contient les six groupes de réponses complets et les coordonnées.
Les notifications au studio contiennent les informations soumises, la langue,
la date de réception lisible dans le fuseau Europe/Paris et, pour l’estimation,
la source du parcours. Le mail « Prise de contact — … » reçu par le studio est
distinct de « Votre message est bien arrivé — Le bon dev » envoyé au visiteur :
c’est cette seconde variante qui correspond à la proposition de confirmation.
Les quatre variantes incluent la même signature avec le symbole forest, le nom,
le rôle et les coordonnées du studio, ainsi que son équivalent en texte brut.

Le HTML et une version texte sont générés côté serveur puis transmis à Mailjet
en `HTMLPart` et `TextPart`. Aucun SDK, `TemplateID` ou template à créer sur la
plateforme n’est nécessaire. Les trois PNG des e-mails et les quatre polices
utilisées ont été transférés sur l’espace LWS le 23 octobre 2026. La configuration
locale utilise `MAIL_ASSET_BASE_URL=https://lebondev.fr` ; reprendre cette valeur
dans les environnements de préproduction et de production.
Les logos utilisent alors `/images/email/…` en HTTPS et aucune image n’est jointe
au message. Cela évite leur réaffichage en pièces jointes sous le mail, observé
sur la capture Apple Mail. Tant que cette variable reste vide, les images
conservent le secours `cid:` pour les essais locaux ; ce secours peut toujours
être affiché une seconde fois par certaines messageries.
Les données saisies sont échappées avant leur insertion dans le HTML. La mise en
page utilise des tableaux et des styles intégrés, avec une adaptation mobile et
une police de remplacement si Morna ou Outfit ne sont pas prises en charge.
Les polices sont chargées depuis `/fonts/` sur la même base HTTPS ; le serveur
autorise leur chargement depuis les messageries avec un en-tête CORS limité à
ces fichiers. Sur LWS, `fonts/.htaccess` a été publié avec cette règle et les
types MIME des polices. Les transferts FTP ont été acceptés ; l’accès HTTPS et
les en-têtes HTTP n’ont pas été contrôlés. Les polices de marque ne sont pas garanties dans toutes les
messageries ([compatibilité `@font-face`](https://www.caniemail.com/features/css-at-font-face/)).
Le rendu reçu reste à confirmer par un essai utilisateur.

Les images publiques sont dans `public/images/email/`, leur secours intégré
dans `lib/email/assets.ts`. Après modification des SVG de marque, les régénérer
avec `node scripts/generate-email-assets.cjs` ; cette commande produit les images
sans envoyer de message. Elle utilise `sharp`,
déjà fourni par l’installation Next.js. Le transport suit la documentation
[Send API v3.1](https://dev.mailjet.com/docs/email-api/send-api-v31/send-basic-email)
et [images intégrées](https://dev.mailjet.com/docs/email-api/send-api-v31/send-attached-files).

`design/email-proposal/index.html` s’ouvre directement comme fichier local, sans
serveur ni route de prévisualisation dans l’application. Il contient les quatre
variantes réellement générées, avec des données fictives, les trois langues et
les largeurs mobile/ordinateur. Les images et les polices utilisent les mêmes
URL HTTPS LWS que les envois.
Après modification des templates ou de leurs textes, `yarn email:proposal`
remplace cet HTML à partir des fonctions de `lib/email/` utilisées par les API.
Le script `scripts/generate-email-proposal.cjs` génère uniquement cet artefact :
il ne charge pas les clés Mailjet et n’envoie aucun message. Un aperçu dans le
navigateur ne constitue pas une vérification du rendu dans les messageries.

Pour activer l’envoi, renseigner côté serveur, en local et chez l’hébergeur :

- `MAIL_MJ_API_KEY_PUBLIC` et `MAIL_MJ_API_KEY_PRIVATE` : clés du compte Mailjet.
- `MAIL_USERNAME` : expéditeur autorisé et boîte de réception du studio, par exemple
  `hello@lebondev.fr`, comme dans le projet de référence.
- `MAIL_ASSET_BASE_URL` : base HTTPS publique contenant `/images/email/` et
  `/fonts/` : `https://lebondev.fr` pour les fichiers publiés sur LWS. La valeur
  peut être identique dans tous les environnements d’envoi ; ne pas utiliser
  `localhost`. Conserver ces chemins lors du déploiement du site ou d’un
  changement de pointage DNS pour que les anciens e-mails gardent leurs images.

Ces variables ne doivent pas porter le préfixe `NEXT_PUBLIC_`. L’API répond avec
une indisponibilité si elles manquent. Aucun e-mail de test n’est envoyé au démarrage.
Le serveur valide les champs et leur longueur, ainsi qu’un champ piège anti-spam.
Il n’applique pas de limite de fréquence ni de limite personnalisée sur le corps HTTP.
Les demandes ne sont pas stockées en base et les erreurs ne journalisent pas leur contenu.

Le formulaire d’estimation suit les sept étapes de `estimation-poc.html`.
Les CTA du Hero, des offres et de l’encart Estimation ouvrent le parcours dans
un panneau via la route interceptée `app/[lang]/@estimate/(.)estimation`.
L’URL `/{lang}/estimation`, ouverte directement ou rechargée, affiche le même
formulaire dans une page dédiée, avec contenu rendu côté serveur, métadonnées,
canonical, hreflang et entrée dans le sitemap. `/estimation` redirige vers la
version française ; `?type=site` et `?type=webapp` préremplissent le projet.

Le parcours utilise `/api/estimation` et le même transport Mailjet que le contact.
Les réponses sont conservées localement jusqu’à l’envoi réussi, puis effacées.
Cette route limite le JSON à 32 000 caractères et valide les choix et les textes.
Elle ne stocke pas de demandes en base. La confirmation reste un état du
formulaire, sans URL distincte. Voir `components/estimation/README.md`.

La FAQ est placée entre l'encart Estimation et le formulaire de contact. Ses dix
questions, réparties en trois groupes, reprennent la rédaction française validée
dans `wireframe_faq_le_bon_dev_final_v2.html`, avec traductions en anglais et en
espagnol. Les catégories fonctionnent comme des onglets : seul le groupe choisi
est affiché, avec un fondu dans une zone de hauteur stable au changement. Sans
JavaScript, les trois groupes et leurs accordéons natifs restent accessibles.
Les liens d'estimation ouvrent
le même parcours que les autres CTA. Voir `components/sections/faq/README.md`.

## Points restants avant publication

Le fonctionnement de l'envoi d'e-mails a été confirmé par le propriétaire du site.
La bannière compacte de confirmation du contact est également validée.
Les cartes Open Graph Studio et Estimation, déclinées en FR/EN/ES avec
symbole entier et bande latérale, sont validées par le propriétaire.
Le format et le contenu des pages Mentions légales et Confidentialité ont été
validés par le propriétaire. Les renseignements manquants seront fournis lors
de la préparation de la mise en production.
La même configuration Mailjet sera utilisée dans les différents environnements,
production comprise. Ce point n'est plus en attente.
Les templates de contact et d’estimation sont intégrés dans le code, en trois
langues, pour les confirmations visiteurs et les notifications au studio.

- Reprendre `MAIL_ASSET_BASE_URL=https://lebondev.fr` dans la configuration du
  futur hébergement du site (fichiers publiés sur LWS, configuration locale faite).
  Confirmer le rendu par un essai utilisateur depuis chacun des formulaires :
  confirmation visiteur, notification studio et réponse au message.
- Lors de la préparation de la mise en production, compléter les renseignements
  des pages Mentions légales et Confidentialité
  dans `lib/legal/details.ts` : identité juridique, responsable de publication,
  hébergement et durée de conservation. Les pages sont intégrées en FR/EN/ES,
  avec liens dans le footer et les formulaires, et affichent explicitement leur
  statut provisoire. Elles restent non indexées et hors sitemap tant que ces
  renseignements manquent. Voir `components/legal/README.md`.
- Connecter le dépôt distant et préparer le déploiement.
- Réaliser la recette finale sur demande explicite : mobile et desktop,
  langues, navigation, performance et accessibilité, ainsi que les aperçus
  WhatsApp et réseaux sociaux une fois les pages et images accessibles publiquement.

## Apparitions au défilement

`RevealController`, monté dans le layout du site, déclenche les éléments
`data-reveal` à 68% du viewport, 72% sous 810 px. `data-reveal-group` donne une
séquence aux voisins proches (120 ms, délai total plafonné à 240 ms) et laisse
les éléments empilés plus bas attendre leur propre position de lecture.
`data-reveal-anchor` rattache une petite composition, comme une étape Méthode,
à son texte. L’opacité monte en 0,7 s et le déplacement se pose en 1,1 s.
Le rythme est dans `lib/motion.ts` ; les poses CSS dans `app/globals.css` sont
lues directement par JavaScript pour éviter toute divergence aux breakpoints.
Les styles inline sont nettoyés après chaque entrée. Mouvement réduit, focus,
restauration du scroll et absence de JavaScript conservent le contenu accessible.
`AnimatedHeading`, le Hero et l’entrée Garanties gardent leurs systèmes dédiés.

Le pied de page réserve le mouvement lié au scroll au grand lettrage opaque,
derrière un cadre immobile. Voir `components/layout/README.md`.

Références étudiées : [iPhone, Apple](https://www.apple.com/iphone-18-pro/)
(groupes explicites et transitions distinctes d’opacité / déplacement) et
[parallaxe, ProtoPie](https://www.protopie.io/blog/parallax-effect)
(vitesses différentes entre plans). Les seuils ci-dessus sont adaptés à cette
page et à ses mesures de scroll, pas repris comme une règle universelle d’Apple.
