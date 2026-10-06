# Les réalisations

Deux projets dans le flux normal du document, sur fond blanc permanent.
Aucun pinning, blocage du scroll ou hauteur minimale de viewport.

## Miau : pivot sur ordinateur, carrousel sur mobile

Miau conserve le `ProjectHeader` en verre partagé avec French Pixel Studio, son
texte, ses icônes, ses prestations et son CTA. Le chapeau garde son fondu initial
à 88 % de la fenêtre.

Le POC Miau regroupe la présentation, les téléphones et les prestations dans une
seule carte. `MiauPhones` est passé en enfant de `ProjectHeader`, entre l'introduction
et le pied en verre avec son socle lime, comme dans la section Studio. L'espace
avant l'illustration est de 40–56 px sur ordinateur et 32 px sur mobile. Le pied
reste en quatre colonnes ou en grille 2 × 2 selon la largeur, avec un filet discret
au-dessus. Ses icônes, libellés et séparateurs verticaux sont conservés.

L'icône d'offre à côté du nom Miau est réduite de 25 % à chaque breakpoint.
Le CTA est compact (210 px maximum, hauteur 48 px). Sur ordinateur, l'éventail
écarte les côtés avec un ajustement uniforme de l'échelle : la largeur totale du
trio reste identique, avec moins de contenu masqué par le téléphone central.

Cette composition ne change pas les mouvements des appareils : séquence desktop
et carrousel mobile gardent leurs contrôleurs. French Pixel Studio reprend la même
composition, en passant son moniteur en enfant de `ProjectHeader`.

Sur ordinateur (à partir de 700 px), l'entrée des illustrations reprend le pivot et le recul du prototype,
variante « fondu d'origine », sans rebond.
Les positions finales et dimensions des téléphones sont définies en CSS, dans
une seconde rangée indépendante du chapeau. Il n'y a pas de vague ni de filtre
`drop-shadow` sur les appareils. Les marges transparentes des images sont
compensées par leurs dimensions/positions CSS.

`useMiauReveal` utilise exclusivement `Element.animate()` pour l'entrée. Les effets
ont `fill: both` et partagent une seule heure de départ sur `document.timeline` :

| Couche | Début | Fin | Courbe |
| --- | --- | --- | --- |
| Opacité du central | 150 ms | 550 ms | `ease-out` |
| Pivot −42° et recul du central, 1,32 → 1 | 150 ms | 2450 ms | `.2,.75,.15,1` |
| Opacité du téléphone gauche | 430 ms | 830 ms | `ease-out` |
| Pivot +62° et avancée du téléphone gauche | 430 ms | 2330 ms | `.2,.75,.15,1` |
| Opacité du téléphone droit | 550 ms | 950 ms | `ease-out` |
| Pivot −62° et avancée du téléphone droit | 550 ms | 2450 ms | `.2,.75,.15,1` |
| Reflet central | 500 ms | 1900 ms | `.25,.1,.25,1` |
| Reflet gauche | 730 ms | 2030 ms | `.25,.1,.25,1` |
| Reflet droit | 850 ms | 2150 ms | `.25,.1,.25,1` |

L'origine du central est `50% 11%`, celle des côtés `50% 50%`. La perspective est
1600 px. Les départs latéraux (±140 px, +30 px, −420 px) sont multipliés par la
largeur actuelle du central divisée par 236. Les positions CSS restent intactes.
Le central conserve son `z-index: 3`, les côtés leur `z-index: 1`. Une ombre radiale
statique accompagne chaque appareil dans son enveloppe animée.

Le reflet occupe un masque superposé à l'écran (inset 2,4 % / 4,5 %, rayon 12 % / 6 %,
mode de fusion `screen`). Sa bande blanche de 55 % traverse une seule fois le masque,
de −140 % à 230 %, avec une opacité maximale à 45 % du mouvement. Elle est invisible
au repos et avec le mouvement réduit.

Un `IntersectionObserver` avec `threshold: 0.33` déclenche la séquence lorsque le
tiers du trio est visible. Elle ne rejoue pas tant que le trio n'est pas repassé
entièrement sous le viewport. L'observateur reste actif après l'arrivée pour assurer
ce réarmement. Les images sont décodées avant le départ ; les redimensionnements
recalculent les distances en conservant l'horloge. À 2,45 s, les effets sont annulés
pour rendre la main à l'état CSS final (`transform: none`). Aucun transform d'entrée
n'est recalculé à chaque frame JS ; seules transformations et opacités sont animées.

La parallaxe de sortie reprend le calcul JavaScript précédent sur des enveloppes
extérieures distinctes, après la fin du reveal : déplacement égal à la distance
parcourue au-dessus du viewport, multipliée par 0,07 pour les côtés et 0,11 pour le
central. Le point de départ est mémorisé à la fin de l'entrée pour éviter un saut.
Elle reste limitée au desktop et désactivée avec le mouvement réduit. Les
transformations d'entrée restent animées exclusivement par WAAPI.

Sous 700 px, `MiauCarousel` conserve le carrousel personnalisé d'origine : téléphone
central net, côtés floutés progressivement jusqu'à 5 px, mouvement continu au doigt
et indicateurs qui se transforment de points en capsules. Les flèches et indicateurs
gardent leurs couleurs vert forêt/lime ; aucun titre ni compteur n'est affiché.
Une même position fractionnaire pilote les trois appareils et les indicateurs.
Le relâchement utilise le ressort d'origine (raideur 240, amortissement 32), avec
la vitesse du geste. Le défilement vertical reste natif et la navigation fonctionne
au clavier. Avec le mouvement réduit, la sélection rejoint immédiatement sa cible.

