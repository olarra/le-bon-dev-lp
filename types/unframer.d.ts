import type { ComponentType } from "react"

// The unframer runtime exports these at runtime (the generated components in
// ./framer import them) but its .d.ts does not declare them.
declare module "unframer" {
  export const RichText: ComponentType<any>
  export const motion: any
}
