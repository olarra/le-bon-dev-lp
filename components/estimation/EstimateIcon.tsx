import type { ReactNode } from "react"

const drawings = {
  project: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><path d="M17 14v6m-3-3h6" /></>,
  sector: <><path d="M4 21V7l8-4v18M12 10l8-3v14M2 21h20M7 8v1m0 3v1m0 3v1m9-6v1m0 3v1" /></>,
  features: <><path d="M5 4v16m7-16v16m7-16v16" /><rect x="2" y="7" width="6" height="4" rx="1" fill="var(--estimate-paper, #fff)" /><rect x="9" y="14" width="6" height="4" rx="1" fill="var(--estimate-paper, #fff)" /><rect x="16" y="6" width="6" height="4" rx="1" fill="var(--estimate-paper, #fff)" /></>,
  design: <><path d="m14 4 6 6-10 10H4v-6L14 4Zm-8 9 5 5M12 6l6 6" /></>,
  delay: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 5h3" /></>,
  details: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6M8 13h8m-8 4h5" /></>,
  contact: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  site: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  webapp: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18m-14 5h4m-4 3h7M7 6.5h.01m3 0h.01" /></>,
  mobile: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-4 14h4" /></>,
  shop: <><path d="M5 7h14l2 14H3L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
  redo: <><path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5" /></>,
  unknown: <><path d="M9 18h6m-5 3h4m-7-9a6 6 0 1 1 10 0c-1 1-2 2-2 4H9c0-2-1-3-2-4Z" /></>,
  zero: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10l-7-7Z" /><path d="M13 3v7h7m-8 2v6m-3-3h6" /></>,
  brand: <><circle cx="8" cy="8" r="4" /><rect x="12" y="12" width="8" height="8" rx="2" /><path d="m17 3 4 5h-8l4-5ZM3 17h5m-2.5-2.5v5" /></>,
  mockups: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18m-11 0v12m4-8h3m-3 4h3M6 6h.01" /></>,
  rebrand: <><path d="M20 11a8 8 0 0 0-14-5L3 9m0-5v5h5M4 14a8 8 0 0 0 13 5" /><path d="m17 12 1.5 3.5L22 17l-3.5 1.5L17 22l-1.5-3.5L12 17l3.5-1.5L17 12Z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  edit: <><path d="m14 4 6 6-10 10H4v-6L14 4Zm-2 2 6 6" /></>,
  save: <><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" /><path d="m8 12 3 3 5-6" /></>,
} satisfies Record<string, ReactNode>

export type EstimateIconName = keyof typeof drawings

export function EstimateIcon({ name, size = 24, className }: { name: EstimateIconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawings[name]}</svg>
}