Le carrousel retrouve son entrée de 900 ms (fondu et translation de 40 px), déclenchée
à 12 % de sa hauteur au repère de 88 % du viewport. Ses styles et attributs sont
séparés du trio desktop : le contrôleur WAAPI s'arrête sous 700 px et se réinstalle
au retour sur ordinateur. La carte et les animations FPS restent indépendantes.

## French Pixel Studio

`ProjectHeader` regroupe la présentation en haut, l'aperçu du site au centre et les
prestations dans le pied en verre avec son socle lime, selon le même modèle que
Miau. L'icône d'offre est réduite de 25 % à chaque breakpoint et le CTA reprend
le format compact de 210 × 48 px maximum. Un filet discret sépare l'illustration
du pied. Les prestations occupent quatre colonnes régulières avec
séparateurs verticaux ; sous 1300 px, elles passent en grille 2 × 2. Sur mobile,
les icônes et libellés sont centrés. Les libellés existent en FR/EN/ES.

L'aperçu utilise une fenêtre de navigateur plate inspirée de macOS, dessinée en
HTML/CSS : contour gris fin, barre supérieure avec trois pastilles, adresse du site
et ombre douce. La galerie garde son ratio 1288/711, sa navigation et ses trois œuvres.
Le PNG du moniteur en résine et ses pieds ne sont plus affichés. Les attributs
`data-resin-*` restent les points d'attache du contrôleur d'animation existant.

Les PNG de prestations sont dans `public/images/realisations/stickers`. Leurs
imports statiques produisent une URL liée au contenu, commune à l'image et aux
masques CSS. `MetalSticker` reconstruit sa face lorsque cette adresse change,
en conservant l'enveloppe utilisée par le contrôleur de lumière au scroll/pointeur.
Les dimensions et décalages CSS compensent les marges transparentes de chaque
fichier pour égaliser la taille visible des icônes.

La carte peut atteindre 1360 px et la fenêtre 1080 px, avec les marges intérieures
de la carte. L'espace entre présentation et illustration est de 40–56 px sur
ordinateur et 32 px sur mobile, comme pour Miau.
La marge entre la fin de Miau et la carte FPS est de 24–32 px (24 px sur mobile),
en plus des 24 px de pied du projet précédent.

`useFpsReveal` reprend « Relève et recul » via WAAPI (`fill: both`). La fenêtre,
sa barre supérieure et la galerie restent un seul objet : `.device` porte le redressement,
`.stage` porte le recul final. Aucune œuvre ni partie du site n'est animée seule.
La carte complète et son socle lime sont animés ensemble via `[data-project-copy]`.
La carte et le moniteur ont deux départs indépendants. Les effets du moniteur
partagent la même heure de départ sur `document.timeline` ; les temps ci-dessous
sont relatifs au départ de leur bloc.

| Couche | Début | Fin | Courbe |
| --- | --- | --- | --- |
| Chapeau : fondu et translation verticale 24 → 0 px | 0 ms | 900 ms | `.16,1,.3,1` |
| Opacité du moniteur | 140 ms | 500 ms | `ease-out` |
| Redressement 38° → 0° et échelle 1,22 → 1 | 140 ms | 2220 ms | `.2,.75,.15,1` |
| Reflet sur le verre | 950 ms | 2130 ms | `.25,.1,.25,1` |
| Recul final du moniteur, échelle 1,045 → 1 | 1270 ms | 2850 ms | `.37,0,.63,1` |

Seule la respiration finale a été raccourcie de 500 ms (2080 → 1580 ms).
Le redressement, le fondu et le reflet conservent leurs délais et durées d'origine.

Le redressement utilise une perspective de 1800 px, une origine `50% 92%` et
aucun rebond. L'origine du recul final est `50% 45%`. Le reflet est une bande de
40 % dans un masque superposé à l'écran, avec son rayon existant et le mode de
fusion `screen`. Elle traverse le verre une seule fois, reste invisible au repos
et ne déplace jamais la galerie. À 2,85 s, les effets sont annulés pour retrouver
les transformations CSS finales, sans modifier les dimensions ni les positions.

Deux `IntersectionObserver` séparent les apparitions : le chapeau démarre lorsque
le haut du projet atteint 92 % de la hauteur visible ; le moniteur attend que 30 %
de sa propre zone soit visible sur ordinateur. Sur mobile, le moniteur démarre
lorsque le milieu du bloc de présentation atteint le quart supérieur de l'écran.
Les deux repères sont mesurés dans le projet immobile, en soustrayant la translation
de la carte. La hauteur de toute la carte n'est plus le repère mobile, puisqu'elle
contient désormais l'illustration et les prestations. Les points sont recalculés
lorsque le projet, la carte, l'introduction, l'illustration ou le viewport changent
de taille, indépendamment du pivot et de la parallaxe.
Les observateurs restent actifs après la fin ; les deux blocs se réarment uniquement
lorsque le projet repasse entièrement sous le viewport. Aucun pinning ni
progression pilotée par le scroll. La parallaxe de sortie existante reste sur
l'enveloppe extérieure, limitée à l'ordinateur, après l'arrivée du moniteur.
`useShowcaseMotion` conserve l'introduction générale, le chapeau Miau et l'entrée
du carrousel mobile.

## Accessibilité et cycle de vie

Les états CSS finaux restent visibles sans JavaScript et avec
`prefers-reduced-motion`. Pour les deux projets, activer cette préférence pendant l'entrée
termine immédiatement la séquence ; la parallaxe JavaScript est également désactivée.
La prise de focus dans un projet termine sa révélation pour rendre le CTA visible.
Observateurs, écouteurs et animations sont nettoyés au démontage.
