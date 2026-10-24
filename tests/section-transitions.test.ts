import assert from "node:assert/strict"
import { after, test } from "node:test"
import type Lenis from "lenis"
import type { ScrollToOptions, VirtualScrollData } from "lenis"

const controllerURL = new URL("../components/atoms/section-transition-controller.ts", import.meta.url)
const { attachSectionTransitions } = await import(controllerURL.href) as typeof import(
  "../components/atoms/section-transition-controller"
)

class TestWindow extends EventTarget {
  scrollY = 0
  innerHeight = 800
  time = 0
  performance = { now: () => this.time }
  getComputedStyle(node: TestElement) { return node.style }
}

class TestElement {
  isConnected = true
  scrollHeight = 0
  clientHeight = 0
  scrollTop = 0
  editable = false
  attributes = new Set<string>()
  style = { overflowY: "visible", overscrollBehaviorY: "auto", scrollPaddingTop: "132px", paddingTop: "160px" }
  ownerDocument: { defaultView: TestWindow }
  heading: TestElement | null = null
  top: number
  height: number
  constructor(win: TestWindow, top = 0, height = 800) {
    this.ownerDocument = { defaultView: win }
    this.top = top
    this.height = height
  }
  hasAttribute(name: string) { return this.attributes.has(name) }
  matches() { return this.editable }
  querySelector() { return this.heading }
  getBoundingClientRect() {
    const top = this.top - this.ownerDocument.defaultView.scrollY
    return { top, bottom: top + this.height, height: this.height }
  }
}

const originalHTMLElement = Object.getOwnPropertyDescriptor(globalThis, "HTMLElement")
Object.defineProperty(globalThis, "HTMLElement", { configurable: true, value: TestElement })
after(() => {
  if (originalHTMLElement) Object.defineProperty(globalThis, "HTMLElement", originalHTMLElement)
  else Reflect.deleteProperty(globalThis, "HTMLElement")
})

function setup(previousFilter?: (data: VirtualScrollData) => boolean, continuousSecondAndThird = false, guaranteesOnly = false) {
  const win = new TestWindow()
  const root = new TestElement(win)
  const targets = [new TestElement(win, 0), new TestElement(win, 800, 2000), new TestElement(win, 2800, 1600)]
  const calls: { top: number; options: ScrollToOptions }[] = []
  let animation: { from: number; to: number; options: ScrollToOptions } | null = null
  const lenis = {
    options: { smoothWheel: true, allowNestedScroll: true, virtualScroll: previousFilter },
    rootElement: root,
    targetScroll: 0,
    actualScroll: 0,
    limit: 4000,
    userData: {} as Record<string, unknown>,
    prefersReducedMotion: false,
    isStopped: false,
    isLocked: false,
    isScrolling: false as boolean | "smooth",
    scrollTo(top: number, options: ScrollToOptions) {
      calls.push({ top, options })
      if (options.immediate) { position(top); return }
      assert.notEqual(options.lock, true, "Section transitions must not lock the global scroller")
      animation = { from: lenis.actualScroll, to: top, options }
      lenis.userData = options.userData ?? {}
      lenis.isScrolling = "smooth"
    },
  }
  function position(top: number) {
    lenis.targetScroll = lenis.actualScroll = win.scrollY = top
    lenis.isScrolling = false
    lenis.userData = {}
    animation = null
  }
  function frame(progress: number) {
    assert.ok(animation)
    const { from, to, options } = animation
    lenis.targetScroll = lenis.actualScroll = win.scrollY = from + (to - from) * options.easing!(progress)
    if (progress === 1) {
      animation = null
      lenis.isScrolling = false
      options.onComplete?.(lenis as unknown as Lenis)
      lenis.userData = {}
    }
  }
  const mount = () => {
    const elements = targets as unknown as HTMLElement[]
    const ranges = elements.map(element => ({ start: element, end: element }))
    if (continuousSecondAndThird) ranges.splice(1, 2, { start: elements[1], end: elements[2] })
    if (guaranteesOnly) ranges.splice(2)
    return attachSectionTransitions(lenis as unknown as Lenis, ranges, { forwardOnly: guaranteesOnly })
  }
  const dispose = mount()
  function wheel(deltaY: number, time: number, options: {
    type?: string; deltaX?: number; ctrlKey?: boolean; shiftKey?: boolean; path?: TestElement[]; cancelable?: boolean
  } = {}) {
    win.time = time
    const event = new Event(options.type ?? "wheel", { cancelable: options.cancelable ?? true })
    Object.assign(event, {
      ctrlKey: options.ctrlKey ?? false,
      shiftKey: options.shiftKey ?? false,
      composedPath: () => options.path ?? [root],
    })
    const data = { event, deltaX: options.deltaX ?? 0, deltaY } as VirtualScrollData
    const accepted = lenis.options.virtualScroll?.(data) !== false
    if (accepted) {
      lenis.targetScroll = Math.max(0, Math.min(lenis.limit, lenis.targetScroll + data.deltaY))
      lenis.isScrolling = "smooth"
      lenis.userData = {}
      animation = null
    }
    return { accepted, data, event }
  }
  return { win, root, targets, lenis, calls, wheel, position, frame, mount, dispose }
}

