import assert from "node:assert/strict"
import { test } from "node:test"

const progressURL = new URL("../components/sections/guarantees-timeline/morph-progress.ts", import.meta.url)
const { getMorphState, getStackMorphState } = await import(progressURL.href) as typeof import(
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

test("mobile artwork settles as each new description reaches the stack", () => {
  assert.equal(getStackMorphState(0.25).blend, 0)
  assert.equal(getStackMorphState(0.375).blend, 0.5)
  assert.deepEqual(getStackMorphState(0.5), { progress: 0.5, pair: 1, active: 1, blend: 0 })
  assert.equal(getStackMorphState(0.75).blend, 0)
  assert.equal(getStackMorphState(0.875).blend, 0.5)
  assert.deepEqual(getStackMorphState(1), { progress: 1, pair: 1, active: 2, blend: 1 })
})

test("mobile transitions return to the same shape when scrolling backwards", () => {
  const positions = [0, 0.375, 0.5, 0.875, 1, 0.875, 0.5, 0.375, 0]
  const states = positions.map((value) => getStackMorphState(value))
  assert.deepEqual(states[1], states[7])
  assert.deepEqual(states[3], states[5])
})
