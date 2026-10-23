# Estimateur — analyse business et stratégie de génération de prospects

Date : 3 octobre 2026. Projet destinataire : **Le bon dev**.

Référence étudiée : [estimateur de Bob le développeur][B1].

**Statut : document d’analyse et de transmission à une autre IA. Les propositions ne sont pas des décisions validées ni une autorisation d’implémenter.**

## 1. Décision recommandée

Construire un parcours qui aide le prospect à comprendre et cadrer son projet, puis lui propose une estimation humaine sous 24 h. Donner une première valeur utile avant de demander ses coordonnées : un résumé clair, un périmètre de départ et les points à préciser.

Le formulaire de référence est intéressant pour organiser une demande commerciale. En revanche, son écran final ne fournit pas de montant : il oriente vers un échange. C’est une distinction essentielle pour définir notre promesse. [Logique publique du parcours][B2]

Pour Le bon dev, la priorité n’est pas de multiplier les adresses e-mail. C’est d’obtenir davantage de **conversations avec des personnes dont le projet correspond à l’offre**, tout en réduisant le temps nécessaire pour comprendre chaque demande.

Recommandation en deux temps :

1. **Première version : cadrage guidé et estimation humaine.** Elle correspond à la promesse déjà présente dans le site et ne nécessite pas d’inventer un barème.
2. **Évolution possible : fourchette instantanée**, uniquement pour les périmètres dont les coûts ont été calibrés avec les données du studio. Une reprise de code ou un projet complexe peut rester soumis à une analyse humaine.

Le principal avantage à construire est la qualité de l’aide à la décision : « voici ce que vous pourriez lancer en premier, ce qui reste à éclaircir et comment obtenir un budget crédible ».

## 2. Méthode, sources et limites

La page HTML et les fichiers JavaScript publics chargés par cette page ont été consultés. Ils permettent de reconstituer les sept étapes, tous les groupes de choix, les conditions de progression et le comportement client après envoi. Les descriptions ci-dessous sont reformulées ; le code du concurrent n’est pas recopié dans le projet.

Le navigateur de recherche n’a pas pu démarrer dans cet environnement. Il ne s’agit donc pas d’un parcours visuel validé par des clics. Aucun formulaire n’a été soumis, aucun appel à son API d’envoi effectué et aucune coordonnée transmise.

Restent inconnus : traitement serveur, éventuel chiffrage transmis par e-mail, délivrabilité, suivi commercial réel, taux d’abandon, qualité des prospects et rentabilité. La présence de données de calcul dans un bundle ne prouve pas leur utilisation côté serveur.

Les constats concernent la version publique consultée à cette date. Les URL de bundles pourront changer au prochain déploiement.

**Lecture du document :** la section 3 décrit les éléments observables ; les sections suivantes exposent mon analyse et mes recommandations. Les risques de conversion sont des hypothèses à mesurer, pas des résultats d’analytics du concurrent. Aucune vérification du code de Le bon dev n’a été exécutée pour cette étude.

## 3. Cartographie complète du formulaire de référence

### 3.1 Les sept étapes

Le tableau sépare les choix disponibles de la condition permettant de continuer. [Catalogue des choix][B3] · [Logique de progression][B2]

| Étape | Choix ou informations disponibles, reformulés | Passage |
| --- | --- | --- |
| 1. Projet | Présentation web, SaaS, vente/marketplace, mobile, web et mobile, transformation de l’existant ; complément libre. | Au moins un choix ou du texte. |
| 2. Secteur | Médical, enseignement, immobilier, finance/assurance, commerce, autre ; précision libre. | Au moins un choix ou du texte. |
| 3. Fonctions | 14 familles : reporting, transactions, intégrations, notifications, conversation, IA, multi-vendeurs, langues, échanges de données, documents, cartes, réservations, permissions, fonctionnement déconnecté. | Facultatif ; 8 visibles initialement, 6 supplémentaires dépliables. |
| 4. Design | Départ sans maquettes, modèle existant, maquettes livrées, conception personnalisée, bibliothèque visuelle, renouvellement d’identité. | Un choix. |
| 5. Contraintes et délai | Santé/hébergement, données personnelles, accessibilité ; puis ambition minimale, intermédiaire ou étendue. | Contraintes facultatives ; ambition obligatoire. |
| 6. Description | Nom du projet et contexte rédigé. | Facultatif. |
| 7. Contact | Prénom, adresse électronique, organisation. | Deux premiers champs non vides ; organisation facultative. |

