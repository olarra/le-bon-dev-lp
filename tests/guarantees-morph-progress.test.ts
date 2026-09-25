import assert from "node:assert/strict"
import { test } from "node:test"

const progressURL = new URL("../components/sections/guarantees-timeline/morph-progress.ts", import.meta.url)
const { getMorphState, getStackMorphState, MOBILE_STACK_TRANSITIONS } = await import(progressURL.href) as typeof import(
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

test("mobile cards and artwork are stationary on all three reading plateaus", () => {
  for (const progress of [0, 0.05, 0.10]) {
    assert.deepEqual(getStackMorphState(progress), { progress, pair: 0, active: 0, blend: 0, arrivals: [0, 0] })
  }
  for (const progress of [0.44, 0.47, 0.49, 0.5, 0.53, 0.56]) {
    const state = getStackMorphState(progress)
    assert.equal(state.active, 1)
    assert.equal(state.pair + state.blend, 1)
    assert.deepEqual(state.arrivals, [1, 0])
  }
  for (const progress of [0.90, 0.95, 1]) {
    assert.deepEqual(getStackMorphState(progress), { progress, pair: 1, active: 2, blend: 1, arrivals: [1, 1] })
  }
})

test("mobile morphing waits until a card approaches, then finishes with its arrival", () => {
  MOBILE_STACK_TRANSITIONS.forEach(({ start, end }, pair) => {
    const duration = end - start
    const early = getStackMorphState(start + duration * 0.4)
    assert.ok(early.arrivals[pair] > 0)
    assert.equal(early.blend, 0)
    assert.equal(early.active, pair)

    const halfway = getStackMorphState(start + duration * 0.775)
    assert.ok(Math.abs(halfway.blend - 0.5) < 1e-12)
    assert.ok(halfway.arrivals[pair] > halfway.blend)
    assert.equal(getStackMorphState(start + duration * 0.75).active, pair)
    assert.equal(getStackMorphState(start + duration * 0.8).active, pair + 1)

    const landed = getStackMorphState(end)
    assert.equal(landed.arrivals[pair], 1)
    assert.equal(landed.pair + landed.blend, pair + 1)
    assert.equal(landed.active, pair + 1)
  })
})

test("mobile reverse scrolling and jumps restore identical cards and artwork", () => {
  const positions = [0, 0.1, 0.26, 0.36, 0.44, 0.5, 0.56, 0.7, 0.9, 1]
  const forward = new Map(positions.map((value) => [value, getStackMorphState(value)]))
  for (const progress of [...positions].reverse().concat([0.7, 0, 1, 0.26, 0.5])) {
    assert.deepEqual(getStackMorphState(progress), forward.get(progress))
  }
})

test("mobile progress is bounded and reduced motion selects complete artwork", () => {
  for (const value of [-1, Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]) {
    assert.deepEqual(getStackMorphState(value), getStackMorphState(0))
  }
  assert.deepEqual(getStackMorphState(2), getStackMorphState(1))

  for (let step = 0; step <= 100; step++) {
    const state = getStackMorphState(step / 100, true)
    assert.ok(state.blend === 0 || state.blend === 1)
    assert.equal(state.active, state.pair + state.blend)
    for (const arrival of state.arrivals) assert.ok(arrival >= 0 && arrival <= 1)
  }
})
