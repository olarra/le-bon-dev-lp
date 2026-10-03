# Nos garanties

Le fond de section et la pastille sont blancs, via `--timeline-paper: #fff`.
Les cartes mobiles utilisent l'essai métallique décrit ci-dessous.
L'aurore utilise une palette douce lime (`#d6fa7a`),
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

L'essai `MOBILE_METAL_CARDS_ENABLED`, dans `guarantees-timeline.content.ts`,
applique sous 810 px une surface métallique à toute la carte. Le passer à
`false` restaure les cartes blanches avec leurs blobs individuels. Le desktop
conserve sa composition et son morphing.

Les illustrations restent au premier plan, sans blob derrière elles. Chaque
carte reçoit un fond graphite teinté de forêt, pétrole ou mousse, une bordure
fine et un shader de matériau complet, `card-foil.wgsl`, adapté de la source
officielle Holographic Card téléchargée dans `/holographic-card`.
Il reprend les vagues gravées à densité 142, la diffraction, le grain fixe,
la nacre, le reflet argenté, l'écho spectral et les micro-points de la référence.
Trois petits éclats à quatre branches apparaissent seulement au passage de
la même lumière. Le scroll déplace cette lumière ; les contours restent
attachés à la surface, avec un contraste qui dépend de son éclairage.
Le shader dessine le métal opaque et son reflet ensemble ; la teinte de base
provient de `--metal-base`. Les rayures CSS permanentes sont retirées.
Le texte reste en HTML, avec titres blancs, phases vert lime et descriptions
claires. Une ombre locale sur les lettres protège la lecture ; aucun voile
sombre ne masque le reflet sur la partie inférieure de la carte.
Le canvas est décoratif,
ignoré par le pointeur et arrondi par CSS. La géométrie des cartes reste pilotée
par l'empilement ; l'inclinaison du matériau intervient seulement dans leur
éclairage. Aucune dépendance ni boucle d'animation permanente n'est ajoutée.
Cette exploration n'a pas fait l'objet de vérifications visuelles ou automatisées.

- `GuaranteesTimelineSection` rend les textes et le titre côté serveur.
- La pastille et le titre utilisent les tokens partagés `--eyebrow-*` et
  `--section-title-size` de `app/globals.css`.
- `GuaranteesTimeline` compose la timeline desktop et les cartes mobiles.
- `morph-controller.ts` possède déclenchements, progression et nettoyage,
  ainsi que les transformations de la pile mobile liées au scroll.
- `guarantees-entrance.ts` orchestre les entrées de lecture, indépendamment
  du morphing et des transformations des cartes mobiles.
- `morph-progress.ts` et `mobile-stack-layout.ts` contiennent les calculs purs.
- `morph-renderer.ts` gère le morphing des illustrations sur desktop, avec des images de repli.
- `blob-foil-renderer.ts` pilote le reflet des cartes et des blobs selon le scroll.
- `blob-foil.wgsl` conserve la surcouche transparente des blobs.
- `card-foil.wgsl` rend le matériau métallique complet des cartes mobiles,
  avec les gravures et les reflets de la référence vgpu.
- `GuaranteeArt` rend les blobs inline : identifiants uniques, tracé maître
  `data-morph-path` et couches qui le réutilisent avec `use`.
- `morph-content.ts` centralise les tracés, palettes et échelles des illustrations.

Les trois blobs ont des fonds sombres distincts : vert forêt (`#174b38`) pour
le budget, bleu pétrole (`#1b3d56`) pour le suivi et vert mousse (`#34521c`)
pour la livraison. Chaque teinte possède un dégradé assorti, des reflets clairs
aux ombres profondes. Sur desktop, leurs couleurs suivent le morphing ; dans
la variante mobile avec blobs, chaque carte conserve sa forme et sa palette.
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
le scroll. La variante mobile avec blobs conserve son éclairage lié à la
position de chaque illustration dans le viewport.

