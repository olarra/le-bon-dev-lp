import type { Locale } from "@/lib/i18n/config"

type LegalCopy = {
  missing: string
  labels: {
    publisher: string; name: string; address: string; email: string; phone: string; website: string
  }
  notice: {
    introduction: string; hosting: string; contents: string
    publisherText: (name: string, tradingName: string) => string
    activityText: (cooperative: string, registration: string) => string
    publisherPending: string; hostingPending: string; rights: string
    privacy: string; privacyText: string; privacyLink: string
    usage: string; accuracy: string; external: string
  }
  privacy: {
    introduction: string; controller: string; controllerText: string; controllerLink: string
    purposes: string; collected: string; required: string; basis: string
    visits: string; visitsText: string; visitsProtection: string; visitsChoice: string; visitsRetentionPending: string
    visitsRetentionText: (days: number) => string
    recipients: string; recipientsText: string; mailjet: string; mailjetLink: string; hostingPending: string; hostingLink: string
    retention: string; retentionText: (months: number) => string; retentionPending: string; clients: string
    storage: string; draftStorage: string; trackers: string
    security: string; securityText: string
    rights: string; rightsText: string; contact: string; complaint: string; cnilLink: string
    updates: string; updatesText: string
  }
}

const copies: Record<Locale, LegalCopy> = {
  fr: {
    missing: "À compléter",
    labels: {
      publisher: "Éditeur", name: "Nom juridique", address: "Adresse", email: "E-mail", phone: "Téléphone", website: "Site internet",
    },
    notice: {
      introduction: "Identité de l’éditeur, hébergement et règles d’utilisation du site Le bon dev.",
      hosting: "Hébergement", contents: "Propriété intellectuelle",
      publisherText: (name, tradingName) => `Le site lebondev.fr est publié sous le nom commercial « ${tradingName} » par ${name}, éditeur et directeur de la publication.`,
      activityText: (cooperative, registration) => `L’activité de conception et de développement web et mobile est exercée en qualité d’entrepreneur-salarié au sein de la coopérative d’activité et d’emploi ${cooperative} (${registration}).`,
      publisherPending: "Le bon dev est le nom du studio. L’identité et les coordonnées de l’éditeur restent à compléter.",
      hostingPending: "Les coordonnées de l’hébergeur seront ajoutées après le choix de l’hébergement de production.",
      rights: "Les textes, visuels, logos et éléments graphiques du site appartiennent au studio ou à leurs titulaires respectifs. Leur réutilisation nécessite l’autorisation du titulaire concerné, sauf exception légale ou licence applicable.",
      privacy: "Données personnelles",
      privacyText: "L’utilisation des données des formulaires, leur conservation et vos droits sont présentés dans notre politique de confidentialité.",
      privacyLink: "Lire la politique de confidentialité",
      usage: "Informations et liens externes",
      accuracy: "Le studio veille à tenir ce site à jour. Pour signaler une erreur ou un problème lié à un contenu, écrivez à",
      external: "Les sites accessibles par un lien, dont WhatsApp, sont gérés par des tiers et appliquent leurs propres conditions d’utilisation et de confidentialité.",
    },
    privacy: {
      introduction: "Les informations confiées à Le bon dev servent à échanger sur votre projet. Cette page précise leur utilisation et les moyens d’exercer vos droits.",
      controller: "Responsable et contact",
      controllerText: "Les traitements liés au site sont placés sous la responsabilité de son éditeur :",
      controllerLink: "Coordonnées complètes dans les mentions légales",
      purposes: "Demandes de contact et d’estimation",
      collected: "Les formulaires recueillent vos coordonnées (nom ou prénom, e-mail, entreprise et téléphone si renseignés) et les informations sur votre projet : message, besoins, budget ou délai. La langue, la date d’envoi et l’offre à l’origine d’une estimation accompagnent la demande.",
      required: "Sans nom ou prénom, e-mail et message ou type de projet, l’envoi n’est pas possible. L’entreprise, le téléphone et les précisions complémentaires sont facultatifs.",
      basis: "Ces données servent à vous répondre et à préparer une proposition. Les demandes d’estimation relèvent des mesures précontractuelles (article 6.1.b du RGPD) ; les autres échanges, de notre intérêt légitime à répondre à vos sollicitations (article 6.1.f).",
      visits: "Notifications de visite",
      visitsText: "Au chargement de l’accueil ou de l’estimation, le studio peut recevoir un e-mail contenant la page, sa langue, l’heure, l’adresse IP et sa localisation estimée par Vercel : ville, région, pays, code postal et coordonnées approximatives, lorsque ces informations sont disponibles. Cet e-mail ne contient aucune donnée saisie dans les formulaires. La localisation peut correspondre à un VPN ou à un relais réseau.",
      visitsProtection: "Vercel traite les données techniques de connexion pour filtrer les robots, estimer la localisation de l’IP et limiter les envois répétés. Les notifications sont acheminées par Mailjet vers la messagerie du studio. Ce suivi ponctuel et sa protection reposent sur notre intérêt légitime à suivre l’activité du site et prévenir les abus (article 6.1.f du RGPD).",
      visitsChoice: "Le dispositif n’ajoute pas d’identifiant de visiteur ni de stockage de suivi dans votre navigateur. Il n’envoie pas de notification si votre navigateur transmet le signal Do Not Track ou Global Privacy Control. Vous pouvez également nous contacter pour exercer votre droit d’opposition.",
      visitsRetentionPending: "Notifications de visite : durée de conservation dans la messagerie à définir avant activation.",
      visitsRetentionText: days => `Les notifications de visite sont conservées dans la messagerie du studio pendant ${days} jours au maximum à compter de leur réception, puis supprimées.`,
      recipients: "Accès aux données",
      recipientsText: "Vos demandes arrivent dans la messagerie du studio. L’hébergeur et les prestataires de messagerie traitent les informations nécessaires à leurs services.",
      mailjet: "Les envois et confirmations passent par Mailjet (Sinch). Les garanties applicables aux transferts internationaux figurent dans son accord de traitement.",
      mailjetLink: "Accord de traitement Mailjet / Sinch",
      hostingPending: "L’hébergeur, ses lieux de traitement et les éventuelles garanties de transfert restent à préciser avant publication.",
      hostingLink: "Accord de traitement de l’hébergeur",
      retention: "Durées de conservation",
      retentionText: months => `Les demandes sans suite sont conservées au maximum ${months} mois à compter de leur réception ou du dernier contact de votre part, puis supprimées.`,
      retentionPending: "Demandes sans suite : durée à définir avant publication.",
      clients: "Pour les projets confiés au studio, la conservation couvre le suivi de la prestation et les durées légales applicables aux documents concernés.",
      storage: "Cookies et brouillon",
      draftStorage: "L’estimation est sauvegardée sur votre appareil pour reprendre le formulaire. Ce brouillon n’est transmis au studio qu’à l’envoi et s’efface après un envoi réussi. Sinon, il reste jusqu’à la suppression des données du site dans votre navigateur.",
      trackers: "Le site n’utilise pas de cookies publicitaires ni de suivi publicitaire entre plusieurs sites.",
      security: "Sécurité",
      securityText: "La connexion au site est chiffrée en HTTPS. Nous limitons les données demandées aux besoins de votre projet et leur accès au studio et aux prestataires nécessaires à leur traitement.",
      rights: "Exercer vos droits",
      rightsText: "Vous pouvez demander l’accès à vos données, leur correction, leur suppression ou la limitation de leur utilisation. Selon les conditions du RGPD, vous pouvez aussi demander leur portabilité ou vous opposer aux traitements fondés sur notre intérêt légitime.",
      contact: "Adressez votre demande à",
      complaint: "Vous pouvez saisir la CNIL si vous estimez que vos droits ne sont pas respectés.",
      cnilLink: "Déposer une réclamation",
      updates: "Modifications",
      updatesText: "Cette politique est adaptée lorsque nos services ou l’utilisation de vos données évoluent. La date affichée en haut de page indique sa dernière révision.",
    },
  },
  en: {
    missing: "To be completed",
    labels: {
      publisher: "Publisher", name: "Legal name", address: "Address", email: "Email", phone: "Phone", website: "Website",
    },
    notice: {
      introduction: "Publisher details, hosting and terms of use for the Le bon dev website.",
      hosting: "Hosting", contents: "Intellectual property",
      publisherText: (name, tradingName) => `The website lebondev.fr is published under the trading name “${tradingName}” by ${name}, publisher and publication director.`,
      activityText: (cooperative, registration) => `The web and mobile design and development activity is carried out as an entrepreneur-salarié (salaried entrepreneur) within the French business and employment cooperative ${cooperative} (${registration}).`,
      publisherPending: "Le bon dev is the studio’s name. The publisher’s identity and contact details remain to be completed.",
      hostingPending: "The host’s contact details will be added once production hosting has been selected.",
      rights: "The website’s text, images, logos and graphics belong to the studio or their respective rights holders. Reuse requires the relevant rights holder’s permission, unless a legal exception or applicable licence allows it.",
      privacy: "Personal data",
      privacyText: "Our privacy policy explains how form data is used, how long it is kept and how to exercise your rights.",
      privacyLink: "Read the privacy policy",
      usage: "Information and external links",
      accuracy: "The studio aims to keep this website up to date. To report an error or a concern about its content, email",
      external: "Linked websites, including WhatsApp, are managed by third parties and apply their own terms of use and privacy policies.",
    },
    privacy: {
      introduction: "Information shared with Le bon dev helps us discuss your project. This page explains how it is used and how to exercise your rights.",
      controller: "Data controller and contact",
      controllerText: "The website’s publisher is responsible for the processing described here:",
      controllerLink: "Full contact details in the legal notice",
      purposes: "Contact and estimate requests",
      collected: "The forms collect your contact details (name, email, and company and phone number if provided) and project information: your message, needs, budget or timing. Your request also includes the language, submission date and the offer that led you to an estimate.",
      required: "A name, email and message or project type are needed to submit a request. Company, phone number and further project details are optional.",
      basis: "We use this information to reply and prepare a proposal. Estimate requests are processed as steps prior to a contract (GDPR Article 6(1)(b)); other enquiries rely on our legitimate interest in answering your questions (Article 6(1)(f)).",
      visits: "Visit notifications",
      visitsText: "When the home or estimate page loads, the studio may receive an email containing the page, its language, the time, the IP address and its location estimated by Vercel: city, region, country, postal code and approximate coordinates, where available. The email contains no information entered in forms. The location may correspond to a VPN or network relay.",
      visitsProtection: "Vercel processes technical connection data to filter bots, estimate the IP’s location and limit repeated notifications. Mailjet delivers the notifications to the studio’s mailbox. This occasional monitoring and its protection rely on our legitimate interest in following website activity and preventing abuse (GDPR Article 6(1)(f)).",
      visitsChoice: "The feature does not add a visitor identifier or tracking storage to your browser. It does not send a notification if your browser transmits a Do Not Track or Global Privacy Control signal. You can also contact us to exercise your right to object.",
      visitsRetentionPending: "Visit notifications: mailbox retention period to be defined before activation.",
      visitsRetentionText: days => `Visit notifications are kept in the studio’s mailbox for up to ${days} days after receipt, then deleted.`,
      recipients: "Access to your data",
      recipientsText: "Your requests arrive in the studio’s mailbox. Hosting and email providers process the information needed to deliver their services.",
      mailjet: "Requests and confirmations are sent through Mailjet (Sinch). Its data processing agreement describes the safeguards for international transfers.",
      mailjetLink: "Mailjet / Sinch data processing agreement",
      hostingPending: "The host, processing locations and any transfer safeguards remain to be specified before publication.",
      hostingLink: "Host’s data processing agreement",
      retention: "Retention periods",
      retentionText: months => `Enquiries that do not lead to a project are kept for up to ${months} months from receipt or your most recent contact, then deleted.`,
      retentionPending: "Enquiries without a follow-up project: retention period to be defined before publication.",
      clients: "For projects entrusted to the studio, data is kept to manage the service and for the statutory periods applicable to the relevant documents.",
      storage: "Cookies and saved drafts",
      draftStorage: "Your estimate is saved on your device so you can resume the form. This draft is only sent to the studio when you submit it and is removed after a successful submission. Otherwise, it remains until you clear the website’s data in your browser.",
      trackers: "The website does not use advertising cookies or cross-site advertising tracking.",
      security: "Security",
      securityText: "Connections to the website are encrypted using HTTPS. We limit the information requested to your project’s needs and access to the studio and service providers involved in handling your request.",
      rights: "Exercising your rights",
      rightsText: "You can request access to your data, correction, deletion or restricted use. Where the GDPR provides for it, you can also request portability or object to processing based on our legitimate interests.",
      contact: "Send your request to",
      complaint: "You can lodge a complaint with the French data protection authority, the CNIL, if you believe your rights have not been respected.",
      cnilLink: "Lodge a complaint",
      updates: "Changes",
      updatesText: "We update this policy when our services or the way we use your data change. The date at the top of this page shows the latest revision.",
    },
  },
  es: {
    missing: "Por completar",
    labels: {
      publisher: "Titular", name: "Nombre legal", address: "Dirección", email: "Correo electrónico", phone: "Teléfono", website: "Sitio web",
    },
    notice: {
      introduction: "Datos del titular, alojamiento y condiciones de uso del sitio Le bon dev.",
      hosting: "Alojamiento", contents: "Propiedad intelectual",
      publisherText: (name, tradingName) => `El sitio lebondev.fr se publica bajo el nombre comercial «${tradingName}» por ${name}, titular y director de la publicación.`,
      activityText: (cooperative, registration) => `La actividad de diseño y desarrollo web y móvil se ejerce como entrepreneur-salarié (emprendedor asalariado) dentro de la cooperativa francesa de actividad y empleo ${cooperative} (${registration}).`,
      publisherPending: "Le bon dev es el nombre del estudio. Faltan la identidad y los datos de contacto del titular.",
      hostingPending: "Los datos de contacto del proveedor se añadirán al elegir el alojamiento de producción.",
      rights: "Los textos, imágenes, logotipos y elementos gráficos del sitio pertenecen al estudio o a sus respectivos titulares. Su reutilización requiere la autorización del titular correspondiente, salvo excepción legal o licencia aplicable.",
      privacy: "Datos personales",
      privacyText: "Nuestra política de privacidad explica el uso de los datos de los formularios, su conservación y cómo ejercer tus derechos.",
      privacyLink: "Leer la política de privacidad",
      usage: "Información y enlaces externos",
      accuracy: "El estudio procura mantener este sitio al día. Para señalar un error o un problema relacionado con su contenido, escribe a",
      external: "Los sitios enlazados, incluido WhatsApp, son gestionados por terceros y aplican sus propias condiciones de uso y políticas de privacidad.",
    },
    privacy: {
      introduction: "La información que compartes con Le bon dev nos permite hablar de tu proyecto. Esta página explica su uso y cómo ejercer tus derechos.",
      controller: "Responsable y contacto",
      controllerText: "El titular del sitio es responsable de los tratamientos descritos aquí:",
      controllerLink: "Datos de contacto completos en el aviso legal",
      purposes: "Consultas y solicitudes de estimación",
      collected: "Los formularios recogen tus datos de contacto (nombre, correo y, si los indicas, empresa y teléfono) y la información de tu proyecto: mensaje, necesidades, presupuesto o plazos. La solicitud también incluye el idioma, la fecha de envío y la oferta desde la que accediste a la estimación.",
      required: "Para enviar una solicitud se necesitan un nombre, un correo y un mensaje o tipo de proyecto. La empresa, el teléfono y los detalles adicionales son opcionales.",
      basis: "Usamos estos datos para responderte y preparar una propuesta. Las estimaciones se basan en medidas precontractuales (artículo 6.1.b del RGPD); las demás consultas, en nuestro interés legítimo en atender tus preguntas (artículo 6.1.f).",
      visits: "Notificaciones de visita",
      visitsText: "Al cargar la página de inicio o de estimación, el estudio puede recibir un correo con la página, su idioma, la hora, la dirección IP y su ubicación estimada por Vercel: ciudad, región, país, código postal y coordenadas aproximadas, cuando estén disponibles. El correo no contiene datos introducidos en los formularios. La ubicación puede corresponder a una VPN o a un relé de red.",
      visitsProtection: "Vercel trata los datos técnicos de conexión para filtrar robots, estimar la ubicación de la IP y limitar los envíos repetidos. Mailjet entrega las notificaciones al buzón del estudio. Este seguimiento puntual y su protección se basan en nuestro interés legítimo en conocer la actividad del sitio y prevenir abusos (artículo 6.1.f del RGPD).",
      visitsChoice: "El dispositivo no añade un identificador de visitante ni almacenamiento de seguimiento en tu navegador. No envía notificaciones si tu navegador transmite la señal Do Not Track o Global Privacy Control. También puedes contactarnos para ejercer tu derecho de oposición.",
      visitsRetentionPending: "Notificaciones de visita: plazo de conservación en el buzón por definir antes de la activación.",
      visitsRetentionText: days => `Las notificaciones de visita se conservan en el buzón del estudio durante un máximo de ${days} días desde su recepción y después se eliminan.`,
      recipients: "Acceso a los datos",
      recipientsText: "Tus solicitudes llegan al buzón del estudio. Los proveedores de alojamiento y correo tratan la información necesaria para prestar sus servicios.",
      mailjet: "Los envíos y las confirmaciones pasan por Mailjet (Sinch). Su acuerdo de tratamiento describe las garantías aplicables a las transferencias internacionales.",
      mailjetLink: "Acuerdo de tratamiento de Mailjet / Sinch",
      hostingPending: "El proveedor de alojamiento, los lugares de tratamiento y las posibles garantías de transferencia se concretarán antes de publicar.",
      hostingLink: "Acuerdo de tratamiento del proveedor de alojamiento",
      retention: "Plazos de conservación",
      retentionText: months => `Las solicitudes que no dan lugar a un proyecto se conservan durante un máximo de ${months} meses desde su recepción o tu último contacto y después se eliminan.`,
      retentionPending: "Solicitudes sin proyecto posterior: plazo por definir antes de publicar.",
      clients: "En los proyectos encargados al estudio, los datos se conservan para gestionar la prestación y durante los plazos legales aplicables a los documentos correspondientes.",
      storage: "Cookies y borrador",
      draftStorage: "La estimación se guarda en tu dispositivo para que puedas retomarla. El borrador solo llega al estudio al enviarlo y se elimina tras un envío correcto. Si no lo envías, permanece hasta que borres los datos del sitio en tu navegador.",
      trackers: "El sitio no utiliza cookies publicitarias ni seguimiento publicitario entre distintos sitios.",
      security: "Seguridad",
      securityText: "La conexión al sitio está cifrada mediante HTTPS. Limitamos los datos solicitados a las necesidades de tu proyecto y su acceso al estudio y a los proveedores que intervienen en su tratamiento.",
      rights: "Ejercer tus derechos",
      rightsText: "Puedes pedir acceso a tus datos, su corrección, eliminación o la limitación de su uso. En los casos previstos por el RGPD, también puedes solicitar su portabilidad u oponerte a tratamientos basados en nuestro interés legítimo.",
      contact: "Envía tu solicitud a",
      complaint: "Puedes reclamar ante la autoridad francesa de protección de datos, la CNIL, si consideras que no se han respetado tus derechos.",
      cnilLink: "Presentar una reclamación",
      updates: "Modificaciones",
      updatesText: "Actualizamos esta política cuando cambian nuestros servicios o el uso de tus datos. La fecha al inicio de la página indica la última revisión.",
    },
  },
}

export function getLegalCopy(locale: Locale) {
  return copies[locale]
}
