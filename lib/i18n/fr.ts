import type { Dictionary } from "./types"
import { CTA_HINT, CTA_LABEL, EYEBROW, HIGHLIGHT_AFTER, HIGHLIGHT_BEFORE, HIGHLIGHT_WORD, SECTION_TITLE_LINES, SUBTITLE_INTRO } from "@/components/sections/hero/hero.content"
import { GUARANTEE_STEPS } from "@/components/sections/guarantees-timeline/guarantees-timeline.content"
import { OFFERS } from "@/components/sections/offers/offers.content"
import { REALISATIONS, FRENCH_PIXEL_GALLERY } from "@/components/sections/showcase/realisations.content"
import { METHOD_STEPS, METHOD_EYEBROW, METHOD_TITLE } from "@/components/sections/method/method.content"
import { STUDIO_PARAGRAPHS, STUDIO_FACTS, STUDIO_PRINCIPLES } from "@/components/sections/studio/studio.content"
import { ESTIMATE_FACTORS } from "@/components/sections/contact/contact.content"
import { FOOTER_GROUPS } from "@/components/layout/footer.content"
import { NAVIGATION } from "@/components/layout/header/header.content"
import { FAQ } from "@/components/sections/faq/faq.content"

const fr: Dictionary = {
  seo: {
    title: "Le bon dev — Création de sites web et applications mobiles",
    description: "Sites internet, applications web et mobiles : un développeur senior à vos côtés, du cadrage à la mise en ligne. Budget défini, suivi régulier, code remis.",
  },
  skip: "Aller au contenu",
  header: {
    home: "Le bon dev — accueil", navigation: "Navigation principale", menu: "Menu", close: "Fermer", contact: "Parlons de votre projet", language: "Langue du site",
    links: NAVIGATION,
  },
  topbar: { availability: "Missions ponctuelles ou accompagnement continu", response: "Réponse sous 24h" },
  hero: { eyebrow: EYEBROW, titleLines: [...SECTION_TITLE_LINES], subtitle: SUBTITLE_INTRO, cta: CTA_LABEL, hint: CTA_HINT, highlightBefore: HIGHLIGHT_BEFORE, highlightWord: HIGHLIGHT_WORD, highlightAfter: HIGHLIGHT_AFTER },
  guarantees: {
    eyebrow: "Nos garanties", titleBefore: "Un ", titleHighlight: "cadre clair", titleAfter: ",", titleEnd: "du début à la fin.", subtitle: "Trois principes, valables pour chaque projet.",
    steps: GUARANTEE_STEPS.map(({ phase, title, description }) => ({ phase, title, description })),
  },
  offers: {
    eyebrow: "Les offres", title: "Votre projet prend forme.", audience: "Pour vous si", included: "Ce qui est compris", from: "À partir de",
    items: OFFERS,
  },
  showcase: {
    eyebrow: "Les réalisations", titleLines: ["Des idées", "devenues concrètes."], subtitle: "Deux projets, deux besoins. Découvrez ce qu’on a réalisé.", context: "Contexte", offer: "Offre", projects: REALISATIONS,
    services: { label: "Les prestations réalisées", design: "Conception & design", mobile: "Développement mobile", stores: "Publication sur les stores", copywriting: "Conception & rédaction", responsive: "Design responsive", seo: "Référencement naturel", interactions: "Animations & interactions" },
    phones: ["Miau : carte de Paris et chats à proximité, cadre sauge.", "Écran de connexion Miau, au premier plan dans un cadre vert forêt.", "Miau : fiche du chat Orion et contact du propriétaire, cadre lime."],
    carousel: { label: "Les écrans de Miau", previous: "Écran précédent", next: "Écran suivant", navigation: "Choisir un écran Miau", screens: ["À proximité", "Bienvenue", "Le profil d’Orion"] },
    artworks: FRENCH_PIXEL_GALLERY.artworks.map(artwork => artwork.alt), gallery: "Aperçu de la galerie French Pixel Studio", newTab: "nouvel onglet",
  },
  method: { eyebrow: METHOD_EYEBROW, title: METHOD_TITLE, steps: METHOD_STEPS.map(({ title, description }) => ({ title, description })) },
  studio: {
    eyebrow: "Le studio", titleLines: ["Le fond, la forme.", "La même attention."], paragraphs: STUDIO_PARAGRAPHS, cta: "Parlons de votre projet",
    factsLabel: "Le studio en quelques repères", facts: STUDIO_FACTS, principlesLabel: "Les convictions du studio", principles: STUDIO_PRINCIPLES.map(principle => principle.lines),
    scene: "Un espace de travail sous les toits, de la lumière du jour à la nuit, avec l’enseigne Le bon dev.", replay: "Rejouer le passage du jour à la nuit",
    ecosystem: {
      eyebrow: "Nos technologies", title: "Les bons outils pour votre projet.", list: "Les technologies et outils du studio", cta: "Parlons-en", ctaLabel: "Parlons-en : des technologies adaptées à votre projet",
      description: "Site web, application mobile ou outil métier : on choisit les technologies adaptées à vos besoins et à votre budget, pour construire un produit fiable et facile à faire évoluer.",
      pause: "Mettre en pause", resume: "Reprendre", pauseLabel: "Mettre en pause le défilement des technologies", resumeLabel: "Reprendre le défilement des technologies",
    },
  },
  estimate: {
    title: "Parlons de votre application.", description: "Quelques questions sur vos utilisateurs et ce qu’ils doivent pouvoir faire.", response: "Une première estimation sous 24h.", cta: "Estimer mon application",
    whatsapp: "Prendre contact sur WhatsApp", whatsappLabel: "Prendre contact sur WhatsApp (nouvel onglet)", eyebrow: "Une première estimation", criteriaTitle: "Ce qui peut faire varier l’estimation", factors: ESTIMATE_FACTORS,
  },
  faq: FAQ,
  contact: {
    eyebrow: "Le contact", titleBefore: "On en ", titleHighlight: "parle ?", description: "Un site à lancer, une application à créer ou un produit à faire évoluer ? Racontez-nous ce que vous avez en tête.", detailsLabel: "Les coordonnées du studio",
    email: "Par e-mail", whatsapp: "Sur WhatsApp", response: "Une réponse sous 24h", developer: "Un échange avec le développeur.",
    form: {
      receipt: {
        title: "Message bien reçu.", response: "Le studio vous répond sous 24 h.",
        beforeEmail: "Une confirmation a été envoyée à ", afterEmail: ". Vous pouvez y répondre pour compléter votre message.",
        withoutCopy: "Votre message est bien arrivé au studio, mais l’e-mail de confirmation n’a pas pu être envoyé. Vous n’avez pas besoin de renvoyer le formulaire.",
        restart: "Envoyer un autre message",
      },
      label: "Présentez-nous votre projet", name: "Nom et prénom", namePlaceholder: "Votre nom", email: "E-mail", emailPlaceholder: "vous@entreprise.fr", company: "Entreprise", companyPlaceholder: "Votre entreprise", phone: "Téléphone", phonePlaceholder: "+33 6 00 00 00 00", optional: "facultatif",
      project: "Votre projet", projectTypes: { website: "Site internet", application: "Application", evolution: "Évolution", unsure: "À définir" }, message: "Quelques mots sur votre projet", messagePlaceholder: "Votre idée, vos utilisateurs, ce que vous aimeriez créer ou améliorer…",
      hint: "* Champs obligatoires. Vos coordonnées servent uniquement à échanger sur votre projet.", submit: "Envoyer mon message", pending: "Envoi en cours…", success: "Votre message a bien été envoyé. Nous vous répondrons sous 24h.", error: "L’envoi n’a pas abouti. Réessayez ou écrivez-nous à hello@lebondev.fr.", unavailable: "L’envoi est momentanément indisponible. Écrivez-nous à hello@lebondev.fr.", invalid: "Vérifiez les champs du formulaire avant de réessayer.", nameRequired: "Indiquez votre nom.", messageRequired: "Décrivez votre projet en quelques mots.", honeypot: "Laissez ce champ vide",
    },
    confirmation: { subject: "Votre message est bien arrivé — Le bon dev", greeting: "Bonjour", body: "Merci de nous avoir présenté votre projet. Votre message est bien arrivé et nous vous répondrons sous 24h.", closing: "À bientôt,\nLe bon dev\nhello@lebondev.fr" },
  },
  footer: { tagline: ["Votre vision.", "Notre savoir-faire."], description: ["Studio de développement", "web et mobile."], groups: FOOTER_GROUPS, navigationSuffix: "pied de page", invitation: "Une idée à concrétiser ?", cta: "Parlons de votre projet", home: "Le bon dev — retour à l’accueil", top: "Retour en haut" },
}

export default fr
