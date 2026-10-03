# Nos garanties

Le fond de section, la pastille et les cartes mobiles sont blancs, via
`--timeline-paper: #fff`. L'aurore utilise une palette douce lime (`#d6fa7a`),
menthe (`#b5dfc4`) et sauge (`#c6dbad`), avec une opacité de 55 % à toutes
les tailles. Le mélange de la référence est conservé ; les deux dégradés de
la seconde couche se déplacent sur 60 s, au rythme lent de la référence.
Les bandes se répètent tous les 13 % au lieu de 16 %, avec des plages blanches
réduites, pour rapprocher les faisceaux. Le décor est limité à une hauteur de viewport (`100svh`,
repli `100vh`) au début de la section. Un fondu blanc ferme ses bords haut et
bas : le fond général et la suite de la timeline restent blancs, sans teinte
verte étalée sur toute la section.
Le masque radial part du coin supérieur droit (opaque à 10 %, transparent
à 70 %). Le décor SVG du coin inférieur droit reste retiré.

`components/ui/aurora-background.tsx` adapte le composant AuroraBackground
aux CSS Modules du projet : pas de dépendance Tailwind, de second paquet
Motion, de hauteur imposée ni de nouveau landmark `main`. Le rendu clair
reprend les dégradés à 100°, avec des bandes légèrement rapprochées, le flou de
8 px pour des faisceaux un peu plus lisibles, `invert(1)` et la seconde
couche en `mix-blend-mode: difference`.
Comme dans la référence, seule la seconde couche anime sa
`background-position` de 50 % à 350 % sur 60 s, en boucle linéaire.
Ses tailles de fond sont de 200 % et 150 % : contrairement à une couche de
100 %, chacune peut réellement se déplacer horizontalement. Les fonds restent
attachés à leur couche (`scroll`) sur desktop comme sur mobile, avec le même
espace d'animation dans Firefox.
Un `IntersectionObserver` met le mouvement en pause hors écran et se
déconnecte au démontage. Avec `prefers-reduced-motion`, l'animation est
désactivée et le fond défile avec la section ; le décor disparaît en
couleurs forcées. Le masque utilise les formes standard et préfixée.
Le décor possède son propre découpage absolu, sans changer la hauteur de
la section ni le sticky des cartes mobiles.

- `GuaranteesTimelineSection` rend les textes et le titre côté serveur.
- La pastille et le titre utilisent les tokens partagés `--eyebrow-*` et
  `--section-title-size` de `app/globals.css`.
- `GuaranteesTimeline` compose la timeline desktop et les cartes mobiles.
- `morph-controller.ts` possède déclenchements, progression et nettoyage.
- `guarantees-entrance.ts` orchestre les entrées de lecture, indépendamment
  du morphing et des transformations des cartes mobiles.
- `morph-progress.ts` et `mobile-stack-layout.ts` contiennent les calculs purs.
- `morph-renderer.ts` gère le morphing des illustrations sur desktop, avec des images de repli.
- `blob-foil-renderer.ts` pilote le reflet et l'inclinaison selon le scroll.
- `blob-foil.wgsl` adapte la matière de l'exemple vgpu aux grands blobs :
  gravures fines, éclairage du plan incliné, nacre et reflet argenté.
- `GuaranteeArt` rend les blobs inline : identifiants uniques, tracé maître
  `data-morph-path` et couches qui le réutilisent avec `use`.
- `morph-content.ts` centralise les tracés, palettes et échelles des illustrations.

Les trois blobs ont des fonds sombres distincts : vert forêt (`#174b38`) pour
le budget, bleu pétrole (`#1b3d56`) pour le suivi et vert mousse (`#34521c`)
pour la livraison. Chaque teinte possède un dégradé assorti, des reflets clairs
aux ombres profondes. Sur desktop, leurs couleurs suivent le morphing ; sur
mobile, chaque carte conserve sa propre forme et sa propre palette.
Leur surface est agrandie de 18 % sur desktop/tablette
et d'environ 17 % sur mobile par rapport à la première version holographique ;
les illustrations conservent leur taille. Un canvas transparent dans un
`foreignObject` SVG ajoute la nacre et les fines gravures, au-dessus du fond
et sous les illustrations. Il réutilise le
clip qui référence le tracé maître animé : la réflexion reste dans le blob à
chaque forme, tandis que le contour et les ombres restent en SVG.

