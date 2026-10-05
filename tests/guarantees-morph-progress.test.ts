import assert from "node:assert/strict"
import { test } from "node:test"

const progressURL = new URL("../components/sections/guarantees-timeline/morph-progress.ts", import.meta.url)
const { getMorphState, getStackState, MOBILE_STACK_DEPTH_SCALE } = await import(progressURL.href) as typeof import(
  "../components/sections/guarantees-timeline/morph-progress"
)

test("reading plateaus keep illustrations at exact, unwarped endpoints", () => {
  for (const progress of [0, 0.1, 0.18]) {
    assert.deepEqual(getMorphState(progress), { progress, pair: 0, active: 0, blend: 0 })
  }
  for (const progress of [0.38, 0.44, 0.49]) {
    assert.deepEqual(getMorphState(progress), { progress, pair: 0, active: 1, blend: 1 })
  }
  for (const progress of [0.5, 0.6, 0.64]) {
    assert.deepEqual(getMorphState(progress), { progress, pair: 1, active: 1, blend: 0 })
  }
  for (const progress of [0.85, 0.92, 1]) {
    assert.deepEqual(getMorphState(progress), { progress, pair: 1, active: 2, blend: 1 })
  }
})

test("both transitions preserve the POC's smooth blend and active-step thresholds", () => {
  for (const [progress, pair] of [[0.28, 0], [0.74, 1]]) {
    assert.ok(Math.abs(getMorphState(progress).blend - 0.5) < 1e-12)
    assert.equal(getMorphState(progress - 0.001).active, pair)
    assert.equal(getMorphState(progress + 0.001).active, pair + 1)
  }
})

test("reverse scrolling and rapid jumps have no dependence on previous progress", () => {
  const forward = [0, 0.24, 0.32, 0.5, 0.68, 0.78, 1].map((value) => getMorphState(value))
  const positions = [1, 0.24, 0.78, 0, 0.68, 0.32, 0.5]
  for (const position of positions) {
    assert.deepEqual(getMorphState(position), forward.find((state) => state.progress === position))
  }
})

test("reduced motion only selects complete shapes and illustrations", () => {
  for (let value = 0; value <= 100; value++) {
    const state = getMorphState(value / 100, true)
    assert.ok(state.blend === 0 || state.blend === 1)
    assert.equal(state.active, state.pair + state.blend)
  }
  assert.equal(getMorphState(-1).progress, 0)
  assert.equal(getMorphState(2).progress, 1)
  assert.equal(getMorphState(Number.NaN).progress, 0)
})

const pile = { entryDistance: 500, distance: 1000, cardCount: 3 }

test("mobile cards arrive one after another, each pinning after one entry distance of scroll", () => {
  assert.deepEqual(getStackState(0, pile), { progress: 0, arrivals: [1, 0, 0], scales: [1, 1, 1], active: 0 })
  assert.deepEqual(getStackState(0.5, pile), { progress: 0.5, arrivals: [1, 1, 0], scales: [1 - MOBILE_STACK_DEPTH_SCALE, 1, 1], active: 1 })
  assert.deepEqual(getStackState(1, pile), {
    progress: 1, arrivals: [1, 1, 1],
    scales: [1 - 2 * MOBILE_STACK_DEPTH_SCALE, 1 - MOBILE_STACK_DEPTH_SCALE, 1], active: 2,
  })
})

test("covered cards recede linearly from their top edge with the arrival above them", () => {
  const quarter = getStackState(0.25, pile)
  assert.deepEqual(quarter.arrivals, [1, 0.5, 0])
  assert.ok(Math.abs(quarter.scales[0] - (1 - MOBILE_STACK_DEPTH_SCALE * 0.5)) < 1e-12)
  assert.deepEqual(quarter.scales.slice(1), [1, 1])
  assert.equal(quarter.active, 1)
  assert.equal(getStackState(0.249, pile).active, 0)

  const later = getStackState(0.75, pile)
  assert.deepEqual(later.arrivals, [1, 1, 0.5])
  assert.ok(Math.abs(later.scales[0] - (1 - MOBILE_STACK_DEPTH_SCALE * 1.5)) < 1e-12)
  assert.ok(Math.abs(later.scales[1] - (1 - MOBILE_STACK_DEPTH_SCALE * 0.5)) < 1e-12)
  assert.equal(later.scales[2], 1)
  assert.equal(later.active, 2)
})

test("a tail keeps the completed pile pinned without changing the cards", () => {
  const withTail = { ...pile, distance: 1400 }
  const pinned = getStackState(1000 / 1400, withTail)
  assert.deepEqual(pinned.arrivals, [1, 1, 1])
  assert.deepEqual(getStackState(1, withTail).scales, pinned.scales)
})

test("mobile reverse scrolling and jumps restore identical cards", () => {
  const positions = [0, 0.1, 0.26, 0.36, 0.44, 0.5, 0.56, 0.7, 0.9, 1]
  const forward = new Map(positions.map((value) => [value, getStackState(value, pile)]))
  for (const progress of [...positions].reverse().concat([0.7, 0, 1, 0.26, 0.5])) {
    assert.deepEqual(getStackState(progress, pile), forward.get(progress))
  }
})

test("mobile progress and geometry are bounded", () => {
  for (const value of [-1, Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]) {
    assert.deepEqual(getStackState(value, pile), getStackState(0, pile))
  }
  assert.deepEqual(getStackState(2, pile), getStackState(1, pile))
  for (let step = 0; step <= 100; step++) {
    const state = getStackState(step / 100, pile)
    for (const arrival of state.arrivals) assert.ok(arrival >= 0 && arrival <= 1)
    for (const scale of state.scales) assert.ok(scale > 0 && scale <= 1)
    assert.ok(state.active >= 0 && state.active < pile.cardCount)
  }
  assert.deepEqual(getStackState(0.5, { ...pile, cardCount: 0 }), { progress: 0.5, arrivals: [], scales: [], active: 0 })
  assert.deepEqual(getStackState(0.5, { ...pile, cardCount: 1 }), { progress: 0.5, arrivals: [1], scales: [1], active: 0 })
})
