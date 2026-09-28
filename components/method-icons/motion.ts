export type MethodKind = "cadrage" | "jalons" | "rocket" | "care"

/** Original layer movements from le-bon-dev-icons-animes, using native WAAPI. */
export function createMethodMotion(root: HTMLElement, kind: MethodKind) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  let animations: Animation[] = []
  let disposed = false
  let generation = 0

  const cancel = () => {
    generation++
    animations.forEach(animation => animation.cancel())
    animations = []
  }

  const animate = (part: string, transforms: string[], duration: number, delay = 0) => {
    const element = root.querySelector<HTMLElement>(`[data-part="${part}"]`)
    if (!element || typeof element.animate !== "function") return
    animations.push(element.animate(transforms.map(transform => ({ transform })), {
      duration, delay, easing: "cubic-bezier(.35,0,.25,1)", iterations: 1, fill: "none",
    }))
  }

  const play = async (): Promise<boolean> => {
    if (disposed || reduced.matches || document.hidden || !root.isConnected) return false
    cancel()
    const token = generation
    try {
      // An activation may precede image decoding; cancellation must invalidate
      // that pending play as well as any animations already on screen.
      const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"))
      await Promise.all(images.map(image => typeof image.decode === "function"
        ? image.decode().catch(() => undefined)
        : Promise.resolve()))
      if (disposed || token !== generation || reduced.matches || document.hidden || !root.isConnected
        || images.some(image => !image.naturalWidth)) return false

      if (kind === "cadrage") {
        animate("notebook", ["none", "scale(.985) rotate(-1deg)", "none"], 1100)
        animate("pencil", ["none", "translate(-13%,-19%) rotate(-7deg)",
          "translate(-10%,-20%) rotate(-5deg)", "translate(-13%,-17%) rotate(-7deg)",
          "translate(-9%,-18%) rotate(-5deg)", "none"], 1250)
      } else if (kind === "jalons") {
        const bounce = ["none", "translateY(-5%)", "translateY(.6%)", "none"]
        animate("step-low", bounce, 700)
        animate("step-mid", bounce, 700, 130)
        animate("summit", bounce, 700, 260)
        animate("flag", ["none", "rotate(-8deg)", "rotate(4deg)", "none"], 620, 460)
      } else if (kind === "rocket") {
        animate("flight", ["none", "translate(-1%,1%)", "translate(5%,-6%)",
          "translate(2%,-2.5%)", "none"], 1350)
        animate("flame", ["scale(1)", "scale(.7)", "scale(1.15)", "scale(.87)",
          "scale(1.07)", "scale(1)"], 1350)
      } else if (kind === "care") {
        animate("wrench", ["none", "rotate(-10deg)", "rotate(3deg)", "none"], 1050)
        animate("sprout", ["none", "scale(.97) rotate(-2deg)",
          "scale(1.035) rotate(2deg)", "none"], 1000, 200)
      }

      if (!animations.length) return false
      await Promise.all(animations.map(animation => animation.finished))
      return token === generation
    } catch {
      return false
    } finally {
      if (token === generation) animations = []
    }
  }

  const onPreference = () => { if (reduced.matches) cancel() }
  const onVisibility = () => { if (document.hidden) cancel() }
  reduced.addEventListener("change", onPreference)
  document.addEventListener("visibilitychange", onVisibility)

  return {
    play,
    cancel,
    destroy() {
      if (disposed) return
      disposed = true
      cancel()
      reduced.removeEventListener("change", onPreference)
      document.removeEventListener("visibilitychange", onVisibility)
    },
  }
}
