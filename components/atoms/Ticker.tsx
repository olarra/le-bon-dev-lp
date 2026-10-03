"use client"

import { useMemo, type ReactNode } from "react"
import { motion, useTransform, wrap, type MotionValue } from "motion/react"
import { useTickerMotion, type TickerMotionOptions } from "@/hooks/use-ticker-motion"
import styles from "./Ticker.module.css"

export type TickerChild = { key: string; content: ReactNode }

type Props = Omit<TickerMotionOptions, "totalItems"> & {
  children: TickerChild[]
  repeat?: number
  className?: string
}

export function Ticker({ children, repeat = 2, className, scale = 1, ...options }: Props) {
  const items = useMemo(() => {
    const out: { key: string; content: ReactNode; itemIndex: number }[] = []
    for (let r = 0; r < repeat; r++) {
      children.forEach((child, i) => {
        out.push({ key: `${child.key}-${r}`, content: child.content, itemIndex: r * children.length + i })
      })
    }
    return out
  }, [children, repeat])

  const { containerRef, resolvedPath, stepPercent, loopPercent, baseOffset, hoverHandlers } = useTickerMotion({ ...options, scale, totalItems: items.length })

  return (
    <div ref={containerRef} data-ticker className={[styles.viewport, className].filter(Boolean).join(" ")} {...hoverHandlers}>
      {resolvedPath && items.map((item) => (
        <TickerItem key={item.key} baseOffset={baseOffset} itemIndex={item.itemIndex} stepPercent={stepPercent} loopPercent={loopPercent} path={resolvedPath} scale={scale}>
          {item.content}
        </TickerItem>
      ))}
    </div>
  )
}

function TickerItem({
  baseOffset,
  itemIndex,
  stepPercent,
  loopPercent,
  path,
  scale,
  children,
}: {
  baseOffset: MotionValue<number>
  itemIndex: number
  stepPercent: number
  loopPercent: number
  path: string
  scale: number
  children: ReactNode
}) {
  const phase = itemIndex * stepPercent
  const loopPosition = useTransform(baseOffset, (v) => wrap(0, loopPercent, v + phase))
  const opacity = useTransform(loopPosition, (p) => (p > 100 ? 0 : p < 10 ? p / 10 : p > 90 ? (100 - p) / 10 : 1))
  const offsetDistance = useTransform(loopPosition, (p) => `${Math.min(p, 100)}%`)

  return (
    <motion.div
      className={styles.item}
      style={
        {
          offsetPath: `path('${path}')`,
          offsetDistance,
          opacity,
          scale,
          position: "absolute",
          top: 0,
          left: 0,
        }
      }
    >
      {children}
    </motion.div>
  )
}
