# Pages légales

`LegalPage.tsx` fournit une mise en page serveur commune : logo et retour au
site, choix de langue, navigation entre les deux documents, colonne de lecture
et pied de page compact. Elle réutilise Morna, Outfit et le forest du site.
Le contenu n’a pas d’animation d’entrée.

Le propriétaire a validé le format et le contenu des deux pages. Il fournira
les renseignements juridiques et d’hébergement lors de la préparation de la
mise en production ; seul ce complément reste en attente pour ces pages.

`lib/legal/navigation.ts` définit les libellés français, anglais et espagnols
et les chemins `/{lang}/mentions-legales` et `/{lang}/confidentialite`.
Les routes sont dans `app/[lang]/(legal)/` et utilisent `LegalDocumentPage.tsx`.
Les textes sont dans `lib/legal/copy.ts`. Les URL sans langue redirigent vers
les pages françaises. Le sélecteur de langue conserve le document consulté.

Les deux liens figurent dans la ligne finale du footer. Le lien Confidentialité
est aussi présent dans le contact et à la dernière étape de l’estimation ;
il ouvre un nouvel onglet, annoncé dans son libellé accessible, pour préserver
le formulaire en cours.

Les pages restent provisoires : une note visible et les rubriques concernées
signalent les informations manquantes. `lib/legal/details.ts` centralise les
valeurs publiques attendues, actuellement `null`, sans identité ni hébergeur
inventés. Tant que ces valeurs manquent, les métadonnées demandent `noindex`
et les pages sont exclues du sitemap. Elles restent consultables pour préparer
leur contenu ; ce statut ne doit pas être confondu avec une page finalisée.

## Structure retenue

La [référence Yield fournie par le propriétaire](https://yield.fr/mentions-legales)
a été lue le 23 octobre 2026. Elle sert de référence de concision et de
regroupement des informations ; ses coordonnées et ses déclarations sur les
statistiques, la newsletter ou les cookies ne décrivent pas ce site.

La page Mentions légales comporte quatre rubriques courtes :

1. Éditeur : identité juridique, adresse, immatriculation et coordonnées ;
   statut, capital et TVA selon la situation réelle.
2. Publication : responsable de la publication.
3. Hébergement : identité et coordonnées de l’hébergeur de l’application.
4. Contenus et liens : droits sur les contenus du studio, respect des droits
   des marques et auteurs présentés, et renvoi vers la page Confidentialité.

La page Confidentialité comporte cinq rubriques : responsable et contact ;
données et finalités des formulaires avec leurs bases légales ; destinataires
et prestataires ; durées de conservation et brouillon local ; droits et recours
auprès de la CNIL. Les éventuels transferts liés à l’hébergement doivent être
précisés une fois le prestataire choisi.

## Informations attendues

À renseigner lors de la préparation de la mise en production :

- `publisher` : identité juridique, statut, adresse professionnelle,
  immatriculation, TVA et capital social selon le statut. Une fois renseigné,
  `null` pour la TVA ou le capital signifie que la mention ne s’applique pas.
- `publicationDirector` : responsable de la publication.
- `host` : nom, adresse, téléphone et site de l’hébergeur de production ;
  `dataProcessing` décrit ses lieux de traitement et les garanties de transfert
  éventuelles dans les trois langues. L’hébergement des images sur LWS ne
  permet pas de déduire celui de l’application Next.js.
- `requestRetentionMonths` : durée adoptée pour les demandes sans suite.

La confidentialité décrit les formulaires réellement utilisés, Mailjet
pour les notifications, la boîte e-mail du studio et le brouillon d’estimation
en stockage local. Les durées annoncées doivent correspondre aux pratiques
adoptées ; renseigner une durée dans ce fichier n’automatise pas la suppression
des messages des boîtes e-mail ou des données conservées par les prestataires.
Les renseignements doivent correspondre aux pratiques effectives avant mise
en ligne. Actualiser `LEGAL_UPDATED_AT` lors de la finalisation.

Sources de rédaction consultées le 23 octobre 2026 :

- [Ministère de l’Économie — mentions obligatoires](https://www.economie.gouv.fr/entreprises/developper-son-entreprise/innover-et-numeriser-son-entreprise/mentions-sur-votre-site-internet-les-obligations-respecter).
- [CNIL — exemples d’information sur les formulaires](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel).
- [CNIL — cookies et autres traceurs](https://cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi).
- [Mailjet — stockage des données](https://documentation.mailjet.com/hc/en-us/articles/360042712274-Where-is-my-personal-data-stored).
- [Mailjet / Sinch — accord de traitement des données](https://www.mailjet.com/legal/dpa/).

Aucune vérification visuelle, aucun test ni build exécuté pour cette intégration.
