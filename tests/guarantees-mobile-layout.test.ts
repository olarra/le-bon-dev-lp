import assert from "node:assert/strict"
import { test } from "node:test"

const layoutURL = new URL("../components/sections/guarantees-timeline/mobile-stack-layout.ts", import.meta.url)
const { fitMobileStack, MOBILE_STACK_SPACING } = await import(layoutURL.href) as typeof import(
  "../components/sections/guarantees-timeline/mobile-stack-layout"
)

const naturalContent = { viewportWidth: 390, contentHeight: 180, cardCount: 3 }

test("portrait phones retain a complete card with artwork inside and leave the heading in normal flow", () => {
  for (const [viewportWidth, viewportHeight] of [[320, 568], [375, 667], [390, 844], [430, 932]]) {
    const result = fitMobileStack({ ...naturalContent, viewportWidth, viewportHeight })
    assert.ok(result)
    assert.ok(result.artSize >= 110 && result.artSize <= 210)
    if (viewportHeight >= 667) assert.ok(result.artSize >= 195)
    assert.equal(result.padding, 20)
    assert.equal(result.artGap, 8)
    assert.equal(result.stickyTop, 96)
    assert.ok(result.stickyTop + result.sceneHeight + MOBILE_STACK_SPACING.bottom <= viewportHeight)
  }
})

test("artwork and spacing adapt before any natural text height is sacrificed", () => {
  const smallerArtwork = fitMobileStack({ ...naturalContent, viewportHeight: 600, contentHeight: 256 })
  assert.ok(smallerArtwork)
  assert.equal(smallerArtwork.artSize, 114)
  assert.equal(smallerArtwork.padding, 20)

  const compact = fitMobileStack({ ...naturalContent, viewportWidth: 320, viewportHeight: 568, contentHeight: 235 })
  assert.ok(compact)
  assert.equal(compact.artSize, 111)
  assert.equal(compact.padding, 16)
  assert.equal(compact.artGap, 8)
  assert.equal(compact.cardHeight - 2 * (compact.padding + 1) - compact.artSize - compact.artGap, 235)
})

test("the measured header offset is reserved, including when it differs from the default", () => {
  const result = fitMobileStack({ ...naturalContent, viewportHeight: 667, top: 128 })
  assert.ok(result)
  assert.equal(result.stickyTop, 128)
  assert.ok(result.stickyTop + result.sceneHeight + 16 <= 667)
  assert.ok(fitMobileStack({ ...naturalContent, viewportHeight: 667, top: 0 }))
})

test("landscape, square viewports and enlarged text that cannot fit use ordinary flow", () => {
  assert.equal(fitMobileStack({ ...naturalContent, viewportWidth: 844, viewportHeight: 390 }), null)
  assert.equal(fitMobileStack({ ...naturalContent, viewportWidth: 640, viewportHeight: 640 }), null)
  const enlarged = Object.freeze({ ...naturalContent, viewportHeight: 844, contentHeight: 600 })
  assert.equal(fitMobileStack(enlarged), null)
  assert.equal(enlarged.contentHeight, 600)
})

test("accepted layouts always contain all text, the stacked edges, shadows and safe bottom spacing", () => {
  let accepted = 0
  let fallback = 0
  for (const viewportHeight of [480, 568, 640, 667, 740, 812, 844, 932]) {
    for (const viewportWidth of [320, 375, 430]) {
      for (const contentHeight of [180, 212.7, 245, 300, 390, 520, 600]) {
        const result = fitMobileStack({ viewportHeight, viewportWidth, contentHeight, cardCount: 3 })
        if (!result) {
          fallback++
          // Even the smallest allowed illustration and gaps cannot fit.
          assert.ok(96 + 16 + 2 * 24 + 2 * 10 + 2 * 17 + 110 + 8 + Math.ceil(contentHeight) > viewportHeight)
          continue
        }
        accepted++
        assert.ok(result.artSize >= 110 && result.artSize <= 210)
        const contentRoom = result.cardHeight - 2 * (result.padding + 1) - result.artSize - result.artGap
        assert.ok(contentRoom >= contentHeight)
        assert.equal(result.sceneHeight - result.cardHeight, 2 * result.shadowSpace + 2 * result.layerGap)
        assert.ok(result.stickyTop + result.sceneHeight + 16 <= viewportHeight)
      }
    }
  }
  assert.ok(accepted > 0 && fallback > 0)
})

test("invalid measurements fail safely", () => {
  const valid = { ...naturalContent, viewportHeight: 844 }
  for (const key of Object.keys(valid) as Array<keyof typeof valid>) {
    for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      assert.equal(fitMobileStack({ ...valid, [key]: value }), null, `${key}=${value}`)
    }
  }
  for (const top of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(fitMobileStack({ ...valid, top }), null)
  }
  assert.equal(fitMobileStack({ ...valid, cardCount: 1.5 }), null)
})
