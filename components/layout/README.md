# Structure et pied de page

`PageFrame` compose le contenu et `SiteFooter`. Les colonnes du pied de page
partagent un `data-reveal-group`, limité aux voisins visibles pour respecter
leur empilement sur tablette et téléphone. La ligne finale (copyright et
« Retour en haut ») est visible dès le rendu, sans délai ni animation d’entrée,
sur tous les breakpoints.

`FooterWordmark` combine deux mouvements sur des éléments distincts : le lien
révèle le logo entier par une montée et un fondu, tandis que son parent assure
une parallaxe discrète. Le logo possède son propre déclencheur à 85% du
viewport, borné avant la fin de page pour rester atteignable sur téléphone.
La montée de 44 / 32 / 20 px sur desktop / tablette / téléphone et le fondu
partagent 1,1 s et `power1.inOut`. GSAP lit `--wordmark-rise` dans le CSS,
également utilisé par la pose initiale servie avant hydratation.
L’arrivée joue une fois par montage, y compris lors d’un chargement direct ou
d’une restauration de scroll au pied de page. Elle n’utilise plus le contrôleur
partagé, qui affiche immédiatement les éléments déjà visibles au montage.

Le parent se déplace de −12% de la hauteur du logo (24 px maximum) à zéro en
bas de page. Le `ScrollTrigger` mesure le cadre fixe, jamais le lettrage animé ;
`scrub: 0.35` et `ease: "none"` suivent le scroll dans les deux sens. La course
se recalcule au redimensionnement et diminue avec le logo sur tablette et
téléphone. Réglages de durée, de déclenchement et de parallaxe :
`FOOTER_WORDMARK` dans `lib/motion.ts`.

Le cadre utilise `overflow: visible` : aucune lettre ni ombre du logo n’est
rognée par son déplacement. La marge inférieure de 48 / 40 / 24 px réserve la
course dès le rendu serveur. La hauteur intrinsèque reste celle du SVG à tous
les breakpoints.
Seuls `transform` et `opacity` sont animés, sans changement de mise en page.
Le mouvement réduit supprime les deux mouvements et affiche le logo entier.
Les deux systèmes utilisent GSAP et des transformations CSS classiques,
sans dépendance aux scroll timelines CSS. Le focus termine l’arrivée pour
rendre le lien immédiatement visible ; un style noscript garde le logo visible
sans JavaScript. Les animations et écouteurs sont nettoyés au démontage.
