"use client"

import { useEffect, useRef } from "react"
import styles from "./hero.module.css"

export function HeroFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.closest("section")
    if (!canvas || !hero || !navigator.gpu) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const contrast = window.matchMedia("(forced-colors: active)")
    let disposeRenderer: (() => void) | undefined
    let revision = 0

    const sync = () => {
      const current = ++revision
      disposeRenderer?.()
      disposeRenderer = undefined
      if (reduced.matches || contrast.matches) return

      void import("./fluid/renderer").then(({ createRenderer }) => {
        if (current !== revision) return
        const renderer = createRenderer({ canvas, inputTarget: hero })
        disposeRenderer = renderer.dispose
        return renderer.ready
      }).catch((error: unknown) => {
        if (current === revision) console.warn("Hero fluid unavailable:", error)
      })
    }

    sync()
    reduced.addEventListener("change", sync)
    contrast.addEventListener("change", sync)
    return () => {
      revision++
      reduced.removeEventListener("change", sync)
      contrast.removeEventListener("change", sync)
      disposeRenderer?.()
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.fluidCanvas} aria-hidden="true" />
}
