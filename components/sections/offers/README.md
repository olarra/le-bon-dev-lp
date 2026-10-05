# Les offres — montée et recul

La révélation s’inspire de la deuxième variante, **« Carte légèrement après »**,
du fichier fourni `Section tarifs — montée + recul.html`. Les deux offres
occupent leurs places finales dès le départ. La section défile normalement ;
l’entrée se joue sur sa propre horloge lorsque le haut du support atteint 60 %
de la hauteur de fenêtre. Ce départ laisse assez de place à l’écran pour voir
la montée, au lieu de la commencer au bord inférieur. Le titre garde un seuil
indépendant à 85 %.

## Mouvement

`offers-entrance.ts` utilise GSAP et `CustomEase`, déjà présents dans le projet.
Le support et son contenu apparaissent ensemble. Applications rejoint ce
mouvement après 0,2 s ; les deux terminent leur déplacement à 1,25 s.
La comparaison des enregistrements fournis a guidé ces réglages : les fondus
de la galerie de référence restent perceptibles pendant environ 0,7 à 0,9 s,
alors que ceux des offres s’effectuaient surtout en 0,3 à 0,5 s. Il s’agit d’une
adaptation de ce rythme observé, pas des valeurs du code de la page de référence.

La montée représente 13 % de la hauteur de fenêtre, bornée entre 120 et 190 px.
Elle reste donc lisible sur un grand écran. Le seuil plus haut laisse la place
à ce déplacement dans la fenêtre, sans ajouter de distance de scroll :

| Élément | Départ | Durée | Mouvement |
| --- | --- | --- | --- |
| Support et offres | 0 s | 1,25 s | Montée commune de 120 à 190 px |
| Fond blanc et contenu Sites internet | 0 s | 0,85 s | Un seul fondu, courbe `sine.inOut` |
| Carte Applications complète | 0,2 s | 0,8 s | Fondu du panneau et de son contenu ensemble |
| Carte Applications | 0,2 s | 1,05 s | Échelle 1,12 → 1 : recul jusqu’au support |
| Ombre de pose | 0,2 s | 1,05 s | Disparition de l’ombre diffuse supplémentaire |

Les seuils, distances et durées sont directement réglables dans `ENTRANCE`.
La montée et la pose utilisent `(0.22, 0.1, 0.22, 1)`. Cette courbe garde plus
de déplacement pendant l’apparition que la décélération immédiate précédente.
Le support porte la montée commune. Applications arrive légèrement plus grande
et recule jusqu’à sa place ; aucun décalage vertical supplémentaire ne lui est
appliqué. Son échelle et l’ombre qui s’efface donnent la sensation de profondeur.
L’origine de l’échelle est à `50% 12%`, près du haut visible de la carte : une
grande hauteur de contenu ne fait pas partir le panneau de son centre hors champ.

L’ombre finale reste définie en CSS. Une couche décorative supplémentaire suit
la carte et s’efface pendant la pose ; seul son alpha est animé, sans recalculer
un grand flou à chaque image. Le titre conserve sa courte entrée indépendante.

Une fois Applications posée, `offers-shimmer.ts` lance le **reflet métallique vert**.
Le sélecteur de comparaison est désactivé ; l’effet conserve sa vitesse et ses couleurs.
L’essai de reflet diagonal reste inactif dans le code : une nappe émeraude et vert pétrole,
un sommet sauge/péridot et une courte ombre juste après l’éclat. Cette rupture
plus nette reprend le principe de la crête et des valeurs sombres des stickers.
La continuité de la passe s’inspire du reflet de French Pixel Studio. La face
utilise un mélange alpha normal sous le texte ; les valeurs les plus lumineuses
sont réservées à la bordure, éclairée par la même bande au même instant.
Le fond conserve ses dégradés forêt `#244f37`, `#1b432e` et `#214f36`.

`offers-reflection.ts` mesure la carte pour calculer la passe. La bande est
inclinée de 35° par rapport à l’horizontale et se déplace du coin supérieur gauche
vers le coin inférieur droit. Son champ complet mesure 44 % de la largeur
de la carte. Les coins sont projetés sur la direction du mouvement pour faire
entrer et sortir toute la lumière, y compris sur les cartes mobiles très hautes.

