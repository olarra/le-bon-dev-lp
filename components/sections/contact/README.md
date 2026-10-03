# Estimation et contact

`ContactSection.tsx` présente l’estimation et ses critères.
`ContactFormSection.tsx` présente l’introduction, les coordonnées et
`ContactForm`. Les textes et destinations sont dans `contact.content.ts` et
`lib/contact.ts`. Le formulaire prépare toujours un brouillon dans la messagerie
du visiteur ; ces animations ne modifient pas l’envoi.

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
JavaScript gardent le contenu visible et statique.
