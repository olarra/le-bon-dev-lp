# Questions fréquentes

La section `#faq` apparaît entre l'encart Estimation et le formulaire de contact.
La rédaction française vient du fichier validé
`wireframe_faq_le_bon_dev_final_v2.html`. Elle est conservée dans `faq.content.ts` ;
les traductions se trouvent dans `lib/i18n/faq/en.ts` et `lib/i18n/faq/es.ts`.

## Disposition et contenu

Sur ordinateur, l'introduction et les trois catégories restent à gauche, avec
les questions de la catégorie sélectionnée à droite. Les deux colonnes suivent
le défilement de la page : aucune colonne collante ni zone de défilement interne.
Sur mobile, l'ensemble passe sur une colonne et les catégories forment une rangée
de trois onglets.
Chaque catégorie possède une couleur distincte : lime avant le projet, bleu
pétrole des illustrations Garanties pendant, olive foncé (`#667b17`) après la mise
en ligne pour garder le texte blanc lisible. L'onglet sélectionné, le titre,
les pastilles et le bouton « − » reprennent la couleur de leur catégorie.
Le premier groupe porte un texte forêt sur lime, les deux autres un texte blanc
sur bleu pétrole ou olive. La pastille de l'onglet sélectionné devient blanche
avec un numéro foncé. Les réponses ouvertes gardent un fond légèrement teinté
pour la lecture des longs textes ; les réponses fermées restent blanches.

Les dix questions sont toujours rendues côté serveur. Après hydratation,
`FaqInteractions` transforme les liens en onglets accessibles (`tablist`, `tab`,
`tabpanel`, `aria-selected`) et masque les deux groupes inactifs. Les flèches du
clavier, Début et Fin permettent de changer de catégorie ; Tab mène au panneau
actif. Sans JavaScript, les trois groupes restent visibles et les liens servent
d'ancres classiques.

Seul le panneau actif occupe de la place dans la page. Les catégories inactives
sont masquées et inertes ; leurs réponses ouvertes ne créent plus d'espace vide
sous une catégorie courte. La grille suit la plus haute des deux colonnes.

La transition associe un fondu (sortie sur 180 ms, entrée sur 260 ms) à un
ajustement de hauteur sur 260 ms. Le panneau sortant reste superposé le temps
du fondu. La hauteur redevient automatique à la fin, sans repositionner le scroll.
Les réponses déjà ouvertes dans chaque catégorie sont conservées. Une nouvelle
sélection reprend depuis la hauteur affichée ; un clic sur une question pendant
le fondu adapte la transition à sa hauteur finale. La préférence de mouvement
réduit donne un changement immédiat.

Les ancres `#faq-avant`, `#faq-pendant` et `#faq-apres` permettent de partager une
catégorie. Leur mise à jour au clic ne fait pas défiler la page. Les identifiants
restent les mêmes dans les trois langues et le sélecteur de langue conserve la
position dans la section FAQ.

## Accordéons

Chaque question utilise `details` et `summary`. La question sur le prix est
ouverte au départ. Une seule réponse peut rester ouverte par catégorie ; ouvrir
une autre réponse referme la précédente, et il reste possible de tout refermer.
Chaque catégorie conserve sa réponse ouverte lors d'un changement d'onglet.
Les éléments natifs assurent la navigation au clavier. Sans JavaScript,
l'attribut `name` commun aux réponses d'une catégorie assure leur exclusivité
dans les navigateurs qui le prennent en charge.

Une réponse ouverte se distingue par un fond légèrement teinté, son bouton « − »
et sa bordure discrète, sans trait lime latéral.

`FaqInteractions` coordonne l'ouverture et la fermeture sur 300 ms. Le groupe
natif est désactivé pendant cette amélioration pour permettre aux deux animations
de se terminer ensemble. Une nouvelle activation peut inverser une transition
en cours. Ouvrir ou fermer une réponse ne commande aucun défilement de la page.
La section exclut également ses éléments de l'ancrage automatique du navigateur.
Pendant les changements de hauteur, cet ancrage est suspendu au niveau du document :
une section suivante visible ne peut donc pas faire remonter la page. La valeur
précédente est restaurée après la transition et le recalcul des positions.

À la fin, la hauteur redevient automatique et les positions ScrollTrigger sont
actualisées pour les apparitions des contenus suivants. La préférence de mouvement
réduit conserve l'exclusivité des réponses avec un changement immédiat.

La réponse sur le prix et la conclusion renvoient vers l'estimation dans la
langue active, avec le panneau intercepté du site. Le lien de contact mène à
`#contact`. Le pied de page comporte également un lien vers la FAQ.
