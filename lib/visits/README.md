# Notifications de visite

Une alerte Mailjet est envoyée uniquement à la boîte du studio (`MAIL_USERNAME`).
Elle contient la page, sa langue, l’heure, l’IP et sa localisation approximative.
Le serveur compose l’e-mail avec le modèle compact `lib/email/visit.ts`, qui
reprend le logo, les polices et les couleurs des formulaires. Le navigateur ne
peut choisir ni le destinataire ni le contenu.

## Déclenchement

- Accueil et estimation, dans les trois langues ; aucune alerte sur les pages légales.
- Dès le chargement du composant client, sans délai minimum ni interaction.
  Une visite brève ou sans clic est éligible. Un onglet ouvert en arrière-plan
  est éligible également ; seul un préchargement spéculatif attend son activation.
- Une tentative par chargement de l’application. Les changements de page ou de
  langue côté client ne renvoient pas d’e-mail ; un rechargement ou un nouvel onglet
  restent soumis à la limite du serveur.
- Les signaux Do Not Track et Global Privacy Control désactivent l’alerte.
- Aucun identifiant de visiteur, cookie de suivi ou stockage navigateur ajouté
  par le composant. Aucun référent, paramètre d’URL ou contenu de formulaire dans l’e-mail.

## Localisation

`lib/visits/location.ts` lit les métadonnées de connexion ajoutées par Vercel :
adresse IP, ville, code de région ISO, pays, code postal, latitude et longitude.
Le pays est affiché en français et les noms de ville sont décodés. Les données
absentes ou invalides restent indisponibles ; elles ne sont pas remplacées par
une position inventée. Les coordonnées disponibles permettent un lien vers la carte.

La géolocalisation est celle de l’IP : elle peut correspondre à un VPN, un relais
Apple ou une sortie réseau. Le site ne demande pas la position GPS du navigateur
et n’appelle pas un autre service de géolocalisation. Les valeurs viennent des
en-têtes de l’infrastructure, jamais du corps de la requête du visiteur.

## Protection

Les robots annoncés dans le User-Agent (Googlebot, Applebot, Bingbot, robots de
partage, outils automatisés…) sont ignorés. Cette liste seule ne suffit pas :
Vercel BotID Basic vérifie aussi les requêtes côté serveur. Les robots vérifiés
et les requêtes bénéficiant d’un bypass sont également ignorés. La durée de
visite et les interactions ne servent pas à classer un visiteur comme robot ;
l’IP sert à la localisation et à la limitation des doublons.

Seul `POST /api/visit` est protégé. Les pages restent accessibles aux moteurs de
recherche. Les requêtes doivent venir de l’origine de production définie par
`SITE_URL`. Les clés Mailjet restent côté serveur.

La limite s’appuie sur le compteur partagé du pare-feu Vercel, plutôt que sur une
mémoire locale à une fonction. Si la règle manque, si BotID ne confirme pas le
résultat ou si l’un des contrôles échoue, aucun e-mail n’est envoyé. Le navigateur
ne relance pas automatiquement l’envoi en cas d’erreur.

Aucun filtre ne garantit zéro robot : un robot sophistiqué peut imiter un
navigateur humain. Les pages quittées avant l’exécution du JavaScript ou avant
la fin de la vérification peuvent aussi ne pas déclencher d’alerte. La limitation
des doublons ne constitue pas un décompte exact de visiteurs uniques.

## Activation sur Vercel

1. Configurer les variables Mailjet et `SITE_URL` habituelles.
2. Dans **Firewall → Configure → New Rule**, créer une condition
   **@vercel/firewall** dont le **Rate limit ID** est `visit-notification`.
   Choisir **Rate Limit**, une fenêtre fixe de **600 secondes**, **1 requête**,
   puis le blocage **429**. Conserver la clé par adresse IP utilisée par le SDK.
   Publier cette règle. Ne pas ajouter une condition sur `/api/visit` : le SDK
   consulte la règle via l’URL interne du pare-feu.
3. Définir `VISIT_NOTIFICATIONS_ENABLED=true` uniquement dans l’environnement
   **Production**, puis redéployer. Le drapeau est utilisé au build pour le
   composant client et à l’exécution pour l’API.

BotID est explicitement configuré en **Basic** côté client et serveur ; Deep
Analysis n’est pas activé par le code. Les limites de disponibilité et de
tarification du pare-feu dépendent du forfait Vercel.

La limite est par IP, fenêtre et région Vercel : plusieurs personnes derrière la
même connexion peuvent partager une alerte, tandis que deux fenêtres ou régions
peuvent autoriser deux alertes proches. Ce n’est pas une identification de session.

Les environnements local et Preview n’envoient jamais d’alerte, même si le drapeau
est activé : l’envoi nécessite `NODE_ENV=production`, `VERCEL=1` et
`VERCEL_ENV=production`. Pour couper la fonctionnalité, remettre le drapeau à
`false` puis redéployer. Les formulaires contact/estimation sont indépendants.

La politique de confidentialité affiche une description de ces notifications
quand elles sont activées. `visitNotificationRetentionDays`, dans
`lib/legal/details.ts`, fixe leur conservation à 90 jours après réception,
soit un trimestre d’historique. Avant activation, appliquer cette durée dans la
messagerie par une règle de suppression ou un nettoyage régulier. Le code du
site ne supprime pas les e-mails déjà reçus.

## Modèle d’e-mail

Modifier `lib/email/visit.ts` pour le contenu et la composition,
`lib/email/theme.ts` pour les couleurs et polices partagées. `yarn email:proposal`
régénère `design/email-proposal/index.html`, la galerie commune aux cinq modèles,
dont l’onglet **Visite · Studio**. Cet aperçu utilise des données fictives
et sa génération n’envoie aucun e-mail.

Références : [BotID](https://vercel.com/docs/botid/get-started),
[SDK du pare-feu](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk),
[limites du pare-feu](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
La [documentation des en-têtes Vercel](https://vercel.com/docs/headers/request-headers)
décrit les données d’IP et de localisation utilisées.
