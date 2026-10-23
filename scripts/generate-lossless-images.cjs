/* Full-resolution WebP derivatives. Original PNGs remain the editing sources. */
const fs = require("node:fs/promises")
const path = require("node:path")
const sharp = require("sharp")

const root = path.resolve(__dirname, "..")
const groups = [
  {
    source: "public/images/guarantees-timeline/png",
    destination: "public/images/guarantees-timeline/webp",
    names: ["budget-envelope", "followup-calendar", "handover-keys"],
  },
  {
    source: "public/images/realisations/stickers",
    destination: "public/images/realisations/stickers",
    names: ["design", "development", "app-store", "google-play", "copywriting", "responsive", "seo", "interactions"],
  },
]

async function generate() {
  let originalBytes = 0
  let generatedBytes = 0
  for (const group of groups) {
    await fs.mkdir(path.join(root, group.destination), { recursive: true })
    for (const name of group.names) {
      const source = path.join(root, group.source, `${name}.png`)
      const destination = path.join(root, group.destination, `${name}.webp`)
      // No resizing, palette reduction or lossy quality setting.
      const result = await sharp(source).webp({ lossless: true, effort: 6 }).toFile(destination)
      originalBytes += (await fs.stat(source)).size
      generatedBytes += result.size
    }
  }
  console.log(`Lossless images: ${originalBytes} → ${generatedBytes} bytes`)
}

generate().catch(error => { console.error(error); process.exitCode = 1 })
