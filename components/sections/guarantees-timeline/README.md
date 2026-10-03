# Nos garanties

Le fond de section, la pastille et les cartes mobiles sont blancs, via
`--timeline-paper: #fff`. L'aurore utilise une palette douce lime (`#d6fa7a`),
menthe (`#b5dfc4`) et sauge (`#c6dbad`), avec une opacité de 50 % à toutes
les tailles. Le mélange et l'animation de la référence sont conservés.
Le masque radial part du coin supérieur droit (opaque à 10 %, transparent
à 70 %). Le décor SVG du coin inférieur droit reste retiré.

`components/ui/aurora-background.tsx` adapte le composant AuroraBackground
aux CSS Modules du projet : pas de dépendance Tailwind, de second paquet
Motion, de hauteur imposée ni de nouveau landmark `main`. Le rendu clair
reprend les dégradés à 100°, leurs arrêts et tailles d'origine, le flou de
10 px, `invert(1)` et la seconde couche en `mix-blend-mode: difference`.
Comme dans la référence, seule la seconde couche anime sa
`background-position` de 50 % à 350 % sur 60 s, en boucle linéaire.
Cette animation de fond remplace la dérive par transformations pour retrouver
l'effet demandé. Le fond de cette couche est fixe sur desktop, avec un
repli `scroll` sur les appareils tactiles.
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
- `morph-renderer.ts` gère les illustrations, avec des images de repli.
- `GuaranteeArt` rend les blobs inline : identifiants uniques, tracé maître
  `data-morph-path` et couches qui le réutilisent avec `use`.
- `morph-content.ts` centralise les tracés, palettes et échelles des illustrations.

Les couleurs suivent le morphing ; éclairage et filtres restent fixes.
Chaque carte statique utilise le matériau et le tracé correspondant à son contenu.
Les ombres peuvent dépasser le SVG.

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

Sous 810 px, illustration et premier texte ont leurs propres déclenchements
à 76 % du viewport, avec une montée de 18 px. Le contrôleur anime le conteneur
de l'illustration partagée et celui de son repli statique ; leurs enfants
restent gérés par le morphing. Les cartes suivantes conservent leur mouvement
d'empilement et leur texte visible, y compris lorsque la hauteur disponible
impose le repli sans empilement. La pastille commence à 80 % du viewport ;
le sous-titre attend son propre seuil de lecture. `AnimatedHeading` et ses
paramètres de lettres sont conservés.

`GUARANTEE_ENTRANCE` centralise les distances et les durées. Seules opacité
et transformations sont animées, sans modifier la géométrie de la section.
Les coordonnées de déclenchement ignorent les transformations et le décalage
sticky. Un `ResizeObserver`, les polices et `pageshow` actualisent les seuils
locaux. Une entrée commencée reste visible après un changement de breakpoint ;
une position déjà lue au montage s'affiche directement. Les styles sont retirés
à la fin de chaque entrée. Sans JavaScript ou avec `prefers-reduced-motion`,
ces contenus restent visibles. Le contexte GSAP nettoie animations et triggers,
avec retrait de l'écoute Lenis et des observateurs au démontage.
