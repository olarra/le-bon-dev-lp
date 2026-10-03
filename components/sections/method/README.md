# La méthode

`MethodSection.tsx` compose les quatre étapes de `method.content.ts`.
`MethodTimeline` pilote le rail et l’étape active ; `MethodIcon` conserve ses
animations propres.

L’en-tête et chaque étape sont des `data-reveal-group` indépendants. Le conteneur
de l’étape porte `data-reveal-anchor` et `data-reveal-viewport="0.9"` : son bord
supérieur à 90% du viewport déclenche l’icône puis le texte, avec 120 ms entre
les deux, sur desktop, tablette et téléphone. Le panneau n’attend plus que son
texte centré atteigne une ligne plus haute. L’ancre commune entraîne les deux
éléments dans la même séquence, même lorsqu’ils s’empilent sur téléphone.
Chaque étape garde son propre départ ; l’en-tête conserve 68% du viewport sur
desktop et tablette, 72% sous 810 px.
L’opacité apparaît en 0,7 s et le déplacement se pose en 1,1 s.

Les côtés alternent sur desktop (24 px) et tablette (20 px). Sur téléphone,
les deux éléments montent de 20 px. `RevealController` lit directement la pose
servie par `app/globals.css` ; `SCROLL_REVEAL` dans `lib/motion.ts` règle le rythme.
Les transformations et opacités inline sont retirées à la fin. Le contenu reste
visible sans mouvement avec la préférence de mouvement réduit, y compris si
elle change pendant une animation, et sans JavaScript.