### 3.2 Navigation et sortie

Le parcours client reste identique selon le projet ; aucun budget ni date de livraison explicite n’est demandé. Les coordonnées arrivent en dernier. La présentation suppose authentification, administration et e-mails inclus dans les bases. Le succès propose un rendez-vous et un redémarrage, sans fourchette visible, alors que la métadescription en annonce une. [Parcours et métadonnées][B2]

Le code de navigation prévoit retour, progression, action d’envoi désactivée pendant la requête et commandes fixes sur petit écran. Les sélections reposent sur des boutons dont l’état est surtout représenté visuellement. Ces éléments ont été lus dans le code, pas évalués visuellement. [Composants de navigation][B4]

### 3.3 Deux limites à ne pas confondre

**Fiabilité de la confirmation :** le client attend le `fetch`, ignore son statut et absorbe l’erreur réseau avant de montrer le succès. Cela ne permet pas de conclure que le serveur perd effectivement des demandes. [Gestion de l’envoi][B2]

**Chiffrage :** le catalogue contient des bornes en jours et des multiplicateurs ; le composant de résultat consulté n’expose pas de calcul. Aucun tarif final ne peut en être déduit de façon certaine. [Données publiques][B3] · [Résultat client][B2]

## 4. Lecture business, étape par étape

Cette section donne une interprétation des choix précédents, puis ce que je recommande pour Le bon dev.

### Étape 1 — Faire reconnaître son besoin

**Intérêt commercial :** un premier choix simple peut engager une personne qui ne sait pas rédiger un cahier des charges. Il permet aussi de préparer une conversation plus pertinente.

**Point de vigilance :** mélanger une nature de produit, une plateforme et une intervention sur l’existant rend les réponses ambiguës. Une personne peut vouloir refaire une boutique disponible sur téléphone sans demander trois produits distincts. Cette ambiguïté devient coûteuse si les choix sont ensuite additionnés pour calculer un prix.

**Pour nous :** distinguer « ce que vous souhaitez obtenir » de « ce qui existe déjà ». Préremplir le contexte depuis le CTA utilisé, tout en laissant la réponse modifiable. Prévoir une réponse d’incertitude qui mène à de l’aide, sans obliger le prospect à maîtriser notre catalogue.

### Étape 2 — Comprendre le contexte professionnel

**Intérêt commercial :** le secteur aide à sélectionner une référence pertinente, reconnaître des contraintes et préparer le bon échange.

**Point de vigilance :** ce n’est pas nécessairement l’information qui permet au visiteur d’avancer le plus. Lui demander de se classer dans une verticale peut faire passer l’organisation commerciale de l’agence avant son besoin.

**Pour nous :** placer le secteur dans le contexte, éventuellement facultatif. Le rendre déterminant seulement lorsqu’il change réellement les questions suivantes. Pour un projet manipulant des données sensibles, demander la catégorie du besoin, jamais des données personnelles réelles ou des dossiers métier dans ce formulaire.

### Étape 3 — Faire émerger le périmètre

**Intérêt commercial :** transformer une idée abstraite en usages concrets prépare la discussion sur le travail à réaliser.

**Point de vigilance :** une liste de technologies ou de fonctions peut devenir une liste d’envies. Elle ne dit pas lesquelles sont indispensables au lancement. Une absence de sélection peut signifier « aucune », « je ne sais pas » ou « je n’ai pas vu l’option » ; ces réponses ne doivent pas être interprétées comme équivalentes.

**Pour nous :** demander ce que les utilisateurs doivent pouvoir faire. Par exemple : réserver, acheter, suivre une demande, partager un document. Proposer des choix adaptés au type de projet, puis distinguer l’essentiel du complément. Les fonctions complémentaires ne doivent pas masquer un besoin central pour la branche concernée.

### Étape 4 — Clarifier le travail de conception

**Intérêt commercial :** connaître les éléments déjà disponibles peut éviter de chiffrer deux fois la même prestation et aider à expliquer le périmètre.

