# Pages légales

`LegalPage.tsx` fournit une mise en page serveur commune : logo et retour au
site, choix de langue, navigation entre les deux documents, colonne de lecture
et pied de page compact. Elle réutilise Morna, Outfit et le forest du site.
Le contenu n’a pas d’animation d’entrée.

Le propriétaire a validé le format, le contenu et l’affichage discret de son
identité dans les pages juridiques, puis fourni l’adresse de l’éditeur et choisi
Vercel pour l’hébergement. Les durées retenues sont de 36 mois pour les demandes
sans suite et de 90 jours pour les notifications de visite.

`lib/legal/navigation.ts` définit les libellés français, anglais et espagnols
et les chemins `/{lang}/mentions-legales` et `/{lang}/politique-de-confidentialite`.
Les routes sont dans `app/[lang]/(legal)/` et utilisent `LegalDocumentPage.tsx`.
Les textes sont dans `lib/legal/copy.ts`. Les URL sans langue redirigent vers
les pages françaises. Le sélecteur de langue conserve le document consulté.

Les deux liens figurent dans la ligne finale du footer. Le libellé « Politique
de confidentialité » est partagé par le titre de page, les métadonnées, la
navigation et les liens des formulaires, avec ses traductions anglaise et
espagnole. L’ancienne URL `/confidentialite` redirige directement vers
`/fr/politique-de-confidentialite` ; les anciennes URL préfixées par `/fr`, `/en`
ou `/es` redirigent vers la nouvelle page dans la même langue. Les redirections
sont permanentes. Les liens des formulaires ouvrent un nouvel onglet, annoncé
dans leur libellé accessible, pour préserver la saisie en cours.

Les informations manquantes sont signalées dans les rubriques concernées,
sans bandeau général « Version provisoire ». `lib/legal/details.ts` centralise
les valeurs publiques approuvées et conserve `null` pour les renseignements
manquants.
Les métadonnées demandent `noindex` et les pages sont exclues du sitemap, y
compris après finalisation, afin de limiter l’exposition de l’identité dans
les moteurs de recherche. Elles restent publiques et accessibles depuis le
footer. `robots.txt` autorise leur exploration pour que `noindex` puisse être lu.

## Structure retenue

La rédaction propre à Le bon dev reprend les thèmes utiles des références
fournies (Bob le développeur et Hexa web) et les traitements du site. Les
références servent à organiser les sujets ; leurs prestataires, outils de
mesure d’audience, assurances et clauses contractuelles ne sont pas transposés.

La page Mentions légales comporte cinq rubriques courtes :

1. Éditeur : le nom personnel apparaît une fois dans une phrase réunissant
   l’éditeur et le directeur de publication, sous le nom commercial Le bon dev.
   Le cadre d’activité chez Jump Green est précisé séparément, avec son SIREN ;
   la coopérative n’est pas présentée comme l’éditeur du site.
2. Hébergement : identité et coordonnées de l’hébergeur de l’application.
3. Propriété intellectuelle : droits du studio et des tiers, autorisations,
   exceptions légales et licences applicables.
4. Données personnelles : renvoi vers la Politique de confidentialité.
5. Informations et liens externes : signalement d’erreurs et conditions propres
   aux services tiers.

La Politique de confidentialité comporte huit rubriques : responsable et
contact ; demandes de contact et d’estimation avec leurs bases légales ; accès
aux données et prestataires ; durées de conservation ; cookies et brouillon ;
sécurité ; exercice des droits et recours auprès de la CNIL ; modifications.
Une rubrique « Mesure d’audience » s’ajoute lorsque les alertes de visite
sont activées en production. Sa rédaction est courte dans les trois langues :
finalité, base légale et opposition. Le détail des données de navigation, de
l’IP et de la localisation approximative est accessible dans un élément natif
`details` intitulé « Données utilisées », fermé initialement et utilisable sans
JavaScript. Cette présentation en deux niveaux conserve l’information complète.
L’acheminement par e-mail et les rôles de Vercel et Mailjet sont regroupés dans
« Accès aux données » ; les 90 jours restent indiqués dans « Durées de conservation ».
La sécurité décrit HTTPS, la collecte limitée et les destinataires autorisés.
La rubrique Modifications renvoie à la date `LEGAL_UPDATED_AT` déjà affichée
en haut de page. Le stockage du brouillon est distingué de la conservation
des demandes reçues. Les traitements internationaux
déclarés par Vercel et les garanties de transfert sont présentés avec un lien
vers son accord de traitement.

## Informations attendues

`publisher` contient l’identité de la personne physique éditrice et directrice
de publication, son nom commercial, sa coopérative d’activité et l’adresse
fournie explicitement par le propriétaire. L’identité figure aussi dans la
rubrique responsable du traitement de la Politique de confidentialité.

`host` contient les coordonnées officielles de Vercel Inc., hébergeur choisi
pour la production. Son numéro provient du contact juridique publié dans sa
politique DMCA. `dataProcessing` décrit les lieux de traitement et garanties
déclarés par Vercel dans les trois langues ; `dataProcessingUrl` renvoie au DPA.
La rédaction ne suppose pas une résidence exclusive des données en Europe.
L’offre Pro ou Enterprise à laquelle ce DPA s’applique et la région des fonctions
seront à prendre en compte lors du déploiement ; cette modification ne configure
aucun service distant. LWS reste l’hébergeur des images des e-mails.

`requestRetentionMonths` est fixé à 36 mois à compter de la réception de la
demande ou du dernier contact venant du prospect. Une relance du studio ne
réinitialise pas cette durée. Le repère de trois ans est issu du
[référentiel CNIL sur la gestion commerciale](https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des).
`visitNotificationRetentionDays` est fixé à 90 jours à compter de la réception,
pour conserver un trimestre d’historique des alertes. Il s’agit d’un choix du
studio, distinct de la conservation de journaux de sécurité.

La Politique de confidentialité décrit les formulaires réellement utilisés, Mailjet
pour les notifications, la boîte e-mail du studio et le brouillon d’estimation
en stockage local. Les durées annoncées doivent correspondre aux pratiques
adoptées ; renseigner une durée dans ce fichier n’automatise pas la suppression
des messages des boîtes e-mail ou des données conservées par les prestataires.
Les renseignements doivent correspondre aux pratiques effectives avant mise
en ligne. Actualiser `LEGAL_UPDATED_AT` lors de la finalisation.

Sources de rédaction consultées les 23 et 24 octobre 2026 :

- [Ministère de l’Économie — mentions obligatoires](https://www.economie.gouv.fr/entreprises/developper-son-entreprise/innover-et-numeriser-son-entreprise/mentions-sur-votre-site-internet-les-obligations-respecter).
- [CNIL — exemples d’information sur les formulaires](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel).
- [CNIL — information des personnes et transparence](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence).
- [CNIL — cookies et autres traceurs](https://cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi).
- [Mailjet — stockage des données](https://documentation.mailjet.com/hc/en-us/articles/360042712274-Where-is-my-personal-data-stored).
- [Mailjet / Sinch — accord de traitement des données](https://www.mailjet.com/legal/dpa/).
- [Vercel — coordonnées officielles](https://vercel.com/legal/privacy-notice).
- [Vercel — contact juridique et téléphone](https://vercel.com/legal/dmca-policy).
- [Vercel — accord de traitement des données](https://vercel.com/legal/dpa).
- [Vercel — HTTPS et certificats SSL](https://vercel.com/docs/domains/working-with-ssl).

Aucune vérification visuelle, aucun test ni build exécuté pour cette intégration.
