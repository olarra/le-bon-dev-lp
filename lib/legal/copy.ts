import type { Locale } from "@/lib/i18n/config"

type LegalCopy = {
  draft: string
  missing: string
  labels: {
    publisher: string; name: string; legalForm: string; address: string; registration: string
    vat: string; capital: string; email: string; phone: string; website: string
  }
  notice: {
    introduction: string; publication: string; hosting: string; contents: string
    publisherPending: string; hostingPending: string; rights: string; external: string; privacyLink: string
  }
  privacy: {
    introduction: string; controller: string; controllerText: string; controllerLink: string
    purposes: string; collected: string; required: string; basis: string
    recipients: string; recipientsText: string; mailjet: string; mailjetLink: string; hostingPending: string
    retention: string; retentionText: (months: number) => string; retentionPending: string; clients: string
    draftStorage: string; trackers: string; rights: string; rightsText: string; contact: string; complaint: string; cnilLink: string
  }
}

const copies: Record<Locale, LegalCopy> = {
  fr: {
    draft: "Version provisoire — l’identité juridique, l’hébergement et la durée de conservation restent à compléter avant publication.",
    missing: "À compléter",
    labels: {
      publisher: "Éditeur", name: "Nom juridique", legalForm: "Statut", address: "Adresse", registration: "Immatriculation",
      vat: "TVA intracommunautaire", capital: "Capital social", email: "E-mail", phone: "Téléphone", website: "Site internet",
    },
    notice: {
      introduction: "Les informations sur l’éditeur et l’hébergement de lebondev.fr.",
      publication: "Responsable de la publication", hosting: "Hébergement", contents: "Contenus et liens",
      publisherPending: "Le bon dev est le nom du studio. L’identité juridique de l’éditeur, son statut, son adresse et son immatriculation restent à compléter, ainsi que le capital et la TVA si applicables.",
      hostingPending: "Le nom, l’adresse et le téléphone de l’hébergeur du site seront renseignés une fois l’hébergement de production choisi.",
      rights: "Les textes, visuels, logos et autres contenus présentés sur ce site restent la propriété de leurs titulaires respectifs. Pour une réutilisation au-delà de ce qu’autorise la loi, contactez le studio ou le titulaire des droits concerné.",
      external: "Les liens vers des sites et services externes, notamment WhatsApp, donnent accès à des services qui appliquent leurs propres conditions et règles de confidentialité.",
      privacyLink: "Consulter la politique de confidentialité",
    },
    privacy: {
      introduction: "Comment vos informations sont utilisées lorsque vous contactez le studio ou demandez une estimation.",
      controller: "Qui utilise vos données ?",
      controllerText: "Le responsable du traitement est l’éditeur de Le bon dev, identifié dans les mentions légales.",
      controllerLink: "Identité et coordonnées de l’éditeur",
      purposes: "Les formulaires et leur usage",
      collected: "Nous recevons les informations que vous saisissez : nom ou prénom, e-mail, entreprise et téléphone facultatifs, ainsi que votre message ou les réponses sur votre projet. La langue du formulaire, la date de réception et, pour l’estimation, l’offre depuis laquelle vous êtes arrivé accompagnent la demande.",
      required: "Le nom ou prénom, l’e-mail et un message ou une indication sur le projet sont nécessaires pour envoyer une demande et vous répondre. Les autres renseignements sont facultatifs. Évitez d’inclure des données sensibles dans les champs libres.",
      basis: "Les demandes d’estimation sont traitées pour préparer, à votre demande, une éventuelle prestation : il s’agit de mesures précontractuelles. Les autres prises de contact reposent sur notre intérêt légitime à répondre aux personnes qui nous sollicitent. L’envoi d’un formulaire ne vous inscrit à aucune newsletter.",
      recipients: "Qui reçoit les informations ?",
      recipientsText: "Le studio reçoit votre demande par e-mail. Les prestataires d’hébergement, de messagerie et d’acheminement interviennent dans la mesure nécessaire au fonctionnement du service. Les formulaires ne créent pas de fiche dans une base de données du site.",
      mailjet: "Mailjet, un service de Sinch, assure l’envoi de la demande au studio et de la confirmation au visiteur. Son accord de traitement des données précise les conditions applicables, notamment pour les éventuels transferts internationaux.",
      mailjetLink: "Protection des données chez Mailjet / Sinch",
      hostingPending: "Les lieux de traitement et les éventuelles garanties de transfert liés à l’hébergement du site restent à préciser avec le choix du prestataire.",
      retention: "Conservation et brouillon local",
      retentionText: months => `Les échanges relatifs aux demandes qui ne deviennent pas des projets clients sont conservés ${months} mois après le dernier échange, puis supprimés.`,
      retentionPending: "La durée de conservation des demandes sans suite reste à définir avant publication.",
      clients: "Lorsqu’un projet démarre, les informations nécessaires sont conservées pendant la relation, puis selon les obligations de conservation applicables aux documents concernés.",
      draftStorage: "Le formulaire d’estimation garde un brouillon dans le stockage local de votre navigateur pour vous permettre de reprendre votre saisie. Il est effacé après un envoi réussi. Sans envoi, il reste dans ce navigateur jusqu’à l’effacement des données du site, que vous pouvez effectuer dans ses réglages.",
      trackers: "Le site n’intègre pas d’outil de mesure d’audience ni de traceur publicitaire. Le brouillon local sert uniquement à reprendre l’estimation.",
      rights: "Vos droits",
      rightsText: "Vous pouvez demander l’accès à vos données, leur rectification, leur effacement ou la limitation de leur traitement. Selon les conditions prévues par le RGPD, vous pouvez aussi demander leur portabilité ou vous opposer aux traitements fondés sur notre intérêt légitime.",
      contact: "Pour exercer vos droits ou poser une question, écrivez à",
      complaint: "Vous pouvez également adresser une réclamation à la CNIL.",
      cnilLink: "Contacter la CNIL",
    },
  },
  en: {
    draft: "Draft — the publisher’s legal details, hosting and retention period must be completed before publication.",
    missing: "To be completed",
    labels: {
      publisher: "Publisher", name: "Legal name", legalForm: "Legal status", address: "Address", registration: "Registration",
      vat: "EU VAT number", capital: "Share capital", email: "Email", phone: "Phone", website: "Website",
    },
    notice: {
      introduction: "Information about the publisher and hosting of lebondev.fr.",
      publication: "Publication director", hosting: "Hosting", contents: "Content and links",
      publisherPending: "Le bon dev is the studio’s name. The publisher’s legal identity, status, address and registration are still to be completed, together with share capital and VAT details where applicable.",
      hostingPending: "The website host’s name, address and phone number will be provided once production hosting has been selected.",
      rights: "The text, images, logos and other content on this website remain the property of their respective rights holders. For reuse beyond what the law permits, please contact the studio or the relevant rights holder.",
      external: "Links to external websites and services, including WhatsApp, lead to services governed by their own terms and privacy rules.",
      privacyLink: "Read the privacy policy",
    },
    privacy: {
      introduction: "How your information is used when you contact the studio or request an estimate.",
      controller: "Who uses your data?",
      controllerText: "The data controller is the publisher of Le bon dev, identified in the legal notice.",
      controllerLink: "Publisher identity and contact details",
      purposes: "Forms and their purpose",
      collected: "We receive the information you enter: your name, email, optional company and phone number, and your message or project answers. The form language, receipt date and, for estimates, the offer that led you to the form accompany your request.",
      required: "Your name, email and a message or project indication are needed to send a request and receive a reply. Other details are optional. Please avoid including sensitive data in free-text fields.",
      basis: "Estimate requests are processed to prepare a possible service at your request, as steps prior to entering into a contract. Other enquiries rely on our legitimate interest in replying to people who contact us. Submitting a form does not subscribe you to a newsletter.",
      recipients: "Who receives the information?",
      recipientsText: "The studio receives your request by email. Hosting, mailbox and email delivery providers process information as needed to run the service. The forms do not create a record in a website database.",
      mailjet: "Mailjet, a Sinch service, delivers the request to the studio and the confirmation to the visitor. Its data processing agreement sets out the applicable terms, including those relating to any international transfers.",
      mailjetLink: "Mailjet / Sinch data protection",
      hostingPending: "Processing locations and any transfer safeguards associated with website hosting remain to be specified once the provider is selected.",
      retention: "Retention and your saved draft",
      retentionText: months => `Exchanges about enquiries that do not become client projects are kept for ${months} months after the last exchange, then deleted.`,
      retentionPending: "The retention period for enquiries that do not lead to a project must be defined before publication.",
      clients: "If a project goes ahead, necessary information is kept during the relationship and subsequently for the retention periods applicable to the relevant documents.",
      draftStorage: "The estimate form saves a draft in your browser’s local storage so you can resume it. The draft is deleted after a successful submission. If you do not submit it, it remains in that browser until the website’s stored data is cleared through your browser settings.",
      trackers: "The website does not integrate audience analytics or advertising trackers. The saved draft is used only to resume your estimate.",
      rights: "Your rights",
      rightsText: "You can request access to your data, correction, erasure or restriction of processing. Under the conditions set out in the GDPR, you may also request data portability or object to processing based on our legitimate interests.",
      contact: "To exercise your rights or ask a question, email",
      complaint: "You may also lodge a complaint with the French data protection authority, the CNIL.",
      cnilLink: "Contact the CNIL",
    },
  },
  es: {
    draft: "Versión provisional — faltan los datos legales del titular, el alojamiento y el plazo de conservación antes de publicar.",
    missing: "Por completar",
    labels: {
      publisher: "Titular", name: "Nombre legal", legalForm: "Forma jurídica", address: "Dirección", registration: "Registro",
      vat: "Número de IVA intracomunitario", capital: "Capital social", email: "Correo electrónico", phone: "Teléfono", website: "Sitio web",
    },
    notice: {
      introduction: "Información sobre el titular y el alojamiento de lebondev.fr.",
      publication: "Responsable de la publicación", hosting: "Alojamiento", contents: "Contenidos y enlaces",
      publisherPending: "Le bon dev es el nombre del estudio. Faltan la identidad jurídica del titular, su forma jurídica, dirección y registro, así como el capital social y el IVA cuando correspondan.",
      hostingPending: "El nombre, la dirección y el teléfono del proveedor de alojamiento se indicarán cuando se elija el alojamiento de producción.",
      rights: "Los textos, imágenes, logotipos y demás contenidos de este sitio pertenecen a sus respectivos titulares. Para reutilizarlos más allá de lo permitido por la ley, contacta con el estudio o con el titular de los derechos correspondiente.",
      external: "Los enlaces a sitios y servicios externos, incluido WhatsApp, llevan a servicios que aplican sus propias condiciones y normas de privacidad.",
      privacyLink: "Leer la política de privacidad",
    },
    privacy: {
      introduction: "Cómo se utiliza tu información cuando contactas con el estudio o solicitas una estimación.",
      controller: "¿Quién utiliza tus datos?",
      controllerText: "El responsable del tratamiento es el titular de Le bon dev, identificado en el aviso legal.",
      controllerLink: "Identidad y datos de contacto del titular",
      purposes: "Los formularios y su finalidad",
      collected: "Recibimos la información que introduces: nombre, correo electrónico, empresa y teléfono opcionales, además de tu mensaje o las respuestas sobre tu proyecto. La solicitud incluye el idioma del formulario, la fecha de recepción y, para las estimaciones, la oferta desde la que accediste.",
      required: "El nombre, el correo electrónico y un mensaje o una indicación sobre el proyecto son necesarios para enviar una solicitud y recibir respuesta. Los demás datos son opcionales. Evita incluir datos sensibles en los campos de texto libre.",
      basis: "Las solicitudes de estimación se tratan para preparar, a petición tuya, una posible prestación: son medidas precontractuales. Las demás consultas se basan en nuestro interés legítimo en responder a quienes nos contactan. Enviar un formulario no te suscribe a ninguna newsletter.",
      recipients: "¿Quién recibe la información?",
      recipientsText: "El estudio recibe tu solicitud por correo electrónico. Los proveedores de alojamiento, buzón de correo y envío intervienen en la medida necesaria para prestar el servicio. Los formularios no crean un registro en una base de datos del sitio.",
      mailjet: "Mailjet, un servicio de Sinch, envía la solicitud al estudio y la confirmación al visitante. Su acuerdo de tratamiento de datos establece las condiciones aplicables, incluidas las relativas a posibles transferencias internacionales.",
      mailjetLink: "Protección de datos de Mailjet / Sinch",
      hostingPending: "Los lugares de tratamiento y las posibles garantías de transferencia del alojamiento del sitio se concretarán cuando se elija el proveedor.",
      retention: "Conservación y borrador local",
      retentionText: months => `Los intercambios sobre solicitudes que no se convierten en proyectos de clientes se conservan durante ${months} meses desde el último intercambio y después se eliminan.`,
      retentionPending: "El plazo de conservación de las solicitudes que no dan lugar a un proyecto debe definirse antes de publicar.",
      clients: "Si el proyecto se lleva a cabo, la información necesaria se conserva durante la relación y, posteriormente, durante los plazos aplicables a los documentos correspondientes.",
      draftStorage: "El formulario de estimación guarda un borrador en el almacenamiento local de tu navegador para que puedas retomarlo. Se elimina tras un envío correcto. Si no lo envías, permanece en ese navegador hasta que borres los datos del sitio desde sus ajustes.",
      trackers: "El sitio no integra herramientas de medición de audiencia ni rastreadores publicitarios. El borrador local solo sirve para retomar la estimación.",
      rights: "Tus derechos",
      rightsText: "Puedes solicitar acceso a tus datos, su rectificación, supresión o la limitación del tratamiento. En las condiciones previstas por el RGPD, también puedes solicitar la portabilidad u oponerte a tratamientos basados en nuestro interés legítimo.",
      contact: "Para ejercer tus derechos o hacer una consulta, escribe a",
      complaint: "También puedes presentar una reclamación ante la autoridad francesa de protección de datos, la CNIL.",
      cnilLink: "Contactar con la CNIL",
    },
  },
}

export function getLegalCopy(locale: Locale) {
  return copies[locale]
}