**Point de vigilance :** posséder des maquettes et souhaiter une réalisation élaborée sont deux informations différentes. Un prospect peut avoir des maquettes inutilisables, ou préférer un design sobre entièrement conçu pour lui. Présenter le design uniquement comme un niveau de sophistication peut faire croire que la clarté et l’ergonomie sont des options.

**Pour nous :** commencer par les éléments existants : identité, textes, images, maquettes, code. Garder le niveau d’exigence visuelle pour une précision facultative ou l’échange de cadrage. Ne pas promettre une réduction automatique parce qu’un fichier Figma existe.

### Étape 5 — Séparer ampleur, urgence et faisabilité

**Intérêt commercial :** ces informations orientent le dimensionnement et la priorité de traitement.

**Point de vigilance :** une version réduite, une date impérative et une équipe disponible sont trois variables différentes. Un périmètre réduit peut être demandé pour dans six mois ; un produit ambitieux peut être demandé pour demain. Les confondre fausse la qualification et le discours sur les délais.

**Pour nous :** recueillir un horizon réel, puis distinguer souhait et engagement incontournable. Une date proche ne doit pas provoquer automatiquement une promesse de livraison ou un supplément chiffré. Les exigences particulières doivent déclencher une revue, pas une simple case ajoutée à une addition.

### Étape 6 — Obtenir la raison du projet

**Intérêt commercial :** comprendre le problème et l’objectif permet de recommander une solution plus utile que la liste initiale de fonctions.

**Point de vigilance :** demander une longue explication trop tard peut produire un texte minimal après plusieurs écrans d’effort. À l’inverse, ouvrir le formulaire avec une dissertation peut bloquer les personnes qui viennent justement chercher du cadrage.

**Pour nous :** poser tôt une question simple sur le résultat attendu, avec exemples et réponse courte. Laisser un espace facultatif pour préciser ensuite. Le nom du projet est secondaire : il ne doit pas conditionner la qualité de notre aide.

### Étape 7 — Rendre l’échange de valeur explicite

**Intérêt commercial :** les coordonnées à la fin permettent de demander un engagement après un premier travail de clarification. Un contact peu intrusif laisse davantage de choix sur la suite.

**Point de vigilance :** l’effort déjà fourni ne doit pas devenir la seule raison de laisser son e-mail. Il faut expliquer ce qui sera reçu, par qui et dans quel délai. Un rendez-vous immédiatement imposé peut aussi contredire la promesse d’une réponse asynchrone.

**Pour nous :** prénom et e-mail suffisent pour demander une estimation. Entreprise, téléphone et budget disponible peuvent rester facultatifs. L’envoi du brief, une demande de rendez-vous et une inscription marketing sont des intentions distinctes. Ne pas les fusionner dans un seul bouton implicite.

### Après l’envoi — Tenir la promesse commerciale

Le message de réussite fait partie du service. Une confirmation prématurée peut faire croire au prospect que le studio l’ignore ensuite. Elle peut aussi gonfler les chiffres de conversion si un événement est déclenché à l’affichage de cet écran.

Pour Le bon dev : confirmer uniquement l’acceptation effective de la demande par le service d’envoi. La délivrance en boîte de réception reste une étape distincte. Garder les réponses si l’envoi échoue et ne pas inviter à renvoyer la demande lorsque seule la confirmation au visiteur a échoué.

## 5. Ce que ce parcours vend réellement

Mon interprétation : le mécanisme commercial sert surtout à convertir une intention encore imprécise en échange avec l’agence. Le questionnaire prépare cette conversation et donne une impression de prise en charge structurée.

Cette lecture est cohérente avec les offres publiques de Bob : un accompagnement à 7 900 € HT pour deux semaines ou 14 900 € HT par mois. Ces tarifs décrivent leur modèle commercial, pas le coût de notre futur formulaire ni une référence à appliquer à Le bon dev. [Offres publiques][B5]

| Dimension | Valeur business possible | Condition de réussite pour nous |
| --- | --- | --- |
| Entrée accessible | Engager quelqu’un avant qu’il soit prêt à appeler. | Promesse compréhensible et effort annoncé honnêtement. |
| Qualification progressive | Réduire les questions répétitives du premier échange. | Chaque réponse doit servir à une décision. |
| Explication du périmètre | Faire comprendre pourquoi le budget varie. | Expliquer les facteurs sans transformer le prospect en chef de projet technique. |
| Restitution | Montrer la qualité du raisonnement du studio. | Donner une synthèse spécifique aux réponses. |
| Contact | Ouvrir une relation commerciale pertinente. | Expliquer précisément ce qui suit l’envoi. |

