export type FaqCopy = {
  eyebrow: string
  title: string
  description: string
  topicsLabel: string
  estimate: string
  contact: string
  closing: string
  groups: readonly {
    id: "avant" | "pendant" | "apres"
    title: string
    items: readonly {
      id: string
      question: string
      answer: string
      estimate?: boolean
    }[]
  }[]
}

// Approved copy from wireframe_faq_le_bon_dev_final_v2.html.
export const FAQ = {
  eyebrow: "Questions fréquentes",
  title: "Les questions qu'on nous pose avant de commencer.",
  description: "Et celles qu'on n'ose pas toujours poser.",
  topicsLabel: "Les thèmes des questions fréquentes",
  estimate: "Estimer mon projet",
  contact: "Prendre contact",
  closing: "Une question qui n'est pas ici ? Décrivez votre projet, on y répond dans l'estimation.",
  groups: [
    {
      id: "avant",
      title: "Avant de vous lancer",
      items: [
        {
          id: "prix",
          question: "Combien coûte un site internet ou une application ?",
          answer: "Un site vitrine de cinq pages, avec vos contenus : à partir de 2 500 € HT, payé une fois. Prise de rendez-vous, paiement, boutique ou plusieurs langues font monter le prix — et vous savez de combien avant de signer. Une application se chiffre au cadrage, jalon par jalon, et aucun montant n'est engagé sans votre accord. Pour un chiffre sur votre projet : quelques questions, une réponse sous 24 h.",
          estimate: true,
        },
        {
          id: "delai",
          question: "Combien de temps faut-il prévoir ?",
          answer: "Un site se livre en quelques semaines. Ce qui fixe le rythme, c'est surtout le design : avec une identité déjà en place, on avance vite ; s'il faut d'abord construire votre marque — logo, couleurs, typographies, façon de parler à vos clients — c'est un travail à part entière, qui vient avant le site. Ensuite, plus vos contenus arrivent tôt, plus le site avance. Une application se livre par jalons : une première version utilisable d'abord, puis des versions régulières que vous testez. Vous ne découvrez jamais le résultat à la fin.",
        },
        {
          id: "sur-mesure",
          question: "Pourquoi ne pas faire mon site moi-même, avec Wix ou WordPress ?",
          answer: "Vous pouvez, et pour tester une idée ou tenir quelques mois, c'est un bon choix. Les limites arrivent ensuite. Sur Google : des pages lourdes et des réglages bridés, difficiles à faire remonter dans votre ville. Avec vos outils — agenda, paiement, logiciels métier — vous dépendez des modules proposés, chacun avec son abonnement, et quand il n'existe pas, vous êtes bloqué. Et le site reste chez eux : un abonnement à vie, et le jour où il vous faut quelque chose de précis — un espace client, un devis en ligne — vous repartez de zéro. Un site sur mesure coûte plus au départ, et moins dès qu'il doit travailler pour vous.",
        },
        {
          id: "interlocuteur",
          question: "Un développeur indépendant ou une agence : quelle différence pour moi ?",
          answer: "Ici, la personne qui vous répond est celle qui conçoit et code. Pas de chef de projet entre vous et le travail, pas de brief qui se perd, des décisions prises en direct. Quand un projet demande d'autres profils — designer, second développeur — ils rejoignent l'équipe sans que votre interlocuteur change.",
        },
      ],
    },
    {
      id: "pendant",
      title: "Pendant le projet",
      items: [
        {
          id: "preparation",
          question: "Que dois-je préparer avant de commencer ?",
          answer: "Moins que vous ne pensez, et toujours à votre nom. Pour un site : ce que vous dites déjà à vos clients, vos photos, votre logo si vous en avez un ; les textes s'écrivent avec vous au cadrage. Pour une application : qui l'utilisera et ce qu'il doit pouvoir faire — un croquis, ou deux applications que vous aimez, suffisent pour démarrer. Viennent ensuite les comptes que l'on crée ensemble, à votre nom : le nom de domaine, les comptes développeur Apple et Google pour publier sur les stores, les accès aux outils à connecter. Dans tous les cas, on vous dit exactement ce qui manque, dans l'ordre où on en a besoin.",
        },
        {
          id: "changements",
          question: "Et si je change d'avis en cours de route ?",
          answer: "Le cadrage sert justement à l'éviter : on écrit ensemble ce que le projet doit faire avant de commencer. Un ajustement qui reste dans ce cadre — un texte, un écran, une règle qui change — s'intègre au fil des jalons, sans supplément. Une demande qui en sort est chiffrée avant d'être développée, et vous décidez : l'ajouter, la garder pour plus tard, ou l'échanger contre autre chose. Rien n'arrive sur la facture sans que vous l'ayez validé.",
        },
        {
          id: "reprise",
          question: "Pouvez-vous reprendre un site ou une application faits par quelqu'un d'autre ?",
          answer: "Oui. On commence par un état des lieux du code et des accès, puis on vous dit franchement : terminer, corriger ou repartir. Aucun identifiant ni fichier n'est demandé avant cet échange.",
        },
      ],
    },
    {
      id: "apres",
      title: "Après la mise en ligne",
      items: [
        {
          id: "propriete",
          question: "À qui appartiennent le code, le nom de domaine et les accès ?",
          answer: "À vous, dès le premier jour. Code, hébergement, nom de domaine, comptes des stores et documentation sont à votre nom et vous sont remis à la livraison. Si demain vous changez de prestataire — ou si le studio n'est plus disponible — un autre développeur reprend le projet sans repartir de zéro.",
        },
        {
          id: "autonomie",
          question: "Pourrai-je modifier mon site moi-même ?",
          answer: "Oui, si vous le prévoyez. Pour des changements réguliers — horaires, actualités, photos, tarifs — dites-le au cadrage : on construit le site avec un espace d'administration, et il figure dans le devis. Sinon, le site est livré tel quel, et on s'occupe des modifications pour vous, à la demande.",
        },
        {
          id: "maintenance",
          question: "Y a-t-il un abonnement ? Que se passe-t-il après la livraison ?",
          answer: "Pas d'abonnement pour la création. L'hébergement, le nom de domaine et, si vous en utilisez, l'outil de rendez-vous ou de paiement sont des frais que vous réglez directement, à votre nom. Pendant un mois, les corrections sont comprises. Ensuite, pour un site : évolutions sur devis ou en accompagnement continu. Pour une application : un forfait mensuel de maintenance, en option, qui la garde compatible avec iOS et Android, disponible sur les stores et en évolution.",
        },
      ],
    },
  ],
} as const satisfies FaqCopy