La durée est proportionnelle à cette distance : environ **2,1 s** pour une carte
de 546 × 1104 px et **2,9 s** pour 334 × 1109 px. La courbe `(0.42, 0, 0.58, 1)`
accélère puis ralentit sans concentrer le passage dans un bref flash. L’opacité
a sa propre animation linéaire : montée pendant les premiers 6 %, maintien,
extinction pendant les derniers 10 %. Face, bordure, translation et opacité
partagent la même horloge. Les paramètres sont regroupés dans `REFLECTION`.

Le départ reste raccordé à la fin de l’entrée de la carte, sans boucle,
interception du scroll ou déclenchement supplémentaire au survol.
`offers-sheen.ts` conserve l’ancien balayage pour les anciens contrôleurs non montés.

Le **reflet métallique vert** est activé par
`FEATURE_FLAG_OFFERS_METAL_SHIMMER_ENABLED` dans `lib/feature-flags.ts`.
Ce flag vaut `true` pour conserver le métal vert. La variante métallique garde sa durée de 0,65 s.
`offers-metal-renderer.ts` réutilise
`../guarantees-timeline/blob-foil.wgsl` avec `engraving: 0`, `green: 1` et `spread: 0.42` :
la face reçoit le reflet et ses éclats, sans ondes gravées ni trame de points.
La palette passe de l’émeraude au vert vif, avec une crête citron.
La trajectoire de la lampe, les angles de la normale et l’intensité maximale
de 0,95 viennent du contrôleur des blobs. Le déplacement utilise une courbe
`ease-out sine` dans `offers-metal.ts`, avec un départ rapide et une sortie
adoucie. La bande lumineuse, sa crête et le passage sur les facettes sont
resserrés à 42 % de leur largeur d’origine pour produire un shimmer bref.
La durée de cette variante est réglable dans `METAL_DURATION`, dans `offers-shimmer.ts`.
Les garanties sélectionnent `engraving: 1`, `green: 0` et `spread: 1` pour garder leur matière.

La couche transparente reste sous le texte HTML et à l’intérieur des coins
arrondis. Le fond vert réapparaît lorsque la lumière s’éteint. Le shader dessine
seulement pendant la passe, à un DPR maximal de 1,5 et avec une surface limitée
à 1,5 million de pixels. Ses dimensions suivent la mise en page et non
l’échelle animée de la carte. L’exemple Holographic Card et sa licence d’origine
sont conservés dans `/holographic-card`.

Sans WebGPU, ou si son initialisation n’est pas terminée au début de la passe,
`MetalFinish` réutilise les trois couches CSS de `MetalSticker` dans leur
variante sombre avec `palette="green"` : nacre conique verte, éclat citron
et grain. La nacre est limitée à une bande mobile, et les arrêts de l’éclat
sont rapprochés pour conserver un reflet fin. Les mélanges et intensités
viennent des stickers ; cette palette remplace les nuances bleues et violettes par du vert.
`lib/sticker-light.ts` centralise les coordonnées lumineuses déjà
utilisées par `useStickerMotion`, avec les mêmes valeurs. La carte fournit sa
forme et son fond ; le repli reçoit une lumière animée pendant cette passe.
Le moteur est choisi au début de la lecture. Pour une comparaison déclenchée
par le sélecteur, l’initialisation GPU est attendue avant de lancer la passe ;
un navigateur sans WebGPU ou un échec d’initialisation utilise le repli.
Une perte du GPU fait passer au repli au temps courant, sans recommencer
l’animation. Le reflet diagonal ne crée aucun contexte GPU. Il conserve la clé
interne `original` du sélecteur de comparaison.

Les stickers `OfferSticker` sont les seules illustrations affichées.
`useStickerMotion` conserve leur matière métallique et leurs reflets au scroll
et au pointeur. Aucun globe tournant, assemblage de pièces ou relais d’icônes
n’est ajouté. Le texte reste directement dans le DOM, sans découpage par mots.

## Disposition et interactions

À partir de 810 px, les deux cartes sont côte à côte et partagent la montée
du support. Sous ce seuil, elles restent en colonne à leur taille de lecture.
Chaque carte se déclenche à 68 % de la hauteur de fenêtre. La montée du support
et de Sites internet représente 12 % de cette hauteur, bornée entre 72 et 104 px.
Applications joue son entrée en profondeur à sa propre arrivée dans l’écran,
sans délai supplémentaire ni translation verticale, avec une échelle initiale
de 1,07.

