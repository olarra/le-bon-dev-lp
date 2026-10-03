"use client"

import { useEffect, type RefObject } from "react"

/** One renderer for the active ribbon; breakpoint changes replace its surfaces. */
export function useWaveHologram(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root || !navigator.gpu) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const contrast = window.matchMedia("(forced-colors: active)")
    let current: HTMLCanvasElement[] = []
    let renderer: { ready: Promise<void>; dispose(): void } | undefined
    let revision = 0

    const sync = () => {
      const canvases = reduced.matches || contrast.matches ? [] :
        Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-wave-foil]"))
          .filter(canvas => canvas.clientWidth > 0 && canvas.clientHeight > 0)
      if (canvases.length === current.length && canvases.every((canvas, index) => canvas === current[index])) return
      current = canvases
      const version = ++revision
      renderer?.dispose()
      renderer = undefined
      if (!canvases.length) return
      void import("./wave-foil-renderer").then(({ createWaveFoilRenderer }) => {
        if (version !== revision) return
        renderer = createWaveFoilRenderer(canvases)
        // The DOM cards are the fallback for unsupported adapters or a lost GPU.
        void renderer.ready.catch(() => {})
      }).catch(() => {})
    }

    const observer = new MutationObserver(sync)
    observer.observe(root, { childList: true, subtree: true })
    reduced.addEventListener("change", sync)
    contrast.addEventListener("change", sync)
    window.addEventListener("resize", sync)
    sync()
    return () => {
      ++revision
      observer.disconnect()
      reduced.removeEventListener("change", sync)
      contrast.removeEventListener("change", sync)
      window.removeEventListener("resize", sync)
      renderer?.dispose()
    }
  }, [ref])
}
