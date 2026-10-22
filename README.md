# Le bon dev

Site du studio, construit avec Next.js App Router, React et TypeScript.

## Démarrer

```bash
yarn install
yarn dev
```

Copier `.env.example` dans `.env.local` pour configurer `SITE_URL` et Mailjet.
`SITE_URL` reste `https://lebondev.fr` : cette origine unique alimente les URL
canoniques, le sitemap et les données structurées. Le domaine est indépendant
des traductions et pourra être changé ultérieurement.

Production : `yarn build`, puis `yarn start`. Les tests, builds de validation et
vérifications visuelles ne sont exécutés que sur demande explicite.

## Architecture

- `app/[lang]/layout.tsx` : document HTML avec sa langue, polices et métadonnées traduites.
- `app/[lang]/(site)/layout.tsx` : navigation, cadre et pied de page communs.
- `app/[lang]/(site)/page.tsx` : composition de la landing page côté serveur.
- `app/api/contact/route.ts` : réception du formulaire et envoi via Mailjet.
- `app/robots.ts`, `app/sitemap.ts` : routes SEO natives.
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
`sendMailjet(to, subject, text, replyTo?)` pour notifier le studio puis confirmer
dans la langue du visiteur, suivant le déroulé du projet de référence.
La route lit le corps avec `request.json()` et valide les champs avant l’envoi.
Le helper `lib/mailjet.ts` utilise l’API Mailjet v3.1 avec un délai maximal de 8 secondes.
L’adresse du visiteur est utilisée en Reply-To. L’échec de la confirmation ne fait
pas échouer une demande déjà reçue par le studio. Le formulaire conserve la saisie
en cas d’erreur et empêche un second envoi pendant la requête. Sans JavaScript,
les liens e-mail et WhatsApp restent disponibles.

Pour activer l’envoi, renseigner côté serveur, en local et chez l’hébergeur :

- `MAIL_MJ_API_KEY_PUBLIC` et `MAIL_MJ_API_KEY_PRIVATE` : clés du compte Mailjet.
- `MAIL_USERNAME` : expéditeur autorisé et boîte de réception du studio, par exemple
  `hello@lebondev.fr`, comme dans le projet de référence.

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
La FAQ reste à réaliser.

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
