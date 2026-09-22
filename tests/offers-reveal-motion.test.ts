import assert from "node:assert/strict"
import { test } from "node:test"

const motionURL = new URL("../components/sections/offers/offers-reveal-motion.ts", import.meta.url)
const { OFFERS_REVEAL, fitOfferPoseDistance, createOfferSheenGate } = await import(motionURL.href) as typeof import(
  "../components/sections/offers/offers-reveal-motion"
)

type Matrix = readonly number[]
type Point = readonly [number, number, number, number]

// Compose complete homogeneous matrices independently of the clearance helper.
// CSS applies the rightmost transform first: T · Rz · Rx · S, then perspective.
function multiply(left: Matrix, right: Matrix): Matrix {
  return Array.from({ length: 16 }, (_, index) => {
    const row = Math.floor(index / 4)
    const column = index % 4
    return [0, 1, 2, 3].reduce((sum, k) => sum + left[row * 4 + k] * right[k * 4 + column], 0)
  })
}

function transform(matrix: Matrix, point: Point) {
  return [0, 1, 2, 3].map(row => point.reduce((sum, value, column) => sum + matrix[row * 4 + column] * value, 0))
}

function projectedCorners(width: number, height: number, distance: number, lift: number) {
  const rx = OFFERS_REVEAL.rotationX * lift * Math.PI / 180
  const rz = OFFERS_REVEAL.rotationZ * lift * Math.PI / 180
  const scale = 1 + (OFFERS_REVEAL.scale - 1) * lift
  const translation = [
    1, 0, 0, 0,
    0, 1, 0, -distance * lift,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
  const rotationZ = [
    Math.cos(rz), -Math.sin(rz), 0, 0,
    Math.sin(rz), Math.cos(rz), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
  const rotationX = [
    1, 0, 0, 0,
    0, Math.cos(rx), -Math.sin(rx), 0,
    0, Math.sin(rx), Math.cos(rx), 0,
    0, 0, 0, 1,
  ]
  const scaling = [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
  const perspective = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -1 / OFFERS_REVEAL.perspective, 1,
  ]
  const transforms: Matrix[] = [perspective, translation, rotationZ, rotationX, scaling]
  const matrix = transforms.reduce(multiply)
  const originX = width / 2
  const originY = height * OFFERS_REVEAL.originY

  return [[0, 0], [width, 0], [0, height], [width, height]].map(([x, y]) => {
    const result = transform(matrix, [x - originX, y - originY, 0, 1])
    assert.ok(result[3] > 0, "Every corner stays in front of the perspective camera")
    return { x: originX + result[0] / result[3], y: originY + result[1] / result[3] }
  })
}

test("projected corners respect the heading clearance throughout short, tall and narrow card descents", () => {
  const scenarios = [
    { name: "short desktop", width: 540, height: 440, clearance: 64 },
    { name: "wide desktop", width: 680, height: 780, clearance: 100 },
    { name: "long approved copy", width: 540, height: 1540, clearance: 64 },
    { name: "narrow desktop", width: 300, height: 1900, clearance: 56 },
    { name: "tight heading margin", width: 640, height: 560, clearance: 24 },
    { name: "extra breathing room", width: 520, height: 1100, clearance: 180 },
  ]

  for (const { name, width, height, clearance } of scenarios) {
    const distance = fitOfferPoseDistance(width, height, clearance)
    // Deliberately denser than the production sampler; check intermediate poses
    // as well as endpoints so resize-related clipping cannot hide between them.
    for (let step = 0; step <= 1000; step++) {
      const lift = step / 1000
      for (const point of projectedCorners(width, height, distance, lift)) {
        assert.ok(point.y >= -clearance - 1e-7,
          `${name}: projected y=${point.y} crosses the ${clearance}px clearance at lift=${lift}`)
      }
    }
    for (const point of projectedCorners(width, height, distance, 0)) {
      assert.ok(point.y === 0 || point.y === height, `${name}: the landed pose is exactly untransformed`)
      assert.ok(point.x === 0 || point.x === width)
    }
  }
})

test("entry distance remains finite, nonnegative and bounded by the requested 100px after resize", () => {
  for (const width of [260, 320, 480, 560, 720]) {
    for (const height of [380, 720, 1200, 1900, 2600]) {
      let previous = -1
      for (const clearance of [0, 16, 40, 80, 140, 240]) {
        const distance = fitOfferPoseDistance(width, height, clearance)
        assert.ok(Number.isFinite(distance))
        assert.ok(distance >= 0 && distance <= OFFERS_REVEAL.distance)
        assert.ok(distance >= previous, "More heading clearance must never reduce the allowed descent")
        previous = distance
      }
    }
  }

  const beforeResize = fitOfferPoseDistance(540, 980, 64)
  fitOfferPoseDistance(300, 1800, 40)
  assert.equal(fitOfferPoseDistance(540, 980, 64), beforeResize, "Resizing back restores the same pose budget")
  assert.equal(fitOfferPoseDistance(540, 980, -20), fitOfferPoseDistance(540, 980, 0))
  assert.ok(OFFERS_REVEAL.settle > 0 && OFFERS_REVEAL.settle <= 2, "The landing tap stays within 2px")
})

test("the POC reflection waits until the card has settled and plays once", () => {
  const gate = createOfferSheenGate()
  const starts: number[] = []
  for (let step = 0; step <= 100; step++) {
    if (gate(step / 100)) starts.push(step / 100)
  }
  assert.deepEqual(starts, [1])
  assert.equal(gate(1), false)
})

test("fast scrolling and restored positions can skip intermediate poses without missing the single pass", () => {
  for (const positions of [[0, 1], [0.5, 1], [0.999], [1]]) {
    const gate = createOfferSheenGate()
    assert.equal(positions.filter(progress => gate(progress)).length, 1)
    assert.equal(gate(1), false)
  }
})

test("the POC gate ignores threshold jitter and rearms only near the beginning", () => {
  const gate = createOfferSheenGate()
  assert.equal(gate(0.999), true)
  for (const progress of [0.998, 0.999, 1, 0.7, 0.3, 0.15, 1, 1]) {
    assert.equal(gate(progress), false, `No second pass at progress=${progress}`)
  }
  assert.equal(gate(0.14), false)
  assert.equal(gate(1), true)
  assert.equal(gate(1), false)
})
