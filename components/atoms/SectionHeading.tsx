import type { ComponentProps } from "react"
import { AnimatedHeading } from "./AnimatedHeading"

type Props = Omit<ComponentProps<typeof AnimatedHeading>, "as" | "effect" | "controls" | "staggerBy"> & {
  as?: "h2" | "h3"
}

/** Hero timing, with each rendered line starting its own letter sequence. */
export function SectionHeading(props: Props) {
  return <AnimatedHeading {...props} staggerBy="line" />
}
