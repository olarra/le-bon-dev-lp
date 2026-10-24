# Le bon dev

Site du studio Le bon dev : réalisations, offres, FAQ, contact et estimation de projet.
Disponible en français, anglais et espagnol, avec Next.js, React et TypeScript.

## Démarrer en local

Prérequis : Node.js 22 et Yarn.

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Ouvrir [localhost:3000](http://localhost:3000). Les pages sont accessibles sous
`/fr`, `/en` et `/es` ; la racine redirige vers `/fr`.

## Configuration

Les variables sont décrites dans [.env.example](.env.example) :

- `SITE_URL` : domaine public utilisé pour le référencement et les partages.
- `MAIL_MJ_API_KEY_PUBLIC`, `MAIL_MJ_API_KEY_PRIVATE`, `MAIL_USERNAME` : clés Mailjet et expéditeur autorisé pour les formulaires.
- `MAIL_ASSET_BASE_URL` : adresse HTTPS des images et polices utilisées dans les e-mails.
- `VISIT_NOTIFICATIONS_ENABLED` : alertes de visite en production, avec [filtrage anti-robots et limite d’envoi](lib/visits/README.md).

Les clés Mailjet restent côté serveur. Le site peut être consulté sans elles ;
l'envoi des formulaires nécessite leur configuration.

## Commandes utiles

| Commande | Usage |
| --- | --- |
| `yarn dev` | Lancer le serveur local |
| `yarn build` | Générer la version de production |
| `yarn start` | Servir la version de production |
| `yarn email:proposal` | Régénérer l'aperçu HTML des e-mails dans `design/email-proposal/` |
| `yarn social:cards` | Régénérer les cartes de partage et leur galerie dans `design/social-cards/` |
| `yarn images:lossless` | Régénérer les WebP sans perte des garanties et stickers depuis les PNG originaux |

## Organisation du projet

| Dossier | Contenu |
| --- | --- |
| `app/` | Pages par langue, routes API et métadonnées |
| `components/sections/` | Sections du site, chacune avec ses styles, contenus et interactions |
| `components/` | Structure du site, composants partagés, estimation et pages légales |
| `lib/` | Traductions, formulaires, e-mails, SEO et configuration |
| `hooks/`, `types/` | Hooks partagés et déclarations TypeScript |
| `public/` | Images, logos et polices servis par le site |
| `design/` | Sources visuelles et aperçus HTML |
| `references/vgpu/` | Exemples externes et licences, exclus de la compilation de l'application |
| `scripts/`, `tests/` | Génération des assets et tests existants |

Le code propre à une section reste dans son dossier. Les éléments réutilisés
sont partagés dans `components/`, `hooks/` ou `lib/`. Les pages sont rendues côté
serveur ; les composants clients prennent en charge les interactions.

## Modifier le contenu

- **Textes et traductions** : `lib/i18n/` et les fichiers `*.content.ts` des sections.
- **Coordonnées et domaine** : `lib/contact.ts` et `lib/site.ts`.
- **Estimation** : `lib/estimation/` et `components/estimation/`.
- **E-mails** : `lib/email/`, avec les variantes contact/estimation et une alerte de visite compacte. Le HTML est envoyé par l'API Mailjet ; les templates sont gérés dans le code.
- **Informations légales** : `lib/legal/details.ts`.

Les README des composants documentent les comportements propres à chaque section.
