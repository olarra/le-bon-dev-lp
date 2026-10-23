import type { Locale } from "@/lib/i18n/config"
import type { EmailTitle } from "./types"

type EmailCopy = {
  studio: string
  webMobile: string
  role: string
  signoff: string
  tagline: string
  description: string
  next: string
  replyPrompt: string
  replyInstruction: string
  recapTitle: string
  recapSubtitle: string
  contactDetails: string
  notificationIntro: string
  notificationReply: string
  notificationFootnote: string
  language: string
  receivedAt: string
  source: string
  generalSource: string
  contact: {
    eyebrow: string; title: EmailTitle; preheader: string; intro: string
    nextResponse: string; footnote: string; notificationSubject: string
    notificationEyebrow: string; notificationTitle: EmailTitle; notificationRecap: string
  }
  estimate: {
    eyebrow: string; title: EmailTitle; preheader: string; intro: string
    nextResponse: string; footnote: string; notificationEyebrow: string
    notificationTitle: EmailTitle
  }
}

const copies: Record<Locale, EmailCopy> = {
  fr: {
    studio: "LE STUDIO", webMobile: "WEB · MOBILE",
    role: "Développeur · Fondateur de Le bon dev", signoff: "À bientôt,",
    tagline: "Votre vision. Notre savoir-faire.", description: "Studio de développement web et mobile.",
    next: "LA SUITE", replyPrompt: "Un détail à corriger ou à compléter ?",
    replyInstruction: "Répondez simplement à cet e-mail.",
    recapTitle: "Votre projet, en quelques lignes.", recapSubtitle: "Les informations transmises au studio.",
    contactDetails: "Vos coordonnées", notificationIntro: "Une nouvelle demande est arrivée depuis le site.",
    notificationReply: "Répondez directement à cet e-mail pour joindre votre contact.",
    notificationFootnote: "Notification du formulaire du site · Réservée au studio.",
    language: "Langue", receivedAt: "Demande reçue le", source: "Source", generalSource: "Générale",
    contact: {
      eyebrow: "Contact / Confirmation",
      title: { line: "Votre message", prefix: "est ", highlight: "bien arrivé." },
      preheader: "Votre message est bien arrivé. Le studio vous répond sous 24 h.",
      intro: "Merci de nous avoir présenté votre projet.\nVotre message est bien arrivé au studio.",
      nextResponse: "Une réponse du studio\nsous 24 heures.",
      footnote: "Cet e-mail fait suite à votre prise de contact sur lebondev.fr.",
      notificationSubject: "Prise de contact",
      notificationEyebrow: "Contact / Nouvelle demande",
      notificationTitle: { line: "Un nouveau projet", highlight: "à découvrir." },
      notificationRecap: "Le message de votre contact.",
    },
    estimate: {
      eyebrow: "Estimation / Confirmation",
      title: { line: "Votre demande", prefix: "est ", highlight: "bien reçue." },
      preheader: "Votre demande est reçue. Une première estimation sous 24 h ouvrées.",
      intro: "Votre demande est bien reçue. Voici une copie de vos réponses.",
      nextResponse: "Le studio vous répond sous 24 h ouvrées avec une première estimation, ou avec les questions qu’il lui manque.",
      footnote: "Cette confirmation fait suite à votre demande d’estimation sur lebondev.fr.\nElle reprend vos réponses et ne constitue pas un devis.",
      notificationEyebrow: "Estimation / Nouvelle demande",
      notificationTitle: { line: "Une demande", highlight: "à estimer." },
    },
  },
  en: {
    studio: "THE STUDIO", webMobile: "WEB · MOBILE",
    role: "Developer · Founder of Le bon dev", signoff: "Speak soon,",
    tagline: "Your vision. Our expertise.", description: "Web and mobile development studio.",
    next: "WHAT’S NEXT", replyPrompt: "Something to correct or add?",
    replyInstruction: "Simply reply to this email.",
    recapTitle: "Your project at a glance.", recapSubtitle: "The information sent to the studio.",
    contactDetails: "Your contact details", notificationIntro: "A new request has arrived through the website.",
    notificationReply: "Reply directly to this email to reach your contact.",
    notificationFootnote: "Website form notification · For the studio only.",
    language: "Language", receivedAt: "Request received on", source: "Source", generalSource: "General",
    contact: {
      eyebrow: "Contact / Confirmation",
      title: { line: "We’ve received", highlight: "your message." },
      preheader: "We’ve received your message. The studio will reply within 24 hours.",
      intro: "Thank you for telling us about your project.\nYour message has reached the studio.",
      nextResponse: "A reply from the studio\nwithin 24 hours.",
      footnote: "You received this email after contacting us on lebondev.fr.",
      notificationSubject: "New contact request",
      notificationEyebrow: "Contact / New request",
      notificationTitle: { line: "A new project", highlight: "to discover." },
      notificationRecap: "Your contact’s message.",
    },
    estimate: {
      eyebrow: "Estimate / Confirmation",
      title: { line: "We’ve received", highlight: "your request." },
      preheader: "We’ve received your request. An initial estimate within 24 working hours.",
      intro: "We’ve received your request. Here is a copy of your answers.",
      nextResponse: "The studio will reply within 24 working hours with an initial estimate, or any further questions.",
      footnote: "This email confirms your estimate request on lebondev.fr.\nIt contains your answers and is not a quote.",
      notificationEyebrow: "Estimate / New request",
      notificationTitle: { line: "A new request", highlight: "to estimate." },
    },
  },
  es: {
    studio: "EL ESTUDIO", webMobile: "WEB · MÓVIL",
    role: "Desarrollador · Fundador de Le bon dev", signoff: "Hasta pronto,",
    tagline: "Tu visión. Nuestra experiencia.", description: "Estudio de desarrollo web y móvil.",
    next: "LO QUE SIGUE", replyPrompt: "¿Algo que corregir o añadir?",
    replyInstruction: "Solo tienes que responder a este correo.",
    recapTitle: "Tu proyecto, en pocas palabras.", recapSubtitle: "La información enviada al estudio.",
    contactDetails: "Tus datos de contacto", notificationIntro: "Ha llegado una nueva solicitud desde el sitio web.",
    notificationReply: "Responde directamente a este correo para comunicarte con tu contacto.",
    notificationFootnote: "Notificación del formulario web · Solo para el estudio.",
    language: "Idioma", receivedAt: "Solicitud recibida el", source: "Origen", generalSource: "General",
    contact: {
      eyebrow: "Contacto / Confirmación",
      title: { line: "Hemos recibido", highlight: "tu mensaje." },
      preheader: "Hemos recibido tu mensaje. El estudio te responde en 24 horas.",
      intro: "Gracias por contarnos tu proyecto.\nTu mensaje ha llegado al estudio.",
      nextResponse: "Una respuesta del estudio\nen 24 horas.",
      footnote: "Recibes este correo tras ponerte en contacto con nosotros en lebondev.fr.",
      notificationSubject: "Nuevo contacto",
      notificationEyebrow: "Contacto / Nueva solicitud",
      notificationTitle: { line: "Un nuevo proyecto", highlight: "por descubrir." },
      notificationRecap: "El mensaje de tu contacto.",
    },
    estimate: {
      eyebrow: "Estimación / Confirmación",
      title: { line: "Hemos recibido", highlight: "tu solicitud." },
      preheader: "Solicitud recibida. Una primera estimación en 24 horas laborables.",
      intro: "Hemos recibido tu solicitud. Aquí tienes una copia de tus respuestas.",
      nextResponse: "El estudio te responde en 24 horas laborables con una primera estimación o las preguntas que falten.",
      footnote: "Este correo confirma tu solicitud de estimación en lebondev.fr.\nIncluye tus respuestas y no constituye un presupuesto.",
      notificationEyebrow: "Estimación / Nueva solicitud",
      notificationTitle: { line: "Una nueva solicitud", highlight: "por estimar." },
    },
  },
}

export function getEmailCopy(locale: Locale): EmailCopy { return copies[locale] }
