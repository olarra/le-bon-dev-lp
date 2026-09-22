// Names and decorative marks from Conicorn's Intergration Marquee
// (Framer project 55736c5f645fdf8b), kept together for future content updates.
export const STUDIO_INTEGRATIONS = [
  { id: "hubspot", name: "HubSpot" },
  { id: "salesforce", name: "Salesforce" },
  { id: "zoho", name: "Zoho" },
  { id: "mailchimp", name: "Mailchimp" },
  { id: "activecampaign", name: "ActiveCampaign" },
  { id: "zapier", name: "Zapier" },
  { id: "openai", name: "OpenAI" },
  { id: "cloud-ai", name: "Cloud AI" },
  { id: "make", name: "Make" },
  { id: "custom-api", name: "API sur mesure" },
] as const

// The original widget alternates left / right / left at 100 / 90 / 110px/s.
export const INTEGRATION_ROWS = [
  { offset: 1, direction: "left", speed: 100 },
  { offset: 4, direction: "right", speed: 90 },
  { offset: 8, direction: "left", speed: 110 },
] as const
