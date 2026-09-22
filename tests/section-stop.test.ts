import assert from "node:assert/strict"
import { after, test } from "node:test"
import type Lenis from "lenis"
import type { VirtualScrollData } from "lenis"

const controllerURL = new URL("../components/atoms/section-stop-controller.ts", import.meta.url)
const { attachSectionStop } = await import(controllerURL.href) as typeof import(
  "../components/atoms/section-stop-controller"
)

class TestWindow extends EventTarget {
  scrollY = 900
  time = 0
  performance = { now: () => this.time }
  getComputedStyle(node: TestElement) { return node.style }
}

class TestElement {
  isConnected = true
  scrollHeight = 0
  clientHeight = 0
  scrollTop = 0
  attributes = new Set<string>()
  style = { overflowY: "visible", overscrollBehaviorY: "auto" }
  ownerDocument: { defaultView: TestWindow }
  top: number
  constructor(win: TestWindow, top = 0) {
    this.ownerDocument = { defaultView: win }
    this.top = top
  }
  hasAttribute(name: string) { return this.attributes.has(name) }
  getBoundingClientRect() { return { top: this.top - this.ownerDocument.defaultView.scrollY } }
}

const originalHTMLElement = Object.getOwnPropertyDescriptor(globalThis, "HTMLElement")
Object.defineProperty(globalThis, "HTMLElement", { configurable: true, value: TestElement })
after(() => {
  if (originalHTMLElement) Object.defineProperty(globalThis, "HTMLElement", originalHTMLElement)
  else Reflect.deleteProperty(globalThis, "HTMLElement")
})

function setup(boundaries = [1000], previousFilter?: (data: VirtualScrollData) => boolean) {
  const win = new TestWindow()
  const root = new TestElement(win)
  const targets = boundaries.map((top) => new TestElement(win, top))
  const jumps: number[] = []
  const lenis = {
    options: { smoothWheel: true, allowNestedScroll: true, virtualScroll: previousFilter },
    rootElement: root,
    targetScroll: 900,
    actualScroll: 900,
    limit: 3000,
    prefersReducedMotion: false,
    isStopped: false,
    isLocked: false,
    isScrolling: false as boolean | "smooth",
    scrollTo(top: number, options: { immediate?: boolean }) {
      assert.equal(options.immediate, true)
      jumps.push(top)
      lenis.targetScroll = lenis.actualScroll = win.scrollY = top
      lenis.isScrolling = false
    },
  }
  const mount = () => attachSectionStop(lenis as unknown as Lenis, targets as unknown as HTMLElement[])
  const dispose = mount()
  function wheel(deltaY: number, time: number, options: {
    type?: string; deltaX?: number; ctrlKey?: boolean; shiftKey?: boolean; path?: TestElement[]
  } = {}) {
    win.time = time
    const event = new Event(options.type ?? "wheel", { cancelable: true })
    Object.assign(event, {
      ctrlKey: options.ctrlKey ?? false,
      shiftKey: options.shiftKey ?? false,
      composedPath: () => options.path ?? [root],
    })
    const data = { event, deltaX: options.deltaX ?? 0, deltaY } as VirtualScrollData
    const accepted = lenis.options.virtualScroll?.(data) !== false
    // Lenis consumes the (possibly limited) delta after its filter returns.
    if (accepted) {
      lenis.targetScroll += data.deltaY
      lenis.isScrolling = "smooth"
    }
    return { accepted, data, event }
  }
  return { win, root, targets, lenis, jumps, wheel, mount, dispose }
}

test("the crossing wheel targets the nearest entrance and absorbs the same gesture's momentum", () => {
  const rig = setup([1800, 1000])
  assert.equal(rig.wheel(1400, 0).data.deltaY, 100)
  assert.equal(rig.lenis.targetScroll, 1000)
  assert.deepEqual(rig.jumps, [], "arrival must use Lenis smoothing, not an immediate browser jump")
  const tail = rig.wheel(700, 30)
  assert.equal(tail.accepted, false)
  assert.equal(tail.event.defaultPrevented, true, "returning false alone would still permit native wheel scroll")
  assert.equal(rig.lenis.targetScroll, 1000)
  rig.dispose()
})

test("a fresh gesture resumes immediately, including before the smooth arrival completes", () => {
  for (const [time, delta] of [[180, 30], [30, 200]]) {
    const rig = setup()
    rig.wheel(110, 0)
    const next = rig.wheel(delta, time)
    assert.equal(next.accepted, true)
    assert.equal(next.data.deltaY, delta)
    assert.equal(rig.lenis.targetScroll, 1000 + delta)
    rig.dispose()
  }
})

test("gesture detection uses the original delta and the hold has a hard time limit", () => {
  const rig = setup()
  rig.lenis.targetScroll = 995
  assert.equal(rig.wheel(80, 0).data.deltaY, 5)
  assert.equal(rig.wheel(35, 25).accepted, false)
  for (let time = 100; time < 1200; time += 100) assert.equal(rig.wheel(20, time).accepted, false)
  assert.equal(rig.wheel(20, 1200).accepted, true)
  rig.dispose()
})