Un outil devient un **lead magnet**, au sens d’une ressource qui donne envie de laisser ses coordonnées, lorsqu’il produit quelque chose d’utile au visiteur. Le simple fait de découper un contact en plusieurs écrans ne crée pas cette valeur.

L’effet recherché pour notre site : « j’ai déjà mieux compris mon projet ; ce studio peut m’aider à le mener ». Le prospect doit pouvoir conserver ce bénéfice même s’il ne prend pas rendez-vous immédiatement.

## 6. Adaptation au positionnement réel de Le bon dev

Le code actuel présente deux offres principales : sites internet et applications web ou mobiles. Le site annonce un point d’entrée de **2 500 € HT pour cinq pages avec contenus fournis**, et une première estimation sous 24 h. Il prévoit déjà un formulaire de contact Mailjet et les langues français, anglais et espagnol. Sources internes : [offres](../../components/sections/offers/offers.content.ts), [contenus français](../../lib/i18n/fr.ts), [route contact](../../app/api/contact/route.ts).

Conséquences pour le futur parcours :

- Un besoin de site de présentation doit rester rapide à exprimer. Éviter de lui imposer un questionnaire d’application métier.
- Une application nécessite de comprendre les utilisateurs, leurs actions et le point de départ. Ne pas inventer un prix automatique pour donner une impression de précision.
- Les CTA des offres doivent ouvrir le parcours avec le bon contexte. Le CTA générique laisse choisir.
- La reprise d’un produit existant doit être reconnue comme un cas demandant une revue, sans supposer que le code récupéré réduit forcément l’effort.
- Le prix d’entrée doit conserver ses conditions. Une demande plus complexe ne doit pas se retrouver artificiellement ancrée au minimum affiché.
- Le vocabulaire reste métier. Un utilisateur ne doit pas choisir une architecture, un framework ou un type d’API.

La langue affichée ne suffit pas à déduire le pays, la devise ou le budget. La version espagnole doit convenir à l’Espagne et au Mexique. Si un prix est affiché, préciser la devise ; ne pas fabriquer une conversion ou un tarif local. Recueillir le pays seulement s’il sert réellement au suivi ou au chiffrage.

## 7. Parcours proposé : quatre moments de qualification et une synthèse

Cette structure est une recommandation à valider. Réduire le nombre d’écrans n’est utile que si l’on réduit aussi l’effort de réflexion. Il ne faut pas compresser sept écrans dans quatre pages surchargées.

Le GOV.UK Design System recommande notamment de justifier chaque question, d’accepter l’incertitude lorsqu’elle est légitime et de faciliter le retour. Ce sont des repères de conception, pas une preuve de performance commerciale pour notre audience. [Conception des questions][U1]

| Moment | Question proposée | Décision que la réponse permet |
| --- | --- | --- |
| 1. Votre besoin | « Que souhaitez-vous créer ou améliorer ? » Puis un objectif court adapté au choix. | Choisir la branche et comprendre le résultat attendu. |
| 2. Votre point de départ | « Qu’avez-vous déjà ? » Idée, contenus, identité, maquettes, site ou application existants. | Distinguer création, conception et reprise. |
| 3. L’essentiel | « Que doit-on pouvoir faire dans la première version ? » Choix métier adaptés. | Préparer un périmètre de départ et les questions de cadrage. |
| 4. Votre calendrier | « Quand souhaitez-vous lancer ? » Horizon souple, date impérative ou absence de date. | Évaluer le besoin de planification sans promettre une disponibilité. |
| 5. Votre synthèse | Résumé modifiable, première version proposée, points à préciser, accès à la demande d’estimation. | Donner de la valeur puis permettre le contact. |

### Branche site internet

Commencer par l’objectif : présenter l’activité, obtenir des demandes, permettre des réservations ou vendre. Préciser ensuite la taille approximative du contenu et ce qui existe déjà. Pour les besoins particuliers, utiliser quelques choix pertinents : prise de rendez-vous, catalogue, paiement, plusieurs langues.

