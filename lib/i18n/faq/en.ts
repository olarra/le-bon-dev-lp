import type { FaqCopy } from "@/components/sections/faq/faq.content"

export const FAQ_EN = {
  eyebrow: "Frequently asked questions",
  title: "The questions we get before getting started.",
  description: "And the ones you might hesitate to ask.",
  topicsLabel: "Frequently asked question topics",
  estimate: "Get a project estimate",
  contact: "Get in touch",
  closing: "Have a question that isn't here? Tell us about your project and we'll answer it in your estimate.",
  groups: [
    {
      id: "avant",
      title: "Before getting started",
      items: [
        {
          id: "prix",
          question: "How much does a website or application cost?",
          answer: "A five-page brochure website with your content starts at €2,500 excl. VAT, paid once. Booking, payments, a shop or multiple languages increase the price — and you'll know by how much before signing. An application is costed during scoping, milestone by milestone, and no amount is committed without your agreement. For a figure for your project: a few questions, a reply within 24 hours.",
          estimate: true,
        },
        {
          id: "delai",
          question: "How long should I allow?",
          answer: "A website takes a few weeks to deliver. Design is what mostly sets the pace: with an identity already in place, we move quickly; if your brand needs to be built first — logo, colours, typography, the way you talk to your customers — that's a project in its own right, before the website. After that, the sooner your content arrives, the faster the site progresses. An application is delivered in milestones: a usable first version, then regular releases for you to test. You never have to wait until the end to see the result.",
        },
        {
          id: "sur-mesure",
          question: "Why not build my website myself with Wix or WordPress?",
          answer: "You can, and for testing an idea or getting through the first few months, it's a good choice. The limitations come later. On Google: heavy pages and restricted settings that make it hard to rank in your area. With your tools — scheduling, payments, business software — you depend on the available plugins, each with its own subscription, and if the one you need doesn't exist, you're stuck. And the website stays with them: an ongoing subscription, and the day you need something specific — a customer portal, an online quotation tool — you start again from scratch. A custom website costs more upfront, and less once it needs to work for you.",
        },
        {
          id: "interlocuteur",
          question: "An independent developer or an agency: what difference does it make for me?",
          answer: "Here, the person who replies to you is the person who designs and codes. No project manager between you and the work, no brief lost along the way, decisions made directly. When a project needs other specialists — a designer, a second developer — they join the team without changing your point of contact.",
        },
      ],
    },
    {
      id: "pendant",
      title: "During the project",
      items: [
        {
          id: "preparation",
          question: "What should I prepare before we start?",
          answer: "Less than you think, and always in your name. For a website: what you already tell your customers, your photos and your logo if you have one; we write the copy with you during scoping. For an application: who will use it and what they need to do — a sketch or a couple of applications you like are enough to get started. Next come the accounts we set up together, in your name: the domain name, Apple and Google developer accounts for publishing on the stores, and access to the tools we need to connect. In every case, we tell you exactly what's missing, in the order we'll need it.",
        },
        {
          id: "changements",
          question: "What if I change my mind along the way?",
          answer: "That's what scoping is there to prevent: we write down together what the project needs to do before starting. An adjustment within that scope — a text, a screen, a rule that changes — is incorporated as we reach each milestone, at no extra cost. A request outside that scope is priced before development, and you decide: add it, save it for later, or swap it for something else. Nothing appears on the invoice without your approval.",
        },
        {
          id: "reprise",
          question: "Can you take over a website or application built by someone else?",
          answer: "Yes. We start by reviewing the code and access arrangements, then tell you frankly whether to finish, fix or start again. No credentials or files are requested before that conversation.",
        },
      ],
    },
    {
      id: "apres",
      title: "After launch",
      items: [
        {
          id: "propriete",
          question: "Who owns the code, domain name and access credentials?",
          answer: "You do, from day one. Code, hosting, domain name, store accounts and documentation are in your name and handed over at delivery. If you change providers tomorrow — or the studio is no longer available — another developer can take over without starting from scratch.",
        },
        {
          id: "autonomie",
          question: "Will I be able to update my website myself?",
          answer: "Yes, if you plan for it. For regular changes — opening hours, news, photos, prices — tell us during scoping: we build the site with an administration area, included in the quote. Otherwise, the website is delivered as it is, and we handle changes for you on request.",
        },
        {
          id: "maintenance",
          question: "Is there a subscription? What happens after delivery?",
          answer: "There is no subscription for the build. Hosting, the domain name and any booking or payment tools you use are costs you pay directly, in your name. Corrections are included for one month. After that, for a website: improvements quoted individually or covered by ongoing support. For an application: an optional monthly maintenance plan to keep it compatible with iOS and Android, available on the stores and evolving.",
        },
      ],
    },
  ],
} as const satisfies FaqCopy