Sur desktop, la lumière traverse le blob en diagonale selon la progression de la timeline.
Le SVG s'incline jusqu'à ±9,2° horizontalement et ±6,9° verticalement, avec
la même orientation dans le calcul de lumière du shader. La gravure reste
attachée au matériau ; sa densité reprend la valeur 142 de l'exemple.
Une large nappe nacrée et un
reflet argenté plus étroit illuminent aussi l'espace entre les lignes.
L'effet se stabilise après un court amortissement exponentiel (coefficient
10,5 s⁻¹, soit une réponse légèrement plus lente) et revient en arrière avec
le scroll. Sur mobile, avec ou sans empilement, chaque blob s'éclaire selon
la position de son illustration dans le viewport. Aucun suivi du curseur
ni animation autonome n'est ajouté. Le moteur partage un contexte et les
pipelines entre les surfaces, limite la résolution à un DPR de 2 et dessine
seulement les blobs visibles lors d'un scroll, du court amortissement ou
d'un changement de dimensions. La taille GPU est calculée avant inclinaison
pour ne pas réallouer la texture à chaque mouvement.
Le mouvement réduit, les couleurs forcées ou l'absence de WebGPU conservent
les blobs sombres sans reflet ni inclinaison. Les ressources GPU, observateurs et écouteurs
sont libérés au démontage ; une perte du GPU masque la surcouche. Les filtres
SVG restent fixes et les ombres peuvent dépasser le SVG.

Les entrées reprennent le principe des groupes courts de la page
[iPhone Air](https://www.apple.com/iphone-air/) : une composition arrive,
puis reste disponible pour la lecture. La [référence vidéo](https://www.youtube.com/watch?v=KZ-eAiBW6gA&t=71s)
met l'accent sur la hiérarchie, l'espace et une découverte au rythme du visiteur.
Les seuils ci-dessous sont adaptés à cette section, pas copiés d'Apple.

À partir de 810 px, chaque texte commence lorsque son emplacement au repos
atteint 72 % de la hauteur du viewport. Phase, titre et description se suivent
à 100 ms d'intervalle : montée de 24 px sur 1 s, opacité sur 650 ms.
La première illustration accompagne seulement le premier texte : montée de
28 px, échelle 0,97 → 1 sur 1,15 s, sans rebond. Les deux textes suivants
attendent chacun leur position de lecture. Pendant le snap Hero → Garanties,
la première composition attend aussi que le haut de la section atteigne
12 % du viewport (`snapStart`), près de l'arrivée du snap.

Sous 810 px, chaque carte contient son illustration et son blob holographique.
L'illustration de la première carte et son texte ont leurs propres déclenchements
à 76 % du viewport, avec une montée de 18 px. Les cartes suivantes conservent leur mouvement
d'empilement et leur texte visible, y compris lorsque la hauteur disponible
impose le repli sans empilement. La pastille commence à 80 % du viewport ;
le sous-titre attend son propre seuil de lecture. `AnimatedHeading` et ses
paramètres de lettres sont conservés.

Dans la pile mobile, les cartes arrivent complètes avec 24 px d'écart. Chacune
emporte son illustration en recouvrant la précédente, qui recule légèrement.
Leur hauteur reste fixe, adaptée à l'espace disponible sous le header.
La réserve de défilement se termine dès l'arrivée de la dernière carte :
la section suivante remonte avec elle, puis la pile quitte le viewport sans
palier de lecture supplémentaire ni grand espace blanc sous les cartes.
L'illustration commune est réservée au desktop et le moteur de morphing WebGL
n'est pas démarré sur mobile. Le reflet WebGPU reste indépendant pour chaque
blob. L'empilement suit le scroll dans les deux sens ; son contexte GSAP restaure
les styles au changement de disposition ou au démontage. Le repli sans
empilement, notamment en mouvement réduit, garde les cartes complètes.

`GUARANTEE_ENTRANCE` centralise les distances et les durées. Seules opacité
et transformations sont animées, sans modifier la géométrie de la section.
Les coordonnées de déclenchement ignorent les transformations et le décalage
sticky. Un `ResizeObserver`, les polices et `pageshow` actualisent les seuils
locaux. Une entrée commencée reste visible après un changement de breakpoint ;
une position déjà lue au montage s'affiche directement. Les styles sont retirés
à la fin de chaque entrée. Sans JavaScript ou avec `prefers-reduced-motion`,
ces contenus restent visibles. Le contexte GSAP nettoie animations et triggers,
avec retrait de l'écoute Lenis et des observateurs au démontage.

## Traductions

GuaranteesTimelineSection reçoit la copie traduite, puis transmet les trois textes à GuaranteesTimeline. Les identifiants budget/followup/handover, les illustrations et la progression du morphing restent indépendants des traductions.
Les dictionnaires sont chargés côté serveur depuis `lib/i18n/` pour `/fr`, `/en`
et `/es`, puis seule la langue active est transmise à la section.