Une personne qui veut vendre doit pouvoir l’exprimer, mais cela ne signifie pas que le studio a déjà validé une offre e-commerce standard. Cette réponse peut simplement signaler un besoin à cadrer.

### Branche application

Identifier à qui elle sert : clients, équipe interne, partenaires ou plusieurs populations. Demander les actions essentielles plutôt qu’une liste exhaustive de technologies. Proposer ensuite, si pertinent, une précision sur les outils à connecter et la nécessité d’un usage mobile spécifique.

La question de l’usage doit précéder une recommandation web, mobile ou combinée lorsque le prospect hésite. Ne pas faire d’un canal une obligation technique prématurée.

### Branche reprise ou évolution

Recueillir l’objectif principal, l’existence d’une version utilisable et, facultativement, son URL. Expliquer qu’une analyse de l’existant permettra de préciser l’effort. Ne demander ni identifiants, ni dépôt privé, ni transfert de fichiers dans la première version du formulaire.

### Restitution avant coordonnées

Afficher une synthèse construite à partir des réponses :

1. Objectif et utilisateurs concernés.
2. Périmètre envisagé pour démarrer, présenté comme une proposition.
3. Deux ou trois points qui peuvent faire varier le travail.
4. Éléments manquants à préciser.
5. Prochaine étape : recevoir une estimation préparée par le studio.

Permettre de corriger une réponse depuis ce récapitulatif, sans recommencer. Une page de revue sert aussi à rendre l’envoi plus explicite. [Principe de récapitulatif modifiable][U2]

Le bouton de demande d’estimation révèle les coordonnées dans le même parcours. Un résumé consultable sans e-mail est ma recommandation initiale ; son effet sur les contacts qualifiés devra être mesuré.

### Texte de promesse proposé

> Décrivez l’essentiel de votre projet. Repartez avec un premier cadrage et demandez une estimation personnalisée sous 24 h.

Texte proposé pour l’action finale : **Recevoir mon estimation**. Préciser à proximité que le studio examine les réponses et répond par e-mail. Ne pas annoncer une durée de remplissage avant de l’avoir réellement mesurée, ni un résultat instantané qui ne serait pas fourni.

## 8. Donner un budget crédible sans créer une usine à gaz

### Première version

Conserver le chiffrage humain. Un résumé déterministe fondé sur les choix suffit ; un appel à un modèle d’IA, un générateur de PDF et un moteur de devis ne sont pas nécessaires pour apporter une première valeur.

Le délai de réponse devient alors une capacité opérationnelle à tenir. Définir si « 24 h » signifie heures calendaires ou ouvrées, et adapter toutes les promesses au même engagement.

### Si une fourchette immédiate est ajoutée plus tard

Avant tout calcul, définir avec le studio des périmètres représentatifs, leurs coûts observés, les exclusions et une marge d’incertitude. Puis prévoir trois sorties :

| Niveau de connaissance | Résultat pertinent |
| --- | --- |
| Périmètre connu et comparable | Fourchette avec hypothèses et éléments compris. |
| Besoin partiellement défini | Ordre de grandeur plus large et précisions demandées. |
| Reprise ou complexité difficile à borner | Cadrage préalable, sans chiffre artificiel. |

Ne jamais utiliser le budget déclaré par le prospect pour augmenter mécaniquement le prix du même périmètre. Cette information sert à proposer une première version réaliste, pas à déterminer ce qu’il est prêt à payer.

Éviter les doubles comptes : paiement d’une boutique, permissions d’un espace administrateur, ou socle commun au web et au mobile. Le temps de développement, le délai calendaire et les frais récurrents doivent rester distincts. La maintenance et les services externes doivent être visibles lorsqu’ils ne sont pas compris.

Ne reprendre ni les coefficients ni les durées du concurrent. Nous ne connaissons pas leur calibration, leur organisation de production ou leur politique de marge.

## 9. Qualification commerciale et traitement des demandes

La première version peut fonctionner avec une boîte de réception et une routine de traitement claire. Un CRM, un scoring automatisé et une séquence marketing ne sont pas des prérequis.

### Les informations qui rendent un prospect exploitable