test("one gesture at the end of a section starts the same complete one-second transition, regardless of force", () => {
  for (const delta of [20, 120, 6000]) {
    const rig = setup()
    const result = rig.wheel(delta, 0)
    assert.equal(result.accepted, false)
    assert.equal(result.event.defaultPrevented, true)
    assert.equal(rig.calls[0].top, 800)
    assert.equal(rig.calls[0].options.duration, 1)
    assert.equal(rig.calls[0].options.lerp, 0)
    assert.equal(rig.lenis.actualScroll, 0, "The transition cannot jump immediately to its endpoint")
    rig.frame(0.5)
    assert.ok(Math.abs(rig.lenis.actualScroll - 400) < 1)
    rig.frame(1)
    assert.equal(rig.lenis.actualScroll, 800)
    rig.dispose()
  }
})

test("fast repeated wheel events cannot accelerate the arrival or skip into another section", () => {
  const rig = setup()
  rig.wheel(120, 0)
  rig.frame(0.3)
  for (const time of [50, 120, 400, 750]) {
    const tail = rig.wheel(4000, time)
    assert.equal(tail.accepted, false)
    assert.equal(tail.event.defaultPrevented, true)
  }
  rig.frame(1)
  assert.equal(rig.wheel(2000, 800).accepted, false)
  assert.equal(rig.calls.length, 1)
  assert.equal(rig.wheel(60, 1200).accepted, true, "A fresh gesture reads freely inside the long section")
  assert.equal(rig.lenis.targetScroll, 860)
  rig.dispose()
})

test("the guarantees-only entrance still snaps from the hero and absorbs the gesture's momentum", () => {
  const rig = setup(undefined, false, true)
  assert.equal(rig.wheel(120, 0).accepted, false)
  assert.equal(rig.calls[0].top, 800)
  rig.frame(0.5)
  assert.equal(rig.wheel(2000, 100).accepted, false)
  rig.frame(1)
  assert.equal(rig.wheel(80, 1400).accepted, true)
  assert.equal(rig.lenis.targetScroll, 880)
  assert.equal(rig.calls.length, 1)
  rig.dispose()
})

test("all later boundaries and upward scrolling remain free with only the guarantees entrance enabled", () => {
  const rig = setup(undefined, false, true)
  for (const [position, delta] of [
    [800, 120], [1900, 700], [2600, 400], [3500, 6000],
    [3800, -600], [3000, -1000], [2100, -6000], [900, -500], [800, -160], [400, -6000],
  ]) {
    rig.position(position)
    const result = rig.wheel(delta, 0)
    assert.equal(result.accepted, true)
    assert.equal(result.event.defaultPrevented, false)
    assert.equal(result.data.deltaY, delta, "No reading stop or snap may shorten the gesture")
    assert.equal(rig.lenis.targetScroll, Math.max(0, Math.min(rig.lenis.limit, position + delta)))
  }
  assert.equal(rig.calls.length, 0)
  rig.dispose()
})

test("reversing the guarantees entrance cancels the snap and immediately restores free scrolling", () => {
  const rig = setup(undefined, false, true)
  rig.wheel(120, 0)
  rig.frame(0.5)
  const halfway = rig.lenis.actualScroll
  const result = rig.wheel(-80, 200)
  assert.equal(result.accepted, true)
  assert.equal(result.event.defaultPrevented, false)
  assert.equal(result.data.deltaY, -80)
  assert.equal(rig.lenis.targetScroll, halfway - 80)
  assert.equal(rig.calls.length, 2, "Only the entrance and its cancellation are issued")
  assert.equal(rig.calls[1].options.immediate, true)
  rig.dispose()
})

test("reversing pending upward inertia cannot pull the page backward to the hero's reading edge", () => {
  const rig = setup(undefined, false, true)
  rig.targets[0].height = 1000
  rig.targets[1].top = 1000
  rig.position(350)
  rig.lenis.targetScroll = 100
  rig.lenis.isScrolling = "smooth"

  rig.wheel(80, 0)
  assert.equal(rig.calls[0].top, 350, "Discard only the old gesture's pending distance")
  assert.equal(rig.calls[0].options.immediate, true)
  assert.equal(rig.calls[1].top, 1000, "The next transition must follow the new downward gesture")
  rig.frame(0.5)
  assert.ok(rig.lenis.actualScroll > 350)
  rig.dispose()
})

