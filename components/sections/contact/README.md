# Estimation et contact

`ContactSection.tsx` présente l’estimation et ses critères.
Son CTA est un lien vers `/{lang}/estimation?type=webapp` : depuis l’accueil,
Next ouvre le formulaire guidé dans un panneau ; un accès direct donne la page
dédiée. Le formulaire guidé et son API sont décrits dans
`components/estimation/README.md`. Le formulaire de contact ci-dessous reste
un parcours distinct.
`ContactFormSection.tsx` présente l’introduction, les coordonnées et
`ContactForm`. Les vues reçoivent `copy` depuis le dictionnaire de la route
`/[lang]` ; les coordonnées restent dans `lib/contact.ts`.
Le bouton envoie maintenant le formulaire au serveur via `/api/contact`.
`use-contact-form.ts` gère l’envoi, les erreurs et le nettoyage au démontage.
`lib/contact-form.ts` porte les limites et les identifiants stables des projets.
`app/api/contact/route.ts` suit le projet de référence : configuration, lecture
du formulaire, notification au studio, confirmation traduite, réponse HTTP.
`lib/mailjet.ts` expose le helper
`sendMailjet({ to, subject, text, html, replyTo, inlineAttachments })`.
`lib/email/contact.ts` produit deux variantes du template validé : une
confirmation courte avec le délai de réponse et la signature, et une
notification studio contenant l’intégralité du message et des coordonnées.
Les deux variantes existent en français, anglais et espagnol, en HTML et en
texte. Le rendu commun est dans `lib/email/layout.ts`. Les images sont hébergées
en HTTPS lorsque `MAIL_ASSET_BASE_URL` est renseignée, sinon jointes en secours
pour les essais locaux. Les pièces jointes peuvent être affichées à nouveau en
bas du message par la messagerie. Les trois PNG de `public/images/email/` et les
quatre polices utilisées ont été transférés sur LWS le 23 octobre 2026.
`MAIL_ASSET_BASE_URL=https://lebondev.fr` est renseignée en local et doit être
reprise dans les autres environnements. L’accès HTTPS n’a pas été contrôlé.
Les templates sont conservés dans le code ; aucun template distant Mailjet
n’est à créer. `design/email-proposal/index.html` permet de comparer les variantes
visiteur et studio avec des données fictives et le HTML réellement envoyé.
Le fichier s’ouvre directement, sans route dans l’application. Le régénérer
avec `yarn email:proposal` après toute modification des templates ou des textes ;
la génération et l’aperçu ne déclenchent aucun envoi.
Le rendu reçu reste à confirmer par un essai utilisateur.
La route utilise directement `request.json()`, le champ piège et la validation des champs.
L’échec de cette seconde notification ne transforme pas une demande reçue en échec.
Les erreurs conservent la saisie et les envois simultanés sont empêchés.

Après un envoi réussi, une bannière compacte remplace le bouton d’envoi en bas
du formulaire. Elle conserve le sticker métal « Message reçu » à gauche, un
petit titre, le délai de réponse et l’adresse de confirmation. Les champs et
les informations envoyées restent visibles, désactivés jusqu’au prochain
message. Le focus rejoint le titre de la bannière sans déplacer la page.
L’apparition respecte le mouvement réduit. Le lien « Envoyer un autre message »
vide le formulaire, réactive les champs et replace le focus sur le nom ; seul
ce redémarrage peut ramener le premier champ dans la zone visible.

La confirmation utilise le résultat `confirmationSent` de l’API : si seul cet
e-mail échoue, l’écran confirme la réception par le studio et explique qu’il
n’est pas nécessaire de renvoyer le formulaire. Ces textes sont traduits en
français, anglais et espagnol. Cette modification n’a pas fait l’objet d’une
vérification visuelle ou automatisée.

Les clés `MAIL_MJ_API_KEY_PUBLIC`, `MAIL_MJ_API_KEY_PRIVATE` et l’expéditeur
autorisé `MAIL_USERNAME` doivent être renseignés côté serveur. Comme dans le
projet de référence, `MAIL_USERNAME` est aussi la boîte de réception du studio.
Voir `.env.example` et le README racine. Aucun envoi de vérification n’est automatique.
Le serveur vérifie les champs et leur longueur, sans limite de fréquence personnalisée.
Le formulaire ne conserve aucune demande en base.
L’ancien utilitaire `lib/contact-draft.ts` n’est plus utilisé par cette vue.

Le halo lime du contact s’estompe sur les 180 derniers pixels de la section.
Les 16 derniers pixels retrouvent le fond `--color-surface-hero`, partagé avec
le pied de page, pour une jonction continue sans coupure horizontale.

Le panneau d’estimation, ses critères, l’introduction du contact et les
coordonnées forment chacun un `data-reveal-group`. Les éléments proches
apparaissent dans l’ordre du DOM, espacés de 120 ms, avec un délai maximum de
240 ms. Ceux plus bas attendent leur propre position de lecture ; les colonnes
empilées ne se révèlent pas hors écran. Le formulaire arrive comme un seul bloc.

Les sections Estimation et Contact portent `data-reveal-viewport="0.9"` :
le panneau d’estimation, ses critères, l’introduction du contact, ses coordonnées
et le formulaire démarrent à 90% du viewport sur desktop, tablette et téléphone,
pour éviter de laisser une grande zone visible avec son contenu masqué.
L’opacité monte en 0,7 s, le déplacement se pose en 1,1 s. Les entrées
latérales passent de 24 px à 20 px sur tablette et deviennent des montées de
20 px sous 810 px. La pose CSS est l’unique source des distances ; le rythme est
dans `SCROLL_REVEAL` (`lib/motion.ts`). Un champ ou lien qui reçoit le focus
rend immédiatement son bloc visible. Le mouvement réduit et l’absence de
JavaScript gardent le contenu visible et statique. Sans JavaScript, le formulaire
d’envoi est masqué ; les liens directs e-mail et WhatsApp restent accessibles.