| Signal | Utilité | Usage à éviter |
| --- | --- | --- |
| Problème et objectif | Comprendre ce qui justifie le projet. | Réduire le besoin à une liste d’écrans. |
| Utilisateurs et usages | Délimiter une première version. | Exiger une maîtrise technique. |
| Éléments existants | Préparer la revue et éviter les suppositions. | Considérer tout code existant comme un gain de temps. |
| Date et flexibilité | Organiser une réponse réaliste. | Promettre une livraison avant examen. |
| Budget, s’il est partagé | Proposer un périmètre compatible. | Rejeter automatiquement une personne qui ne sait pas encore. |
| Coordonnées et langue | Assurer une réponse compréhensible. | Collecter des données sans usage concret. |

### Trois suites possibles

- **Projet suffisamment défini et compatible :** préparer une première estimation, expliciter ses hypothèses, puis proposer un échange ciblé si nécessaire.
- **Projet encore exploratoire :** envoyer la synthèse et quelques questions utiles, sans imposer immédiatement un rendez-vous long.
- **Besoin incompatible avec le périmètre, le budget ou le calendrier :** expliquer honnêtement la limite et proposer une alternative réaliste lorsque nous en avons une.

Le manque de vocabulaire technique n’est pas un mauvais signal commercial. L’absence de budget connu n’est pas automatiquement une absence de projet sérieux.

### Contenu des deux e-mails

**Notification au studio :** contact, langue, provenance du CTA, réponses regroupées, inconnues, synthèse présentée au visiteur. Le destinataire doit comprendre la demande sans aller récupérer des informations dispersées.

**Confirmation au visiteur :** reprise du résumé, délai annoncé, possibilité de répondre pour corriger ou compléter. Si aucun prix n’a encore été calculé, ne pas laisser entendre qu’un devis est déjà établi.

Prévoir une personne responsable du traitement. Le gain de conversion ne sert à rien si les demandes restent sans réponse. Une relance commerciale éventuelle doit correspondre à la demande exprimée ; aucune inscription automatique à une newsletter n’est proposée ici.

## 10. Mesure : optimiser les projets gagnés, pas les écrans de succès

Nous n’avons aucun chiffre de performance du formulaire concurrent. Les objectifs ci-dessous servent à organiser notre mesure future ; ce ne sont ni des benchmarks ni des promesses de hausse.

| Événement ou indicateur | Définition utile |
| --- | --- |
| Ouverture | Ouverture effective du parcours, avec CTA d’origine et langue. |
| Début | Première réponse significative, distincte d’une ouverture accidentelle. |
| Progression | Passage d’étape, branche et éventuelle erreur bloquante. |
| Synthèse vue | Restitution réellement affichée. |
| Demande acceptée | Succès renvoyé par le serveur après acceptation de la notification au studio. |
| Contact qualifié | Besoin réel entrant dans le périmètre commercial du studio. |
| Échange tenu | Conversation effectivement réalisée, distincte d’un clic de réservation. |
| Proposition puis projet gagné | Résultats suivis sur une même cohorte de demandes. |

Indicateurs prioritaires : demandes qualifiées par visiteur éligible, délai de première réponse, temps de qualification par demande et marge générée par les projets gagnés. Observer aussi l’abandon par étape et les erreurs d’envoi.

Comparer les cohortes à maturité équivalente : une demande récente n’a pas eu autant de temps pour devenir un client. Séparer les branches site/application, les sources de trafic, les langues et les appareils avant d’attribuer un changement au formulaire.

Modèle de décision simplifié :

```text
Valeur attendue du parcours
= demandes acceptées
  × proportion qualifiée
  × proportion devenant cliente
  × marge contributive moyenne par projet
  − coût d’acquisition attribuable
  − coût de qualification et de suivi
  − coût d’exploitation du parcours
```

Une hausse des envois peut être négative si elle absorbe le temps du studio avec des demandes incompatibles. Inversement, un formulaire qui produit moins d’envois mais davantage de projets adaptés peut être préférable.

Ne pas envoyer de texte libre, d’e-mail ou de numéro de téléphone dans les événements de mesure. Les informations utiles ici sont surtout des catégories, étapes et résultats.

### Expériences à envisager après une première base de mesure

