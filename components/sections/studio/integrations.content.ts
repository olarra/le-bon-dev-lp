type StudioIntegration = {
  id: string
  name: string
  icon: `${string}.svg` | `${string}.png`
  contrast?: "dark"
}

// Original SVG/PNG logos from the supplied icons folder, with one variant
// per tool. Explicit filenames retain their original vector/raster formats.
export const STUDIO_INTEGRATIONS: readonly StudioIntegration[] = [
  { id: "react", name: "React", icon: "react.svg" },
  { id: "nextjs", name: "Next.js", icon: "nextjs.svg" },
  { id: "typescript", name: "TypeScript", icon: "typescript.svg" },
  { id: "javascript", name: "JavaScript", icon: "javascript.svg" },
  { id: "nodejs", name: "Node.js", icon: "nodejs.svg" },
  { id: "postgresql", name: "PostgreSQL", icon: "postgresql.png" },
  { id: "graphql", name: "GraphQL", icon: "graphql.svg" },
  { id: "redux", name: "Redux", icon: "redux.png" },
  { id: "google-cloud", name: "Google Cloud", icon: "google-cloud.png" },
  { id: "aws", name: "AWS", icon: "aws.svg" },
  { id: "firebase", name: "Firebase", icon: "firebase.svg" },
  { id: "vercel", name: "Vercel", icon: "vercel.svg" },
  { id: "docker", name: "Docker", icon: "docker.svg" },
  { id: "github", name: "GitHub", icon: "github.svg" },
  { id: "gitlab", name: "GitLab", icon: "gitlab.svg" },
  { id: "sentry", name: "Sentry", icon: "sentry.svg", contrast: "dark" },
  { id: "figma", name: "Figma", icon: "figma.svg" },
  { id: "linear", name: "Linear", icon: "linear.svg" },
  { id: "notion", name: "Notion", icon: "notion.svg" },
  { id: "slack", name: "Slack", icon: "slack.svg" },
  { id: "chatgpt", name: "ChatGPT", icon: "chatgpt.svg" },
  { id: "claude", name: "Claude", icon: "claude.svg" },
  { id: "apple", name: "Apple", icon: "apple.svg" },
  { id: "android", name: "Android", icon: "android.svg" },
]

// The original widget alternates left / right / left at 100 / 90 / 110px/s.
export const INTEGRATION_ROWS = [
  { offset: 0, direction: "left", speed: 100 },
  { offset: 8, direction: "right", speed: 90 },
  { offset: 16, direction: "left", speed: 110 },
] as const
