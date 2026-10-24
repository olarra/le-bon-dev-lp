import { ScrollTrigger } from "gsap/ScrollTrigger"

const pending = new Set<symbol>()
let frame: number | undefined

/** Font/layout changes shared by several components need one global measure. */
export function createScrollTriggerRefresh() {
  const owner = Symbol()
  let disposed = false

  const request = () => {
    if (disposed) return
    pending.add(owner)
    if (frame !== undefined) return
    frame = requestAnimationFrame(() => {
      frame = undefined
      if (!pending.size) return
      pending.clear()
      ScrollTrigger.refresh()
    })
  }

  const dispose = () => {
    disposed = true
    pending.delete(owner)
    if (!pending.size && frame !== undefined) {
      cancelAnimationFrame(frame)
      frame = undefined
    }
  }

  return { request, dispose }
}