test("an upward wheel reversal starts from the visible position in later sections", () => {
  const rig = setup(undefined, false, true)
  rig.position(1400)
  rig.lenis.targetScroll = 1900
  rig.lenis.isScrolling = "smooth"

  const result = rig.wheel(-100, 0)
  assert.equal(result.accepted, true)
  assert.equal(rig.calls[0].top, 1400)
  assert.equal(rig.lenis.targetScroll, 1300)
  rig.dispose()
})

test("long sections scroll freely and a large fling preserves the final reading screen before the next transition", () => {
  const rig = setup()
  rig.position(1200)
  assert.equal(rig.wheel(100, 0).data.deltaY, 100)
  assert.equal(rig.calls.length, 0)
  assert.equal(rig.wheel(6000, 200).data.deltaY, 700)
  assert.equal(rig.lenis.targetScroll, 2000)
  assert.equal(rig.wheel(2000, 220).accepted, false)
  rig.position(2000)
  rig.wheel(100, 500)
  assert.equal(rig.calls.length, 1)
  assert.equal(rig.calls[0].top, 2800)
  rig.dispose()
})

test("guarantees and offers scroll continuously in both directions without stopping at their shared boundary", () => {
  const rig = setup(undefined, true)
  for (const [position, delta] of [[1900, 500], [2400, 600], [3000, -600], [2400, -600]]) {
    rig.position(position)
    const result = rig.wheel(delta, 0)
    assert.equal(result.accepted, true)
    assert.equal(result.event.defaultPrevented, false)
    assert.equal(result.data.deltaY, delta)
    assert.equal(rig.lenis.targetScroll, position + delta)
  }
  assert.equal(rig.calls.length, 0, "Neither a transition nor a reading stop is added between these sections")
  rig.dispose()
})

test("grouping guarantees and offers preserves transitions into guarantees and out of offers", () => {
  const rig = setup(undefined, true)
  rig.dispose()
  rig.targets.push(new TestElement(rig.win, 4400, 1200))
  rig.lenis.limit = 4800
  const dispose = rig.mount()
  rig.wheel(80, 0)
  assert.equal(rig.calls[0].top, 800)
  rig.frame(1)
  rig.position(3500)
  assert.equal(rig.wheel(500, 1500).data.deltaY, 100)
  rig.position(3600)
  rig.wheel(80, 2000)
  assert.equal(rig.calls[1].top, 4400)
  rig.frame(1)
  rig.wheel(-80, 3500)
  assert.equal(rig.calls[2].top, 3600)
  dispose()
})

test("upward navigation preserves the current section's first screen, then returns to the previous reading screen", () => {
  const rig = setup()
  rig.position(3300)
  assert.equal(rig.wheel(-100, 0).accepted, true)
  assert.equal(rig.wheel(-6000, 200).data.deltaY, -400)
  assert.equal(rig.lenis.targetScroll, 2800)
  assert.equal(rig.wheel(-1000, 220).accepted, false)
  rig.position(2800)
  rig.wheel(-80, 500)
  assert.equal(rig.calls[0].top, 2000, "Return to the previous section's end, not past all its contents")
  rig.frame(1)
  assert.equal(rig.wheel(-80, 1700).accepted, true)
  assert.equal(rig.lenis.targetScroll, 1920)
  rig.dispose()
})

test("loading or restoring between sections respects the requested direction", () => {
  for (const delta of [-40, 40]) {
    const rig = setup()
    rig.position(2400)
    assert.equal(rig.calls.length, 0, "Mounting does not reposition the page")
    rig.wheel(delta, 0)
    assert.equal(rig.calls[0].top, delta > 0 ? 2800 : 2000)
    rig.dispose()
  }
})

test("reversing during an arrival turns back from the actual position", () => {
  const rig = setup()
  rig.wheel(120, 0)
  rig.frame(0.5)
  const halfway = rig.lenis.actualScroll
  rig.wheel(-80, 200)
  assert.equal(rig.calls[1].top, halfway)
  assert.equal(rig.calls[1].options.immediate, true, "Only cancel existing movement at the current position")
  assert.equal(rig.calls[2].top, 0)
  assert.equal(rig.calls[2].options.duration, 1)
  rig.frame(1)
  assert.equal(rig.lenis.actualScroll, 0)
  rig.dispose()
})

