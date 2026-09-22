import assert from "node:assert/strict"
import { test } from "node:test"

const layoutURL = new URL("../components/sections/guarantees-timeline/mobile-stack-layout.ts", import.meta.url)
const { fitMobileStack, MOBILE_STACK_SPACING } = await import(layoutURL.href) as typeof import(
  "../components/sections/guarantees-timeline/mobile-stack-layout"
)

const naturalContent = { introHeight: 198, titleHeight: 78, cardHeight: 248, cardCount: 3 }

test("a tall viewport retains the chip, title and subtitle above readable artwork", () => {
  const result = fitMobileStack({ ...naturalContent, viewportHeight: 900 })
  assert.ok(result)
  assert.equal(result.mode, "full")
  assert.equal(result.headingHeight, naturalContent.introHeight)
  assert.ok(result.artSize >= 140)
})

test("a shorter viewport retains the complete title while allowing secondary heading text to scroll away", () => {
  const result = fitMobileStack({ ...naturalContent, viewportHeight: 720 })
  assert.ok(result)
  assert.equal(result.mode, "compact")
  assert.equal(result.headingHeight, naturalContent.titleHeight)
  assert.ok(result.artSize >= 140)
})

test("insufficient height and enlarged text fall back instead of shrinking or clipping copy", () => {
  assert.equal(fitMobileStack({ ...naturalContent, viewportHeight: 640 }), null)
  const enlarged = Object.freeze({ ...naturalContent, viewportHeight: 844, titleHeight: 156, cardHeight: 520 })
  assert.equal(fitMobileStack(enlarged), null)
  assert.equal(enlarged.titleHeight, 156)
  assert.equal(enlarged.cardHeight, 520)
})

test("every accepted composition fits its title, artwork, three card layers and safe spacing", () => {
  const spacing = MOBILE_STACK_SPACING
  let accepted = 0
  let fallback = 0
  for (const viewportHeight of [640, 667, 720, 740, 780, 812, 844, 896, 932]) {
    for (const introHeight of [160, 210, 260]) {
      for (const titleHeight of [70, 90, 110]) {
        for (const cardHeight of [180, 240, 300, 390, 520]) {
          const measurements = { viewportHeight, introHeight, titleHeight, cardHeight, cardCount: 3 }
          const result = fitMobileStack(measurements)
          const surroundingHeight = spacing.top + spacing.headingToArt + spacing.artToCard
            + 2 * spacing.layer + cardHeight + spacing.bottom
          if (!result) {
            fallback++
            assert.ok(surroundingHeight + titleHeight + 140 > viewportHeight,
              `ordinary flow should only be necessary when the readable compact composition cannot fit: ${JSON.stringify(measurements)}`)
            continue
          }
          accepted++
          assert.ok(result.artSize >= 140 && result.artSize <= 240)
          assert.equal(result.headingHeight, result.mode === "full" ? introHeight : titleHeight)
          assert.ok(surroundingHeight + result.headingHeight + result.artSize <= viewportHeight,
            `the complete foreground card must remain inside the viewport: ${JSON.stringify(measurements)}`)
        }
      }
    }
  }
  assert.ok(accepted > 0 && fallback > 0)
})

test("invalid measurements fail safely instead of producing unusable sticky offsets", () => {
  const valid = { ...naturalContent, viewportHeight: 900 }
  for (const key of Object.keys(valid) as Array<keyof typeof valid>) {
    for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      assert.equal(fitMobileStack({ ...valid, [key]: value }), null, `${key}=${value}`)
    }
  }
  assert.equal(fitMobileStack({ ...valid, cardCount: 1.5 }), null)
})
