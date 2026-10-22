# Estimation

Le parcours reprend les sept étapes, les libellés et les options du fichier
`estimation-poc.html` fourni pour cette étape : Projet, Secteur, Fonctionnalités,
Design, Délai, Détails, Contact. Les textes français sont dans
`lib/estimation/locales/fr.ts` ; les versions anglaise et espagnole suivent le
même schéma et les mêmes identifiants de réponse.

## Page et panneau

`app/[lang]/estimation/page.tsx` rend l’introduction, le formulaire et les
explications sur l’estimation. Les métadonnées définissent canonical et
alternatives de langue sans reprendre la query. Le sitemap contient les trois
versions de cette page. `/estimation` redirige vers `/fr/estimation`.

Le slot parallèle `@estimate`, rendu par le layout de langue, intercepte les
liens Next depuis l’accueil. Un accès direct ou un rechargement conserve la
page complète. Les slots nuls ferment le panneau lors d’une autre navigation.
La fermeture revient à l’entrée d’historique précédente, en conservant le
scroll de l’accueil. `?type=site`, `?type=webapp` et les autres identifiants
connus préremplissent le choix sans effacer le brouillon existant.

`EstimateDialog` utilise un dialogue natif : focus contenu dans le panneau,
arrière-plan inerte, fermeture par Échap, bouton ou clic sur le fond. La
fermeture est désactivée pendant l’envoi. Le scroll du document et Lenis sont
suspendus pendant son ouverture, puis restaurés ; le contenu du formulaire
défile indépendamment. Le focus retourne au déclencheur si celui-ci existe.

## Interface et données

`EstimateWizard` est partagé par les deux présentations. La progression est
latérale sur desktop et compacte sur mobile ; les questions conservent leurs
groupes, choix multiples ou uniques et champs conditionnels. Les budgets sont
des tranches, sans estimation automatique ni curseur numérique artificiel.
Le récapitulatif permet de modifier les étapes déjà visitées.

Les transitions d’étape utilisent Web Animations (opacité et transform).
Les interactions de sélection et l’ouverture du panneau utilisent CSS. Le
mouvement réduit désactive ces animations. Les icônes sont des SVG locaux.
Les styles sont limités au module du formulaire.

Les cartes et les choix ont une surface blanche unie ; une sélection ajoute
un contour vert forêt et une coche ou un point. La barre latérale utilise un
fond gris très clair, sans dégradé lime sur les cartes. La progression conserve
les couleurs des pictogrammes (clair à venir, forêt parcouru, lime actif) et
ajoute une coche aux étapes parcourues, avec un compteur et sept segments
vert forêt de 6 px d’épaisseur.
L’option « Je pars de zéro » utilise une page vierge avec un signe plus.
Le sticker de confirmation est un SVG local (enveloppe et pastille de
validation), avec la finition `MetalSticker` commune au site. La confirmation
monte sa propre `StickerSurface`, comme le formulaire de contact : le tilt et
les reflets suivent le curseur, avec le même retour au repos et la même prise
en charge tactile et du mouvement réduit. L’illustration, le titre, le message
et les actions sont centrés ensemble ; les données envoyées restent alignées
à gauche dans leur volet dépliable.

`EstimateFrameLight` ajoute un passage de lumière lime/émeraude de 4 secondes,
avec une accélération et un ralentissement légers,
sur le contour à l’ouverture et au changement d’étape, confirmation comprise.
Dans le panneau, le contour englobe aussi son en-tête ; en page, il entoure le
formulaire. Une arête continue de 4 px et deux halos diffus reprennent la
composition du contour Siri, dans la palette du studio. Les masques isolent
les anneaux ; le flou est appliqué à leurs parents pour pouvoir déborder vers
l’intérieur. Le dégradé tourne en CSS, puis l’élément est retiré. Sans prise en
charge des masques, un contour et une ombre interne restent visibles pendant
le passage. `ResizeObserver` dimensionne seulement le dégradé : il n’y a ni
boucle JavaScript d’animation, ni copie du contenu. L’effet est masqué en
mouvement réduit et en couleurs forcées.

`use-estimate-form.ts` conserve le brouillon dans `localStorage` sous
`lbd-estimation-v2` jusqu’à réception réussie. Les valeurs relues sont filtrées
et bornées par `schema.ts`. Sans stockage disponible, le parcours fonctionne
en mémoire. Changer de type masque les questions devenues inutiles ; leurs
réponses restent dans le brouillon mais sont exclues de l’envoi.

Le projet (ou sa description libre), le prénom et un e-mail valide sont requis.
Le lien vers un produit existant est facultatif ; s’il est renseigné, il doit
être une adresse HTTP(S), avec ou sans le préfixe. Les autres questions sont
facultatives. Sans JavaScript, la page conserve son contenu et propose l’e-mail.

## Envoi

`/api/estimation` accepte un JSON limité à 32 000 caractères, avec un champ
piège. Le serveur valide les identifiants, longueurs et champs requis. Il
notifie le studio puis envoie au visiteur une copie lisible de ses réponses,
dans la langue du formulaire, avec `sendMailjet` et la configuration existante :
`MAIL_MJ_API_KEY_PUBLIC`, `MAIL_MJ_API_KEY_PRIVATE`, `MAIL_USERNAME`.

Un échec conserve les réponses. Les doubles clics sont bloqués pendant la
requête. Si seule la copie au visiteur échoue, la demande reste reçue et la
confirmation l’indique. Le succès efface le brouillon et reste un état du
formulaire, sans page indexable distincte. Aucune demande n’est enregistrée en
base ; aucune donnée saisie n’est écrite dans les logs. Aucun e-mail n’est envoyé
au chargement ou à la compilation.
