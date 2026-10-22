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
`lib/mailjet.ts` expose le helper `sendMailjet(to, subject, text, replyTo?)`.
La route utilise directement `request.json()`, le champ piège et la validation des champs.
L’échec de cette seconde notification ne transforme pas une demande reçue en échec.
Les erreurs conservent la saisie et les envois simultanés sont empêchés.

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