La hauteur découle du contenu, sans mise à l’échelle de toute la section pour
tenir dans la fenêtre. Il n’y a ni pinning, ni interception de molette ou de
toucher, ni filtre Lenis. L’ancien dépliage depuis le bouton et le contrôleur
à deux gestes ont été retirés.

Le fond blanc → `#eaf7d6`, les couleurs des cartes, les textes FR/EN/ES, les liens
et les deux boutons résine de 58 px sont conservés. Le bouton Applications reste
citron avec une face uniforme.

## Rejouer

Un bouton fixe en bas à droite apparaît tant que les cartes sont à l’écran.
Il relance l’entrée à la position de défilement actuelle, y compris si une
lecture est déjà en cours, puis le reflet à la fin. Un reflet en cours est
annulé avant le redémarrage. Sur mobile, si Applications est encore sous l’écran,
elle reste prête à jouer à son arrivée. Les libellés sont traduits en FR/EN/ES.
Les contrôles sont masqués avec réduction des animations ou sans JavaScript.

`FEATURE_FLAG_OFFERS_SHIMMER_COMPARISON_ENABLED` affiche temporairement un
sélecteur **Reflet diagonal / Métal vert** à côté du bouton. Il vaut désormais `false` :
seul le bouton **Rejouer** est affiché. Si la comparaison est réactivée, changer la sélection joue uniquement le reflet sur
la carte posée ; si l’entrée est encore en cours, le choix s’applique à sa fin.
Le bouton **Rejouer** utilise également ce choix. La sélection reste locale
à la page et revient au défaut du feature flag au rechargement.
Mettre le flag de comparaison à `false` retire le sélecteur et conserve
la variante définie par `FEATURE_FLAG_OFFERS_METAL_SHIMMER_ENABLED`.

## Accessibilité et cycle de vie

Un `IntersectionObserver` par entrée observe son ancrage et se déconnecte au
départ de l’animation. Le seuil du support ne dépend pas de ses transformations.
Les marges sont recalculées au redimensionnement. L’initialisation attend le
premier cadre après `pageshow` pour tenir compte de la restauration du scroll.
Une actualisation dans la section joue l’entrée ; les éléments déjà entièrement
au-dessus de la fenêtre prennent leur état final. Le franchissement d’un
breakpoint conserve les entrées déjà déclenchées.

Un focus dans une offre termine immédiatement les fondus pour rendre les liens
visibles. Le focus sur la section lors d’une navigation par ancre, ainsi que le
bouton Rejouer, laissent l’entrée se jouer. `prefers-reduced-motion`
montre les états finaux directement. Sans
JavaScript, le contenu final est visible grâce au repli `noscript`.
Les couches du reflet restent masquées sans animation, en réduction des
animations et en couleurs forcées. Un passage direct à l’état final (focus,
changement de breakpoint ou contenu déjà dépassé) ne déclenche pas de reflet.

Au démontage, `gsap.matchMedia().revert()` restaure les styles et supprime les
timelines. Les observateurs d’entrée et de visibilité du bouton, le cadre de
restauration et les écouteurs de chargement, resize, focus et replay sont nettoyés. Les effets
métalliques utilisent le nettoyage existant de `useStickerMotion`.
Le reflet s’arrête lorsque la carte quitte la fenêtre ou que l’onglet est masqué.
Un changement des dimensions de la carte annule la passe ; la suivante mesure
sa nouvelle géométrie. Les dimensions de la bande sont nettoyées au démontage.
Un changement de variante annule la passe précédente et libère le moteur GPU
en revenant au reflet diagonal. Une préparation asynchrone annulée ne relance pas
de reflet après un changement de sélection ou un replay.
Au démontage et aux changements de breakpoint, ses animations, son cadre de
rendu, ses observateurs et ses écouteurs sont annulés ; le contexte WebGPU et
ses ressources sont libérés. En réduction des animations, le moteur n’est pas
créé. Les couleurs forcées désactivent également son lancement.

Les anciens contrôleurs `offers-reveal.ts`, `offers-mobile-reveal.ts` et
`offers-content-entrance.ts` restent indépendants et ne sont pas montés ici.
