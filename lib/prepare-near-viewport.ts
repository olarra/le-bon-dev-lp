/** Prepare existing motion before its section arrives, without delaying its
 * own triggers or waiting for a module download. Keep HTML and layout in place. */
export function prepareNearViewport(element: HTMLElement, mount: () => void | (() => void)) {
  let mounted = false
  let disposed = false
  let cleanup: void | (() => void) = undefined
  let observer: IntersectionObserver | undefined

  function stopWatching() {
    observer?.disconnect()
    window.removeEventListener("scroll", check)
    window.removeEventListener("resize", check)
    window.removeEventListener("pageshow", check)
    window.removeEventListener("hashchange", check)
    element.removeEventListener("focusin", start, true)
  }

  function start() {
    if (mounted || disposed) return
    mounted = true
    stopWatching()
    cleanup = mount()
  }

  function check() {
    if (mounted || disposed) return
    // Include already-passed sections: a jump over a whole section must still
    // let its original controller settle the entrance at the restored position.
    if (element.getBoundingClientRect().top <= window.innerHeight * 3) start()
  }

  // Layout effects call this before paint, including a direct/restored visit.
  check()
  if (!mounted) {
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(check, {
        rootMargin: `${Math.ceil(window.innerHeight * 2)}px 0px`,
      })
      observer.observe(element)
    }
    // A synchronous scroll check also catches large jumps that cross the
    // entire observer margin between two frames. No extra rAF delays setup.
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check, { passive: true })
    window.addEventListener("pageshow", check)
    window.addEventListener("hashchange", check)
    // Mount before the controller's bubbling focus handler receives the event.
    element.addEventListener("focusin", start, true)
  }

  return () => {
    disposed = true
    stopWatching()
    if (typeof cleanup === "function") cleanup()
  }
}