Pour les cartes métalliques empilées, la lumière et les cartes partagent
la même progression de scroll, sans rattrapage retardé.
Le premier balayage commence pendant l'entrée de la première carte et
conserve sa fin à 2 % du parcours. Les suivants gardent cette même distance
de scroll, mais sont décalés pour que la lumière atteigne le bas du métal
au moment où chaque carte termine sa montée (46 % et 90 %). Le calcul tient
compte de la hauteur réelle du métal et du dépassement de la lampe : le
reflet ne finit plus de sortir avant que la carte soit posée, et la troisième
carte ne révèle plus sa lumière aussi tôt. À geste égal, la vitesse du
balayage reste la même. Sa disparition se poursuit après l'arrivée ; pour
la dernière carte, elle accompagne la sortie naturelle de la pile sans
allonger la réserve de scroll.
La lumière dépasse le haut et le bas de la hauteur réelle de chaque carte
pour traverser aussi les coins. Aucun second amortissement du reflet n'est
ajouté dans la pile : il accompagne le mouvement visible des cartes.
En disposition sans empilement, le balayage va de l'entrée du haut de la carte
à l'arrivée de son bas dans la zone de lecture. La réserve de défilement et
la sortie de pile ne sont pas allongées.

Aucun suivi du curseur ni animation autonome n'est ajouté.
Le moteur partage un contexte GPU entre les surfaces, limite le DPR à 2 sur desktop et 1,5 sur mobile,
et dessine seulement les surfaces visibles lors d'un scroll, du court amortissement ou
d'un changement de dimensions. La taille GPU est calculée avant inclinaison
pour ne pas réallouer la texture à chaque mouvement.
Seules les surfaces du breakpoint actif allouent des ressources GPU.
Le mouvement réduit ou l'absence de WebGPU conservent le matériau SVG/CSS fixe.
Les couleurs forcées masquent le reflet et donnent aux cartes les couleurs système.
Les ressources GPU, observateurs et écouteurs
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

Sous 810 px, chaque carte contient son illustration et sa propre surface holographique.
L'illustration de la première carte et son texte ont leurs propres déclenchements
à 76 % du viewport, avec une montée de 18 px. Les cartes suivantes conservent leur mouvement
d'empilement et leur texte visible, y compris lorsque la hauteur disponible
impose le repli sans empilement. La pastille commence à 80 % du viewport ;
le sous-titre attend son propre seuil de lecture. `AnimatedHeading` et ses
paramètres de lettres sont conservés.

Dans la pile mobile, les cartes arrivent complètes avec 24 px d'écart. Chacune
emporte son illustration en recouvrant la précédente, qui recule légèrement.
Leur hauteur reste fixe, adaptée à l'espace disponible sous le header.
Les gestes restent libres, sans seuil, capture de l'inertie ni arrêt imposé
entre les cartes. Les transitions occupent 6–46 % puis 50–90 % du parcours :
les intervalles immobiles sont raccourcis pour faire démarrer la montée plus
facilement et réduire la réserve de scroll.
La montée suit directement le scroll avec une interpolation linéaire :
un pixel défilé correspond à un pixel de montée, sans tween de rattrapage.
La même distance pilote le déplacement et l'espace réservé. La dernière
carte et la section suivante remontent ainsi ensemble, sans vide créé par
une carte qui arrive plus vite que le reste de la page. Seul le léger recul
des cartes recouvertes conserve sa courbe douce. Le reflet suit la même
progression que la montée ; aucun temps de lecture ou geste supplémentaire
n'est imposé.
La réserve de défilement se termine dès l'arrivée de la dernière carte :
la section suivante remonte avec elle, puis la pile quitte le viewport sans
palier de lecture supplémentaire ni grand espace blanc sous les cartes.
L'illustration commune est réservée au desktop et le moteur de morphing WebGL
n'est pas démarré sur mobile. Le reflet WebGPU reste indépendant pour chaque
carte. L'empilement suit le scroll dans les deux sens ; son contexte GSAP restaure
les styles au changement de disposition ou au démontage. Aucun tween de suivi
temporel ni contrôle supplémentaire des gestes n'est utilisé pour la pile.
Le repli sans
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
