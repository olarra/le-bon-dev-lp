import { STUDIO_PHOTO_MOTION as config } from "./studio.content"

/** A viewport-triggered wipe, then the kit's independent six-second crossfade. */
export function mountStudioScene(root: HTMLElement) {
  const reveal = root.querySelector<HTMLElement>("[data-studio-reveal]")
  const replay = root.querySelector<HTMLButtonElement>("[data-studio-replay]")
  const images = Array.from(root.querySelectorAll<HTMLImageElement>("[data-studio-light]"))
  if (!reveal || !replay || images.length !== 3) return
  const [, sunset, night] = images
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  const animations = new Set<Animation>()
  const paused = new Set<Animation>()
  let disposed = false
  let loading = false
  let dayReady = false
  let allReady = false
  let revealVisible = false
  let cycleVisible = false
  let sceneVisible = false
  let revealStarted = false
  let revealComplete = reduced.matches
  let cycleStarted = false
  let cycleRunning = false
  let cycleVersion = 0
  let visibilityObserver: IntersectionObserver | undefined

  if (!reduced.matches) reveal.style.clipPath = config.hiddenClip

  const cancel = () => {
    cycleVersion++
    cycleRunning = false
    animations.forEach(animation => animation.cancel())
    animations.clear()
    paused.clear()
  }
  const track = (animation: Animation) => {
    animations.add(animation)
    return animation
  }
  const release = (animation: Animation) => {
    animations.delete(animation)
    paused.delete(animation)
    animation.cancel()
  }
  const updateReplay = () => {
    replay.hidden = disposed || reduced.matches || !allReady || !revealComplete || typeof reveal.animate !== "function"
    replay.disabled = cycleRunning
    const label = cycleRunning ? "Passage du jour à la nuit en cours" : "Rejouer le passage du jour à la nuit"
    replay.setAttribute("aria-label", label)
    replay.title = label
  }
  const syncPlayback = () => {
    if (document.hidden || !sceneVisible) {
      animations.forEach(animation => {
        if (animation.playState === "running") { paused.add(animation); animation.pause() }
      })
    } else {
      paused.forEach(animation => animation.play())
      paused.clear()
    }
  }
  const finishTogether = async (group: Animation[]) => {
    const sharedStart = document.timeline.currentTime
    group.forEach(animation => { animation.startTime = sharedStart })
    syncPlayback()
    await Promise.all(group.map(animation => animation.finished))
  }

  const startCycle = (manual = false) => {
    if (disposed || reduced.matches || document.hidden || !allReady || !revealComplete
      || cycleRunning || (!manual && (!cycleVisible || cycleStarted))
      || typeof sunset.animate !== "function") return
    cycleStarted = true
    cycleRunning = true
    const version = ++cycleVersion
    updateReplay()
    void (async () => {
      // Replay returns softly to daylight; the entrance wipe is not repeated.
      if (manual && Number(getComputedStyle(night).opacity) > 0) {
        const reset = [sunset, night].map(image => track(image.animate([
          { opacity: getComputedStyle(image).opacity }, { opacity: 0 },
        ], { duration: config.resetDuration, easing: config.fadeEase, fill: "both" })))
        await finishTogether(reset)
        if (disposed || reduced.matches || version !== cycleVersion) return
        sunset.style.removeProperty("opacity")
        night.style.removeProperty("opacity")
        reset.forEach(release)
      }

      const fadeOptions = { duration: config.duration, fill: "both" as const }
      const fades = [
        track(sunset.animate([
          { opacity: 0, offset: 0, easing: config.fadeEase },
          { opacity: 1, offset: 0.5 },
          { opacity: 1, offset: 1 },
        ], fadeOptions)),
        track(night.animate([
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.5, easing: config.fadeEase },
          { opacity: 1, offset: 1 },
        ], fadeOptions)),
      ]
      await finishTogether(fades)
      if (disposed || reduced.matches || version !== cycleVersion) return
      sunset.style.opacity = "1"
      night.style.opacity = "1"
      fades.forEach(release)
      cycleRunning = false
      updateReplay()
    })().catch(() => { /* Preference changes and unmount cancel the complete cycle. */ })
  }

  const startReveal = () => {
    if (disposed || reduced.matches || document.hidden || !dayReady) return
    if (revealComplete) { startCycle(); return }
    if (!revealVisible || revealStarted) return
    revealStarted = true
    if (typeof reveal.animate !== "function") {
      reveal.style.removeProperty("clip-path")
      revealComplete = true
      return
    }
    const wipe = track(reveal.animate([
      { clipPath: config.hiddenClip },
      { clipPath: config.visibleClip },
    ], { duration: config.revealDuration, easing: config.revealEase, fill: "both" }))
    void wipe.finished.then(() => {
      if (disposed || reduced.matches) return
      reveal.style.removeProperty("clip-path")
      release(wipe)
      revealComplete = true
      updateReplay()
      startCycle()
    }).catch(() => { /* An interrupted wipe leaves no pending playback. */ })
  }

  const prepareImages = () => {
    if (loading || disposed) return
    loading = true
    const ready = images.map(image => {
      image.loading = "eager"
      return image.decode()
    })
    void ready[0].then(() => {
      if (disposed) return
      dayReady = true
      startReveal()
    }).catch(() => { if (!disposed) reveal.style.removeProperty("clip-path") })
    void Promise.all(ready).then(() => {
      if (disposed) return
      allReady = true
      updateReplay()
      startCycle()
    }).catch(() => { /* Keep the day if either secondary image fails. */ })
  }

  const preloadObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return
    prepareImages()
    preloadObserver.disconnect()
  }, { rootMargin: config.preloadMargin })
  preloadObserver.observe(root)

  const observeVisibility = () => {
    visibilityObserver?.disconnect()
    // A portrait taller than the viewport must still be able to reach its cue.
    const visibleFraction = Math.min(1, window.innerHeight / Math.max(1, root.offsetHeight))
    const revealThreshold = config.revealThreshold * visibleFraction
    const cycleThreshold = config.cycleThreshold * visibleFraction
    const pauseThreshold = config.pauseThreshold * visibleFraction
    visibilityObserver = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1]
      revealVisible = entry.isIntersecting && entry.intersectionRatio >= revealThreshold
      cycleVisible = entry.isIntersecting && entry.intersectionRatio >= cycleThreshold
      sceneVisible = entry.isIntersecting && entry.intersectionRatio >= pauseThreshold
      syncPlayback()
      startReveal()
      startCycle()
    }, { threshold: [0, pauseThreshold, revealThreshold, cycleThreshold] })
    visibilityObserver.observe(root)
  }
  const resize = new ResizeObserver(observeVisibility)
  resize.observe(root)
  observeVisibility()
  window.addEventListener("resize", observeVisibility)

  const onPreference = () => {
    if (reduced.matches) {
      cancel()
      revealComplete = true
      reveal.style.removeProperty("clip-path")
      sunset.style.removeProperty("opacity")
      night.style.removeProperty("opacity")
    } else {
      startReveal()
      startCycle()
    }
    updateReplay()
  }
  const onVisibility = () => {
    syncPlayback()
    startReveal()
    startCycle()
  }
  const onReplay = () => startCycle(true)
  reduced.addEventListener("change", onPreference)
  document.addEventListener("visibilitychange", onVisibility)
  replay.addEventListener("click", onReplay)
  updateReplay()

  return () => {
    disposed = true
    cancel()
    preloadObserver.disconnect()
    visibilityObserver?.disconnect()
    resize.disconnect()
    window.removeEventListener("resize", observeVisibility)
    reduced.removeEventListener("change", onPreference)
    document.removeEventListener("visibilitychange", onVisibility)
    replay.removeEventListener("click", onReplay)
    replay.hidden = true
    replay.disabled = true
    reveal.style.removeProperty("clip-path")
    sunset.style.removeProperty("opacity")
    night.style.removeProperty("opacity")
  }
}