| Hypothèse | Variation limitée | Critère de décision |
| --- | --- | --- |
| La synthèse démontre mieux l’expertise. | Résumé utile avant coordonnées, comparé à une simple invitation au contact. | Demandes qualifiées et qualité des échanges. |
| Le contexte d’entrée réduit l’effort. | Préremplissage modifiable selon le CTA. | Progression et fréquence de correction du type de projet. |
| Les questions conditionnelles améliorent les réponses. | Choix métier adaptés à chaque branche. | Compréhension du besoin et temps de qualification. |
| Une promesse humaine explicite rassure. | Mise en avant du délai réel et de la personne qui répond. | Demandes pertinentes et respect du délai annoncé. |

Ne pas lancer plusieurs variations simultanément sur un faible volume. Aucun test n’a été exécuté dans le cadre de ce document ; ces pistes restent à décider et à autoriser.

## 11. Intégration sobre dans le site existant

**Proposition :** un panneau latéral sur ordinateur et une présentation plein écran sur téléphone. C’est cohérent avec le souhait d’un site en une page, mais le format drawer reste à valider.

Garder un fond blanc, les tons verts de la marque et une animation discrète. Le formulaire sert à prendre une décision : les effets décoratifs de la page ne doivent pas gêner la saisie ou la lecture.

Prévoir une fermeture explicite, un retour facile, la conservation des réponses tant que le panneau reste dans la session de page et le retour du focus au bouton d’ouverture. Coordonner son défilement avec Lenis pour éviter que la page derrière se déplace pendant la saisie. Ne pas rendre la touche Entrée ou le retour navigateur susceptibles de perdre les réponses sans explication.

Conserver les ancrages des sections. Aucune nouvelle page d’offre, aucun `/home` et aucune route supplémentaire ne sont nécessaires pour ce premier parcours. Les versions `/fr`, `/en` et `/es` restent la structure validée.

### Points du code à connaître pour une future implémentation

| Fichier | Rôle actuel ou futur point d’entrée |
| --- | --- |
| `components/sections/contact/contact.content.ts` | Facteurs d’estimation et lien actuel vers le contact. |
| `components/sections/contact/ContactSection.tsx` | Section d’entrée vers l’estimation. |
| `components/sections/offers/offers.content.ts` | Offres et CTA permettant de préremplir le contexte. |
| `components/sections/contact/ContactForm.tsx` | Formulaire de contact à conserver comme accès direct. |
| `app/api/contact/route.ts` | Orchestration lisible des deux e-mails. |
| `lib/mailjet.ts` | Transport Mailjet existant à réutiliser. |
| `lib/contact-form.ts` | Contrat et validation actuels à respecter ou faire évoluer explicitement. |
| `lib/i18n/` | Types et traductions des trois langues. |
| `components/ui/smooth-scroll.tsx` | Interaction avec le défilement global. |

Le payload actuel n’est pas un formulaire d’estimation structuré : ne pas supposer qu’il accepte déjà toutes les réponses proposées. Étendre clairement le contrat lors de l’implémentation, tout en gardant la route courte et le formulaire de contact fonctionnel. Aucune nouvelle bibliothèque de formulaire n’est justifiée par cette analyse seule.

## 12. Priorités et décisions encore nécessaires

| Priorité | Travail | Pourquoi |
| --- | --- | --- |
| P0 | Valider la promesse : cadrage immédiat, réponse humaine sous 24 h. | Aligner le service et les attentes avant de dessiner les écrans. |
| P0 | Définir les deux branches principales et le traitement des reprises. | Éviter les questions inutiles et les estimations trompeuses. |
| P0 | Définir le résumé et la responsabilité de réponse. | Donner une valeur concrète et assurer le suivi. |
| P1 | Réaliser le parcours, ses traductions et son envoi. | Rendre le service disponible sans infrastructure superflue. |
| P1 | Prévoir les indicateurs essentiels, puis les mettre en place lorsqu’autorisés. | Distinguer activité et valeur commerciale. |
| P2 | Calibrer une fourchette pour les cas réellement répétables. | Ajouter une valeur immédiate quand les données le permettent. |
| P2 | Envisager PDF, sauvegarde durable ou CRM si l’usage le justifie. | Éviter des fonctionnalités sans bénéfice démontré. |

Décisions à demander au propriétaire avant une implémentation qui en dépend :

