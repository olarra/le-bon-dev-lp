"use client"

import { useLayoutEffect, type RefObject } from "react"
import gsap from "gsap"
import { MIAU_REVEAL as motion } from "./realisations.content"

/** Desktop-only reveal; mobile keeps its custom carousel and gesture effects. */
export function useMiauReveal(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 700px)")
    let dispose: (() => void) | undefined
    const update = () => {
      dispose?.()
      dispose = desktop.matches ? mountDesktopReveal(sectionRef.current) : undefined
    }
    update()
    desktop.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
      dispose?.()
    }
  }, [sectionRef])
}

function mountDesktopReveal(section: HTMLElement | null) {
  const project = section?.querySelector<HTMLElement>('[data-project="miau"]')
  const visual = project?.querySelector<HTMLElement>("[data-miau-visual]")
  const group = project?.querySelector<HTMLElement>("[data-phone-group]")
  const center = project?.querySelector<HTMLElement>('[data-phone="auth"]')
  const centerSlot = project?.querySelector<HTMLElement>('[data-phone-slot="auth"]')
  if (!project || !visual || !group || !center || !centerSlot) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  if (reduced.matches || typeof center.animate !== "function") return

  const sides = ["map", "orion"].map((id, index) => ({
    phone: project.querySelector<HTMLElement>(`[data-phone="${id}"]`)!,
    direction: index === 0 ? -1 : 1,
    delay: motion.sides.delays[index],
  }))
  // Restore the original scroll parallax on outer wrappers, independently of WAAPI.
  const devices = Array.from(group.querySelectorAll<HTMLElement>("[data-device-parallax]"))
  gsap.set(devices, { y: 0 })
  const parallax = devices.map(element => ({
    set: gsap.quickSetter(element, "y", "px"),
    factor: Number(element.dataset.deviceParallax),
  }))
  const total = motion.center.delay + motion.center.duration
  let alive = true
  let complete = false
  let assetsReady = false
  let visibleFraction = 0
  let startedAt: number | null = null
  let animations: Animation[] = []
  let measureFrame = 0
  let scrollFrame = 0
  let exitOrigin = 0
  let observer: IntersectionObserver | null = null
  let resize: ResizeObserver | null = null

  const now = () => typeof document.timeline.currentTime === "number"
    ? document.timeline.currentTime
    : performance.now()

  function cancelAnimations() {
    animations.forEach(animation => { animation.onfinish = null; animation.cancel() })
    animations = []
  }

  function finish() {
    if (!alive || complete) return
    complete = true
    exitOrigin = Math.min(0, visual!.getBoundingClientRect().top)
    cancelAnimationFrame(measureFrame)
    measureFrame = 0
    // CSS is already the final frame. Release all fill effects, including transform.
    cancelAnimations()
    scheduleParallax()
  }

  function updateParallax() {
    scrollFrame = 0
    if (!alive) return
    const bounds = visual!.getBoundingClientRect()
    // Also catch a scroll jump straight from above the viewport to below it:
    // both observer snapshots can otherwise have the same zero intersection.
    if (bounds.top >= window.innerHeight && !reduced.matches) { rearm(); return }
    if (!complete) return
    if (reduced.matches || window.innerWidth < 700) {
      parallax.forEach(({ set }) => set(0))
      return
    }
    const distance = Math.min(bounds.height, Math.max(0, exitOrigin - Math.min(0, bounds.top)))
    parallax.forEach(({ set, factor }) => set(-distance * factor))
  }

  function scheduleParallax() {
    if (alive && !scrollFrame) scrollFrame = requestAnimationFrame(updateParallax)
  }

  function animate(element: HTMLElement, keyframes: Keyframe[], timing: KeyframeAnimationOptions) {
    const animation = element.animate(keyframes, { ...timing, fill: "both" })
    animation.pause()
    animation.currentTime = 0
    animations.push(animation)
    return animation
  }

  function sweep(phone: HTMLElement, delay: number, duration: number) {
    const band = phone.querySelector<HTMLElement>("[data-phone-reflection]")!
    animate(band, [
      { opacity: 0, transform: "translateX(-140%)" },
      { offset: 0.45, opacity: 1 },
      { opacity: 0, transform: "translateX(230%)" },
    ], { delay, duration, easing: motion.reflection.easing })
  }

  function playAnimations() {
    animations.forEach(animation => {
      animation.play()
      animation.startTime = startedAt
    })
  }

  function build() {
    if (!alive || complete) return
    if (startedAt !== null && now() - startedAt >= total) { finish(); return }

    // Scale the prototype's offsets to the existing layout; never reposition it.
    const size = centerSlot!.getBoundingClientRect().width / 236
    const perspective = "perspective(1600px)"

    cancelAnimations()
    animate(center!, [{ opacity: 0 }, { opacity: 1 }], { ...motion.appear, delay: motion.center.delay })
    const master = animate(center!, [
      { transform: `${perspective} rotateY(-42deg) scale(${motion.startScale})` },
      { transform: `${perspective} rotateY(0deg) scale(1)` },
    ], motion.center)
    sweep(center!, motion.reflection.centerDelay, motion.reflection.centerDuration)

    sides.forEach(({ phone, direction, delay }) => {
      animate(phone, [{ opacity: 0 }, { opacity: 1 }], { ...motion.appear, delay })
      animate(phone, [
        { transform: `${perspective} translate3d(${direction * 140 * size}px, ${30 * size}px, ${-420 * size}px) rotateY(${-direction * 62}deg)` },
        { transform: `${perspective} translate3d(0px, 0px, 0px) rotateY(0deg)` },
      ], { delay, duration: motion.sides.duration, easing: motion.sides.easing })
      sweep(phone, delay + motion.reflection.sideDelay, motion.reflection.sideDuration)
    })
    master.onfinish = finish
    // Resizing changes the CSS geometry, never the running sequence's clock.
    if (startedAt !== null) playAnimations()
  }

  function startIfVisible() {
    if (!alive || complete || startedAt !== null || reduced.matches) return
    if (!assetsReady || visibleFraction < motion.visibility) return
    startedAt = now()
    playAnimations()
  }

  function rearm() {
    if (reduced.matches || (startedAt === null && !complete)) return
    complete = false
    startedAt = null
    visibleFraction = 0
    exitOrigin = 0
    parallax.forEach(({ set }) => set(0))
    build()
  }

  function observeEntrance() {
    observer?.disconnect()
    if (!alive) return
    visibleFraction = 0
    observer = new IntersectionObserver(entries => {
      if (!alive) return
      const entry = entries[entries.length - 1]
      visibleFraction = entry.intersectionRatio
      if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
        rearm()
      } else if (entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0)) {
        if (startedAt === null) finish()
      } else {
        startIfVisible()
      }
    }, { threshold: motion.visibility })
    observer.observe(visual!)
  }

  function scheduleMeasure() {
    scheduleParallax()
    if (!alive || complete || measureFrame) return
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0
      build()
      observeEntrance()
    })
  }

  function onPreferenceChange() {
    if (reduced.matches) finish()
    else observeEntrance()
    scheduleParallax()
  }

  build()
  observeEntrance()
  resize = new ResizeObserver(scheduleMeasure)
  resize.observe(group)
  window.addEventListener("resize", scheduleMeasure, { passive: true })
  window.addEventListener("scroll", scheduleParallax, { passive: true })
  window.addEventListener("pageshow", scheduleMeasure)
  project.addEventListener("focusin", finish)
  reduced.addEventListener("change", onPreferenceChange)

  // Let native lazy loading start the request; decode only after the image loads.
  // Calling decode while the lazy image is pending can reject before it arrives.
  const imageCleanups: (() => void)[] = []
  const readyImages = Array.from(group.querySelectorAll("img"), image => new Promise<void>(resolve => {
    const finishLoading = () => {
      image.removeEventListener("load", finishLoading)
      image.removeEventListener("error", finishLoading)
      void image.decode().catch(() => {}).then(resolve)
    }
    if (image.complete) finishLoading()
    else {
      image.addEventListener("load", finishLoading, { once: true })
      image.addEventListener("error", finishLoading, { once: true })
    }
    imageCleanups.push(() => {
      image.removeEventListener("load", finishLoading)
      image.removeEventListener("error", finishLoading)
      resolve()
    })
  }))
  void Promise.all(readyImages).then(() => {
    if (!alive) return
    assetsReady = true
    startIfVisible()
  })
  void document.fonts.ready.then(() => { if (alive) scheduleMeasure() })

  return () => {
    alive = false
    imageCleanups.forEach(cleanup => cleanup())
    observer?.disconnect()
    resize?.disconnect()
    cancelAnimationFrame(measureFrame)
    cancelAnimationFrame(scrollFrame)
    cancelAnimations()
    devices.forEach(element => element.style.removeProperty("transform"))
    window.removeEventListener("resize", scheduleMeasure)
    window.removeEventListener("scroll", scheduleParallax)
    window.removeEventListener("pageshow", scheduleMeasure)
    project.removeEventListener("focusin", finish)
    reduced.removeEventListener("change", onPreferenceChange)
  }
}
