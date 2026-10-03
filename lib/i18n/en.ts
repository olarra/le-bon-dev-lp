import type { Dictionary } from "./types"

const en: Dictionary = {
  seo: {
    title: "Le bon dev — Website and mobile app development",
    description: "Websites, web and mobile apps, built with a senior developer by your side from planning to launch. A clear budget, regular updates and full source code handover.",
  },
  skip: "Skip to content",
  header: {
    home: "Le bon dev — home", navigation: "Main navigation", menu: "Menu", close: "Close", contact: "Let’s talk about your project", language: "Website language",
    links: [{ label: "Commitments", href: "#garanties-timeline" }, { label: "Services", href: "#offres" }, { label: "Work", href: "#realisations" }, { label: "Process", href: "#la-methode" }, { label: "Studio", href: "#le-studio" }],
  },
  topbar: { availability: "One-off projects or ongoing support", response: "A reply within 24h" },
  hero: {
    eyebrow: "Web and mobile development studio", titleLines: ["Your vision.", "Our know-how."], subtitle: "An idea to bring to life or an existing product to take further: we work with you from design to launch.", cta: "Get a project estimate", hint: "Tell us about your project in 3 minutes.",
    highlightBefore: "A ", highlightWord: "developer", highlightAfter: " as your point of contact, by your side at every step.",
  },
  guarantees: {
    eyebrow: "Our commitments", titleBefore: "A ", titleHighlight: "clear framework", titleAfter: ",", titleEnd: "from start to finish.", subtitle: "Three principles that apply to every project.",
    steps: [
      { phase: "Before we begin", title: "A budget you can rely on", description: "Every feature is costed before work starts. The price stays the same unless you agree to a change." },
      { phase: "Throughout the project", title: "Regular updates", description: "We agree on milestones together at the planning stage. Each one comes with a version to try and a progress report." },
      { phase: "At handover", title: "The keys are yours", description: "Source code, access credentials and documentation, handed over at delivery." },
    ],
  },
  offers: {
    eyebrow: "Our services", title: "Your project takes shape.", audience: "For you if", included: "What’s included", from: "From",
    items: [
      {
        id: "sites-vitrines", kind: "website", title: "Websites", promise: "A website that explains what you do and brings you enquiries.",
        audience: "you don’t have a website yet, yours no longer reflects your business, or it isn’t bringing in enquiries.",
        features: ["Bespoke design, built for mobile too", "Pages and copy defined with you", "Online bookings, payments, quotes and contact", "Local SEO and your Google Business Profile", "Domain, hosting, launch and guidance"],
        aftercare: { title: "After launch", description: "One month of fixes included, then further changes quoted individually or covered by ongoing support." },
        price: { amount: "€2,500 excl. VAT", detail: "five pages, content supplied" }, cta: "Get a website estimate", href: "#contact",
      },
      {
        id: "saas-mobile", kind: "applications", title: "Applications", detail: "Web or mobile", promise: "An application that does exactly what your business needs.",
        audience: "you’re launching an online service, equipping your team with better tools, or finishing or taking over an existing application.",
        features: ["User journeys and features tailored to your business, agreed during planning", "Technical choices explained clearly", "Development, testing and deployment", "Payments, calendars and notifications, as your project requires", "Documentation and source code handed over"],
        aftercare: { title: "After deployment", description: "Bugs fixed during the warranty period specified in your quote. Optional monthly maintenance after that: iOS and Android compatibility, app stores and improvements." },
        cta: "Get an app estimate", href: "#contact",
      },
    ],
  },
  showcase: {
    eyebrow: "Our work", titleLines: ["Ideas", "brought to life."], subtitle: "Two projects, two different needs. Explore what we’ve built.", context: "Context", offer: "Service",
    projects: {
      miau: { name: "Miau", hook: ["Travel with peace of mind.", "Stay connected."], description: "A service to find the right care for your cat.", context: "Cat sitting", offer: "App", icon: "applications", cta: "Discover Miau", href: "https://miau-app.com/" },
      studio: { name: "French Pixel Studio", hook: ["Art takes", "centre stage."], description: "An online gallery to explore artworks on desktop and mobile.", context: "Digital art gallery", offer: "Website", icon: "website", cta: "Visit the website", href: "https://www.frenchpixelstudio.fr/" },
    },
    phones: ["Miau: a map of Paris and nearby cats, in a sage frame.", "Miau sign-in screen, in the foreground with a forest-green frame.", "Miau: Orion’s profile and owner contact, in a lime frame."],
    artworks: ["Two cranes among blue lotus flowers", "A sleeping cat on patterned fabrics", "An orange moon above turquoise waves"], gallery: "French Pixel Studio gallery preview", newTab: "new tab",
  },
  method: {
    eyebrow: "Our process", title: "You always know where your project stands.",
    steps: [
      { title: "Planning", description: "A conversation, followed by a short document: scope, milestones and estimate." },
      { title: "Milestone deliveries", description: "At each milestone, a version to try and a progress report. We agree on adjustments as we go." },
      { title: "Launch", description: "Deployment, access and guidance. You have control over everything you need to manage." },
      { title: "What comes next", description: "Fixes, improvements and support: one-off or ongoing, depending on your needs." },
    ],
  },
  studio: {
    eyebrow: "The studio", titleLines: ["Substance and style.", "The same care."],
    paragraphs: [
      { text: "An unclear scope. Too few updates. Design that misses how people actually use the product." },
      { text: "Le bon dev was born from this observation: a project deserves as much care in its design as in its development.", emphasis: "Le bon dev" },
      { text: "A senior developer leads your project, fully involved from the first conversation to launch. When needed, specialist designers and developers contribute their expertise, with the same attention to detail and product quality." },
    ],
    cta: "Let’s talk about your project", factsLabel: "The studio at a glance", facts: [{ value: "10", label: "years of development" }, { value: "+10", label: "projects delivered" }, { value: "24 h", label: "to get back to you" }],
    principlesLabel: "What the studio stands for", principles: [["Understand first.", "Then build."], ["Code that", "stands the test."], ["Design that", "serves a purpose."]],
    scene: "An attic workspace with the Le bon dev sign, transitioning from daylight to night.", replay: "Replay the transition from day to night",
    ecosystem: {
      eyebrow: "Our technologies", title: "The right tools for your project.", list: "The studio’s technologies and tools", cta: "Let’s talk", ctaLabel: "Let’s talk about the right technologies for your project",
      description: "Website, mobile app or business tool: we choose technologies that fit your needs and budget, to build a reliable product that is easy to develop further.", pause: "Pause", resume: "Resume", pauseLabel: "Pause the technology carousel", resumeLabel: "Resume the technology carousel",
    },
  },
  estimate: {
    title: "Let’s talk about your application.", description: "A few questions about your users and what they need to be able to do.", response: "An initial estimate within 24h.", cta: "Get an app estimate", whatsapp: "Get in touch on WhatsApp", whatsappLabel: "Get in touch on WhatsApp (new tab)", eyebrow: "An initial estimate", criteriaTitle: "What influences the estimate",
    factors: [
      { title: "The number of screens and user roles", description: "One shared interface or separate spaces for customers, your team and administrators." },
      { title: "The number and complexity of features", description: "Displaying information, managing bookings or integrating AI call for different amounts of development work." },
      { title: "Design and animation", description: "Simple interfaces or more elaborate interactions: the level of detail affects the time needed." },
      { title: "The tools to connect", description: "Calendars, payments, business software… the work depends on the services to connect and the integrations available." },
      { title: "The project’s starting point", description: "Starting from scratch, having designs ready or taking over existing code changes the work involved." },
    ],
  },
  contact: {
    eyebrow: "Get in touch", titleBefore: "Let’s ", titleHighlight: "talk.", description: "A website to launch, an app to build or a product to improve? Tell us what you have in mind.", detailsLabel: "Studio contact details", email: "By email", whatsapp: "On WhatsApp", response: "A reply within 24h", developer: "A conversation with the developer.",
    form: {
      label: "Tell us about your project", name: "Full name", namePlaceholder: "Your name", email: "Email", emailPlaceholder: "you@company.com", company: "Company", companyPlaceholder: "Your company", phone: "Phone", phonePlaceholder: "+44 7700 900000", optional: "optional", project: "Your project",
      projectTypes: { website: "Website", application: "Application", evolution: "Improvements", unsure: "To be defined" }, message: "A few words about your project", messagePlaceholder: "Your idea, your users, what you’d like to build or improve…",
      hint: "* Required fields. Your contact details are only used to discuss your project.", submit: "Send my message", pending: "Sending…", success: "Your message has been sent. We’ll get back to you within 24h.", error: "Your message could not be sent. Try again or email hello@lebondev.fr.", unavailable: "Sending is temporarily unavailable. Please email hello@lebondev.fr.", invalid: "Please check the form fields and try again.", nameRequired: "Please enter your name.", messageRequired: "Please describe your project in a few words.", honeypot: "Leave this field empty",
    },
    confirmation: { subject: "We’ve received your message — Le bon dev", greeting: "Hello", body: "Thank you for telling us about your project. We’ve received your message and will get back to you within 24h.", closing: "Speak soon,\nLe bon dev\nhello@lebondev.fr" },
  },
  footer: {
    tagline: ["Your vision.", "Our know-how."], description: ["Web and mobile", "development studio."], navigationSuffix: "footer", invitation: "An idea to bring to life?", cta: "Let’s talk about your project", home: "Le bon dev — back to home", top: "Back to top",
    groups: [
      { label: "Services", links: [{ label: "Websites", href: "#sites-vitrines" }, { label: "Applications", href: "#saas-mobile" }, { label: "Our work", href: "#realisations" }] },
      { label: "The studio", links: [{ label: "Our commitments", href: "#garanties-timeline" }, { label: "Our process", href: "#la-methode" }, { label: "About us", href: "#le-studio" }] },
    ],
  },
}

export default en