test("keyboard, focus, scrollbar, resize and restoration interrupt arrivals without a global scroll lock", () => {
  for (const type of ["keydown", "pointerdown", "touchstart", "focusin", "resize", "pageshow", "hashchange"]) {
    const rig = setup()
    rig.wheel(120, 0)
    rig.frame(0.5)
    const halfway = rig.lenis.actualScroll
    rig.win.dispatchEvent(new Event(type))
    assert.equal(rig.calls.length, 2)
    assert.equal(rig.calls[1].top, halfway)
    assert.equal(rig.lenis.isStopped, false)
    assert.equal(rig.lenis.isLocked, false)
    rig.dispose()
  }
})

test("touch, horizontal gestures, zoom and unpreventable wheel input stay native", () => {
  for (const options of [
    { type: "touchmove" }, { deltaX: 300 }, { ctrlKey: true }, { shiftKey: true }, { cancelable: false },
  ]) {
    const rig = setup()
    const result = rig.wheel(100, 0, options)
    assert.equal(result.accepted, true)
    assert.equal(result.event.defaultPrevented, false)
    assert.equal(rig.calls.length, 0)
    rig.dispose()
  }
})

test("nested scroll areas, form controls, prevention attributes and reduced motion do not trigger a section change", () => {
  for (const kind of ["nested", "contained", "input", "prevented", "reduced", "stopped", "locked"] as const) {
    const rig = setup()
    const nested = new TestElement(rig.win)
    if (kind === "nested" || kind === "contained") {
      nested.scrollHeight = 600
      nested.clientHeight = 200
      nested.style.overflowY = "auto"
      if (kind === "contained") {
        nested.scrollTop = 400
        nested.style.overscrollBehaviorY = "contain"
      }
    }
    if (kind === "input") nested.editable = true
    if (kind === "prevented") nested.attributes.add("data-lenis-prevent-wheel")
    if (kind === "reduced") rig.lenis.prefersReducedMotion = true
    if (kind === "stopped") rig.lenis.isStopped = true
    if (kind === "locked") rig.lenis.isLocked = true
    const result = rig.wheel(200, 0, { path: [nested, rig.root] })
    assert.equal(result.accepted, true)
    assert.equal(result.data.deltaY, 200)
    assert.equal(result.event.defaultPrevented, false)
    assert.equal(rig.calls.length, 0)
    rig.dispose()
  }
})

test("entrances account for the header without adding existing section padding twice", () => {
  for (const inset of [80, 160]) {
    const rig = setup()
    rig.targets[1].heading = new TestElement(rig.win, 800 + inset, 40)
    rig.wheel(100, 0)
    const destination = rig.calls[0].top
    assert.equal(destination, inset === 80 ? 748 : 800)
    assert.ok(800 + inset - destination >= 132)
    rig.dispose()
  }
})

test("section positions and reading heights are measured again after a layout change", () => {
  const rig = setup()
  rig.targets[0].height = 900
  rig.targets[1].top = 900
  rig.targets[1].height = 2400
  rig.targets[2].top = 3300
  rig.position(100)
  rig.wheel(100, 0)
  assert.equal(rig.calls[0].top, 900)
  rig.frame(1)
  rig.wheel(9000, 1400)
  assert.equal(rig.lenis.targetScroll, 2500)
  rig.dispose()
})

test("the last section remains open to normal scrolling into the footer", () => {
  const rig = setup()
  rig.position(3600)
  assert.equal(rig.wheel(150, 0).accepted, true)
  assert.equal(rig.lenis.targetScroll, 3750)
  assert.equal(rig.calls.length, 0)
  rig.dispose()
})

test("cleanup restores a previous filter and leaves a different owner's animation alone", () => {
  const previousFilter = () => true
  const rig = setup(previousFilter)
  rig.wheel(120, 0)
  rig.lenis.userData = { anchor: true }
  rig.dispose()
  assert.equal(rig.calls.length, 1)
  assert.equal(rig.lenis.options.virtualScroll, previousFilter)
  rig.win.dispatchEvent(new Event("keydown"))
  assert.equal(rig.calls.length, 1)
  const disposeAgain = rig.mount()
  const laterFilter = () => true
  rig.lenis.options.virtualScroll = laterFilter
  disposeAgain()
  assert.equal(rig.lenis.options.virtualScroll, laterFilter)
})

test("a previous filter's veto and a retained disposed filter do not start an arrival", () => {
  const vetoed = setup(() => false)
  assert.equal(vetoed.wheel(120, 0).accepted, false)
  assert.equal(vetoed.calls.length, 0)
  vetoed.dispose()
  const rig = setup()
  const retained = rig.lenis.options.virtualScroll!
  rig.lenis.options.virtualScroll = data => retained(data)
  rig.dispose()
  assert.equal(rig.wheel(120, 0).accepted, true)
  assert.equal(rig.calls.length, 0)
})