1. Le résumé avant coordonnées et le chiffrage humain constituent-ils la première version souhaitée ?
2. Quels projets le studio accepte-t-il concrètement, notamment commerce en ligne et reprise de code ?
3. Quelle est la définition opérationnelle de la réponse sous 24 h ?
4. Le panneau est-il confirmé, ou préfère-t-on un parcours directement dans la section ?
5. Si un prix immédiat est souhaité, quels barèmes, exclusions et données historiques sont disponibles ?

## 13. Brief autonome pour l’IA suivante

```text
Contexte
- Le bon dev est un site Next.js en une page, décliné en /fr, /en et /es.
- Offres principales : sites internet et applications web/mobile.
- Prix d’entrée existant : 2 500 € HT, cinq pages, contenus fournis.
- Promesse existante : première estimation sous 24 h.
- Le contact Mailjet fonctionne ; le propriétaire privilégie simplicité et fiabilité.
- Le formulaire guidé n’est pas encore implémenté.

Objectif business proposé
- Aider le visiteur à cadrer son projet.
- Donner une synthèse utile avant les coordonnées.
- Transformer les projets pertinents en demandes auxquelles le studio peut répondre.

Référence
- Le formulaire Bob comporte sept étapes documentées dans ce fichier.
- Leur description provient de l’HTML et du JavaScript publics, pas d’un test visuel réussi.
- Ne pas supposer qu’il fournit un tarif à l’écran ou connaître son traitement serveur.
- Ne pas copier ses textes, ses coefficients ou son modèle commercial.

Proposition à faire valider
- Quatre moments : besoin, existant, usages essentiels, calendrier.
- Puis synthèse modifiable et demande d’estimation avec prénom/e-mail.
- Questions adaptées au site, à l’application et à la reprise.
- Budget disponible facultatif ; jamais utilisé pour gonfler le prix.
- Première version avec chiffrage humain ; calcul immédiat uniquement après calibration.
- Panneau desktop / plein écran mobile envisagé, non décidé.

Contraintes
- Préserver la navigation, le contact direct et les trois langues.
- Réutiliser l’envoi Mailjet, sans créer un système abstrait de formulaires.
- Ne pas inventer de disponibilité, de prix ou de taux de conversion.
- Distinguer demande acceptée et e-mail effectivement délivré.
- Afficher une erreur réelle si la notification studio n’est pas acceptée.
- Ne pas renvoyer une demande déjà acceptée parce que la confirmation visiteur a échoué.
- Ne pas créer de pages de services ou de routes /home à partir de cette étude.
- Ne pas lancer de vérification, test, build ou contrôle visuel du projet sans demande explicite.
- Ne pas considérer ce document comme une autorisation de coder, commiter ou envoyer des messages.

Prochaine sortie utile
- Faire valider la promesse et les choix ouverts de la section 12.
- Puis proposer les questions et la synthèse en français, avant l’implémentation.
```

## Sources

- [Page de l’estimateur][B1] : HTML initial et ressources publiques associées.
- [Bundle du parcours][B2] : étapes, conditions, requête d’envoi, état final, métadonnées.
- [Catalogue public dans le bundle applicatif][B3] : module `7365`, options et données associées. L’ensemble du bundle contient aussi des modules sans rapport avec cette analyse.
- [Composants partagés du formulaire][B4] : module `7002` pour la navigation ; `9097` et `1550` pour les choix.
- [Offres commerciales de Bob][B5] : contexte de leur modèle, sans transposition de tarifs.
- [GOV.UK — conception des questions][U1] : justification, incertitude et navigation.
- [GOV.UK — vérification des réponses][U2] : restitution modifiable avant envoi.

[B1]: https://www.bob-le-developpeur.com/estimateur
[B2]: https://www.bob-le-developpeur.com/_next/static/chunks/pages/estimateur-292e7b4257ee2deb.js
[B3]: https://www.bob-le-developpeur.com/_next/static/chunks/pages/_app-7726933364489095.js
[B4]: https://www.bob-le-developpeur.com/_next/static/chunks/232-9cd383ac4ff2fdfc.js
[B5]: https://www.bob-le-developpeur.com/pricing
[U1]: https://design-system.service.gov.uk/patterns/question-pages/
[U2]: https://design-system.service.gov.uk/patterns/check-answers/
