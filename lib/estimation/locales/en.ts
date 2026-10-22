import type { EstimationCopy } from "../copy"

const en: EstimationCopy = {
  title: "Get a project estimate",
  seo: { title: "Estimate the cost of your website or application", description: "Tell us about your website, web app or mobile app. Le bon dev will reply within 24 working hours with an initial personalised estimate." },
  page: {
    eyebrow: "An initial estimate", title: "Your project starts here.",
    description: "A few questions to estimate the cost of your website or application. The studio reads your answers and replies within 24 working hours.",
    pricing: "Websites from €2,500 excl. VAT: five pages, content supplied. Applications are estimated according to their scope.",
    explanationTitle: "What affects the estimate",
    explanation: [
      "The cost depends on the number of screens, user roles and features to build. Presenting a business, handling bookings and connecting a business tool require different work. Integrations, design and animations also matter, as does your starting point: an idea, mockups or an existing product to take over.",
      "This questionnaire helps the studio understand your business, the people who will use your product and your priorities. You can skip optional questions and change your answers before sending. Your preferred timeline and budget help us put together a realistic proposal.",
      "The studio will email you an initial estimate, or the questions needed to refine it. We then agree on the scope, milestones and quote with you before work begins.",
    ],
  },
  steps: [
    { label: "Project", title: "What type of project do you have?", help: "Choose one or more." },
    { label: "Industry", title: "Which industry do you work in?", help: "To suggest relevant features and examples." },
    { label: "Features", title: "What does your project need?", help: "Select anything that sounds useful, in any order: we’ll organise it during planning. Optional." },
    { label: "Design", title: "Where are you with design?", help: "Choose one." },
    { label: "Timing", title: "When would you like to launch?", help: "To plan a realistic response, rather than promise a date." },
    { label: "Details", title: "Tell us about your project.", help: "Everything is optional, but the more we know, the more accurate the estimate." },
    { label: "Contact", title: "Where should we send your estimate?", help: "The studio reads your answers and replies by email within 24 working hours. No newsletter." },
  ],
  types: {
    site: { title: "Website", description: "Present your business and receive enquiries" },
    webapp: { title: "Web application", description: "An online service or a tool for your team" },
    mobile: { title: "Mobile application", description: "iOS and Android" },
    shop: { title: "Online shop", description: "Catalogue, basket and payment" },
    redo: { title: "Redesign or takeover", description: "An existing website or application" },
    unknown: { title: "I’m not sure yet", description: "Describe your idea below" },
  },
  sectors: { health: "Health and wellbeing", property: "Property", finance: "Finance and insurance", trades: "Trades and construction", retail: "Retail and hospitality", education: "Training and education", sports: "Sport and leisure", business: "Business services", public: "Non-profits and public sector", media: "Media and communications", other: "Other" },
  audiences: { public: "The public, your customers", team: "Your internal team", both: "Both" },
  features: { booking: "Appointment booking", payment: "Online payment", accounts: "User accounts", admin: "Customer portal or administration", notifications: "Notifications", messaging: "Messaging between users", documents: "Documents: quotes, PDF invoices", catalog: "Catalogue or shop", languages: "Multiple languages", maps: "Maps and geolocation", analytics: "Dashboards", integrations: "Connections to your tools", ai: "AI features", other: "Other" },
  designs: {
    zero: { title: "I’m starting from scratch", description: "No logo or brand guidelines" },
    brand: { title: "I have a visual identity", description: "Logo, colours and typography" },
    mockups: { title: "I have mockups", description: "Figma, PDF or another format" },
    rebrand: { title: "I want a new visual identity", description: "Rethink the logo and brand alongside the project" },
  },
  delays: { month: "Within a month", "three-months": "Within 3 months", "six-months": "Within 6 months", unknown: "No date yet" },
  budgets: { "under-5": "Under €5k", "5-15": "€5k–15k", "15-40": "€15k–40k", "over-40": "Over €40k", unknown: "Not yet" },
  constraints: { sensitive: "Sensitive data: health, personal", accessibility: "Accessibility", france: "Hosting in France required" },
  fields: {
    typeOther: "Can’t find your situation? Tell us in one sentence (optional)", sectorNote: "Add details if needed (optional)",
    featureIA: "Which ones? For example, an assistant that answers customers or reads documents automatically", featureOther: "Other: describe in a few words",
    deadline: "A deadline to meet? Opening, trade show, season… (optional)", name: "Project name", desc: "Your project in a few lines: the context, what prompted it and what you expect", link: "Link to an existing website or application",
    firstName: "First name", email: "Email", company: "Company (optional)", phone: "Phone (optional)",
  },
  groups: { audience: "Who is it for?", features: "Features", budget: "A budget in mind? (optional)", constraints: "Any particular requirements? (optional)", recap: "Summary", contact: "Your contact details" },
  actions: { back: "Back", next: "Next", submit: "Receive my estimate", sending: "Sending…", retry: "Try again", edit: "Edit", close: "Close", restart: "Start again", home: "Back to the website" },
  status: { steps: "Steps", step: "Step", of: "of", saved: "Your answers are saved on this device until you send them.", notStored: "Your answers remain available while this form is open.", unspecified: "not provided", descriptionProvided: "Description provided", deadline: "deadline: ", language: "Language", noScript: "Enable JavaScript to complete the questionnaire, or tell us about your project by email." },
  errors: { project: "Choose at least one project type, or describe your idea.", firstName: "Enter your first name.", email: "Enter a valid email address to receive your estimate.", link: "Enter a valid website address, or leave this field empty.", invalid: "Check your answers before trying again.", send: "Your request could not be sent. Your answers have been kept: try again, or email us at" },
  success: { title: "We’ve received your request.", beforeEmail: "A copy is on its way to ", afterEmail: ". The studio will reply within 24 working hours with an initial estimate, or any further questions.", withoutCopy: "Your email copy could not be sent, but the studio has received your request. You’ll receive a reply within 24 working hours.", followup: "You can reply to that email to correct or add anything.", details: "View the information sent" },
  email: { subject: "Estimate request", confirmation: "We’ve received your estimate request — Le bon dev", greeting: "Hello", body: "We’ve received your request. The studio will reply within 24 working hours with an initial estimate, or any further questions. Here is a copy of your answers. You can reply to this email to correct or add anything.", closing: "Speak soon,\nLe bon dev\nhello@lebondev.fr", sentAt: "Request received on" },
}

export default en