test("upward, horizontal, touch and zoom input interrupt the held arrival without being blocked", () => {
  for (const input of [
    { delta: -50 }, { delta: 50, deltaX: 100 }, { delta: 50, type: "touchmove" },
    { delta: 50, ctrlKey: true }, { delta: 50, shiftKey: true },
  ]) {
    const rig = setup()
    rig.wheel(200, 0)
    rig.lenis.actualScroll = rig.win.scrollY = 940
    const next = rig.wheel(input.delta, 20, input)
    assert.equal(next.accepted, true)
    assert.equal(next.event.defaultPrevented, false)
    assert.equal(next.data.deltaY, input.delta)
    assert.deepEqual(rig.jumps, [940])
    rig.dispose()
  }
})

test("keyboard and scrollbar input cancel only the pending arrival, never a global scroll lock", () => {
  for (const type of ["keydown", "pointerdown", "touchstart"]) {
    const rig = setup()
    rig.wheel(200, 0)
    rig.lenis.actualScroll = rig.win.scrollY = 950
    rig.win.dispatchEvent(new Event(type))
    assert.deepEqual(rig.jumps, [950])
    assert.equal(rig.lenis.isStopped, false)
    assert.equal(rig.lenis.isLocked, false)
    rig.dispose()
  }
})

test("nested scrollers, prevention attributes and reduced motion keep their original deltas", () => {
  for (const kind of ["nested", "contained", "prevented", "reduced"] as const) {
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
    if (kind === "prevented") nested.attributes.add("data-lenis-prevent-wheel")
    if (kind === "reduced") rig.lenis.prefersReducedMotion = true
    const result = rig.wheel(200, 0, { path: [nested, rig.root] })
    assert.equal(result.accepted, true)
    assert.equal(result.data.deltaY, 200)
    assert.equal(result.event.defaultPrevented, false)
    rig.dispose()
  }
})

test("filters compose and cleanup/remount restores the previous owner without stale holds", () => {
  let calls = 0
  const previousFilter = () => { calls++; return true }
  const rig = setup([1000], previousFilter)
  rig.wheel(200, 0)
  assert.equal(calls, 1)
  rig.dispose()
  assert.equal(rig.lenis.options.virtualScroll, previousFilter)
  rig.lenis.isScrolling = "smooth"
  rig.jumps.length = 0
  rig.win.dispatchEvent(new Event("keydown"))
  assert.deepEqual(rig.jumps, [])
  rig.lenis.targetScroll = 900
  const disposeAgain = rig.mount()
  assert.equal(rig.wheel(200, 30).data.deltaY, 100)
  const laterFilter = () => true
  rig.lenis.options.virtualScroll = laterFilter
  disposeAgain()
  assert.equal(rig.lenis.options.virtualScroll, laterFilter)

  const vetoed = setup([1000], () => false)
  const result = vetoed.wheel(200, 0)
  assert.equal(result.accepted, false)
  assert.equal(result.data.deltaY, 200)
  vetoed.dispose()
})

test("no stop is added when starting below the entrance, or when a target is unavailable", () => {
  for (const kind of ["below", "detached", "unreachable", "missing"] as const) {
    const rig = setup(kind === "missing" ? [] : [1000])
    if (kind === "below") rig.lenis.targetScroll = 1100
    if (kind === "detached") rig.targets[0].isConnected = false
    if (kind === "unreachable") rig.lenis.limit = 950
    const result = rig.wheel(200, 0)
    assert.equal(result.accepted, true)
    assert.equal(result.data.deltaY, 200)
    rig.dispose()
  }
})

test("fractional browser rounding cannot rearm an entrance already reached", () => {
  const rig = setup([1000.4])
  rig.wheel(200, 0)
  rig.lenis.targetScroll = rig.lenis.actualScroll = rig.win.scrollY = 1000
  const next = rig.wheel(40, 180)
  assert.equal(next.accepted, true)
  assert.equal(next.data.deltaY, 40)
  rig.dispose()
})

test("a disposed filter retained by another wrapper cannot intercept subsequent input", () => {
  const rig = setup()
  const retained = rig.lenis.options.virtualScroll!
  rig.lenis.options.virtualScroll = (data) => retained(data)
  rig.dispose()
  assert.equal(rig.wheel(200, 0).data.deltaY, 200)
  assert.equal(rig.wheel(100, 20).accepted, true)
  assert.deepEqual(rig.jumps, [])
})

test("native input and cleanup leave another caller's scroll animation running", () => {
  for (const interrupt of ["key", "wheel", "cleanup"] as const) {
    const rig = setup()
    rig.wheel(200, 0)
    // Simulate another caller taking ownership after this gesture was capped.
    rig.lenis.targetScroll = 1500
    if (interrupt === "key") rig.win.dispatchEvent(new Event("keydown"))
    if (interrupt === "wheel") assert.equal(rig.wheel(100, 20).accepted, true)
    if (interrupt === "cleanup") rig.dispose()
    assert.deepEqual(rig.jumps, [])
    rig.dispose()
  }
})
