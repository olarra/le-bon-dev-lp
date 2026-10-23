/* Produce the committed social artwork. No server, browser or network required. */
const fs = require("node:fs/promises")
const path = require("node:path")
const { createElement: h } = require("react")
const { ImageResponse } = require("next/og")
const sharp = require("sharp")
const cards = require("../lib/seo/social-cards.json")

const root = path.resolve(__dirname, "..")
const palette = { forest: "#203e33", ink: "#14271e", lime: "#c8f53e", cream: "#f4f2ec", rule: "#3d5347" }
const box = (style, ...children) => h("div", { style: { display: "flex", ...style } }, ...children)
const at = (left, top, style = {}) => ({ position: "absolute", left, top, ...style })
const image = (src, width, height, style) => h("img", { src, width, height, style })
const dataUrl = (buffer, type = "image/png") => `data:${type};base64,${buffer.toString("base64")}`

function artwork(variant, copy, assets) {
  const estimate = variant === "estimation"
  const foreground = estimate ? palette.forest : palette.cream
  const rule = estimate ? "#ced4bf" : palette.rule
  const bandWidth = 400
  const bandLeft = cards.width - bandWidth
  const contentLeft = 72
  const contentWidth = bandLeft - contentLeft * 2
  const markWidth = 320
  const markHeight = Math.round(markWidth * 524 / 875)
  return box({
    width: cards.width, height: cards.height, position: "relative", overflow: "hidden",
    backgroundColor: estimate ? palette.cream : palette.ink,
    color: foreground, fontFamily: "Outfit", fontWeight: 400,
  },
    box(at(bandLeft, 0, { width: bandWidth, height: cards.height, backgroundColor: estimate ? palette.lime : palette.forest })),
    box(at(0, 0, { width: cards.width, height: 7, backgroundColor: palette.lime })),
    image(estimate ? assets.wordmarkDark : assets.wordmarkLight, 310, 50, at(72, 66)),
    box(at(bandLeft, 78, {
      width: bandWidth, height: 30, justifyContent: "center", alignItems: "center",
      fontSize: 20, fontWeight: 500, letterSpacing: 2,
    }), copy.label),
    box(at(contentLeft, 151, { width: contentWidth, height: 1, backgroundColor: rule })),
    image(estimate ? assets.markForest : assets.markLime, markWidth, markHeight,
      at(bandLeft + (bandWidth - markWidth) / 2, (cards.height - markHeight) / 2)),
    box(at(contentLeft, 219, { flexDirection: "column", width: contentWidth, fontFamily: "Morna", fontWeight: 700, fontSize: 82, lineHeight: 1.08, letterSpacing: -2.2 }),
      box({ whiteSpace: "nowrap" }, copy.lines[0]),
      box({ whiteSpace: "nowrap", color: estimate ? palette.forest : palette.lime }, copy.lines[1]),
    ),
    box(at(contentLeft, 504, { width: contentWidth, height: 1, backgroundColor: rule })),
    box(at(contentLeft, 530, { width: contentWidth, height: 42, alignItems: "center", fontSize: estimate ? 24 : 27, fontWeight: 400 }), copy.caption),
    box(at(bandLeft, 530, { width: bandWidth, height: 42, gap: 14, alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 500 }),
      cards.domain,
      h("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: estimate ? palette.forest : palette.lime, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" },
        h("path", { d: "M5 19 19 5M5 5h14v14" }),
      ),
    ),
  )
}

const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

function gallery(items, fonts) {
  const languages = { fr: "Français", en: "English", es: "Español" }
  const labels = { studio: "Le studio", estimation: "Estimation" }
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Le bon dev — Cartes de partage</title>
<style>
@font-face{font-family:Outfit;src:url('${dataUrl(fonts.outfit, "font/ttf")}') format('truetype')}@font-face{font-family:Morna;src:url('${dataUrl(fonts.morna, "font/woff")}') format('woff');font-weight:700}
*{box-sizing:border-box}body{margin:0;background:#f4f2ec;color:#203e33;font-family:Outfit,system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:56px 32px 80px}h1{font:700 clamp(30px,4vw,48px)/1.1 Morna,sans-serif;margin:12px 0 20px}p{line-height:1.6}header{margin-bottom:40px;max-width:780px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}figure{margin:0}img{display:block;width:100%;height:auto;border-radius:8px}figcaption{display:flex;justify-content:space-between;gap:16px;padding:12px 0 0;font-size:16px}a{color:inherit;text-underline-offset:4px}small{font-size:13px;letter-spacing:.08em;text-transform:uppercase}@media(max-width:820px){main{padding:32px 18px}.grid{grid-template-columns:1fr}}
.preview-trigger{display:block;width:100%;padding:0;border:0;border-radius:8px;background:transparent;cursor:zoom-in}.preview-trigger:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid #203e33;outline-offset:5px}dialog{width:1248px;max-width:96vw;max-height:94vh;border:0;border-radius:16px;padding:24px;background:#f4f2ec;color:#203e33;overflow:auto}dialog::backdrop{background:#14271ee6}.preview-toolbar{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:20px}.preview-toolbar h2{margin:0;font:500 20px/1.4 Outfit,system-ui,sans-serif}.close-preview{padding:10px 18px;border:1px solid #203e33;border-radius:999px;background:transparent;color:inherit;font:inherit;cursor:pointer}
</style></head><body><main><header><small>Le bon dev · Open Graph</small><h1>Les cartes de partage du studio.</h1>
<p>Deux compositions, déclinées dans les trois langues du site. Les images ci-dessous sont les fichiers JPEG utilisés par les métadonnées, au format ${cards.width} × ${cards.height}.</p>
<p>Cliquez sur une carte pour l’agrandir, ou sur « Télécharger » pour enregistrer le JPEG. Les images et les polices sont intégrées à cette galerie : elle s’ouvre directement, sans serveur. Les recadrages propres aux réseaux sociaux seront visibles après le déploiement du site.</p></header><div class="grid">
${items.map(({ variant, locale, filename, alt, source }) => {
  const label = `${labels[variant]} · ${languages[locale]}`
  return `<figure><button type="button" class="preview-trigger" data-preview="${escape(label)}" aria-label="${escape(`Agrandir : ${label}`)}" aria-haspopup="dialog"><img src="${source}" width="${cards.width}" height="${cards.height}" alt="${escape(alt)}"></button><figcaption><span>${label}</span><a href="${source}" download="${filename}">Télécharger</a></figcaption></figure>`
}).join("\n")}
</div></main>
<dialog id="preview" aria-labelledby="preview-title"><div class="preview-toolbar"><h2 id="preview-title"></h2><button type="button" class="close-preview" autofocus>Fermer</button></div><img id="preview-image" width="${cards.width}" height="${cards.height}" alt=""></dialog>
<script>
const preview = document.getElementById('preview');
const previewImage = document.getElementById('preview-image');
document.querySelectorAll('[data-preview]').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    previewImage.src = image.src;
    previewImage.alt = image.alt;
    document.getElementById('preview-title').textContent = button.dataset.preview;
    preview.showModal();
  });
});
document.querySelector('.close-preview').addEventListener('click', () => preview.close());
preview.addEventListener('click', event => { if (event.target === preview) preview.close(); });
</script></body></html>`
}

async function generate() {
  const [wordmark, mark, morna, outfit, outfitMedium] = await Promise.all([
    fs.readFile(path.join(root, "public/logo-le-bon-dev.svg"), "utf8"),
    fs.readFile(path.join(root, "public/images/brand/le-bon-dev-mark-white.svg"), "utf8"),
    fs.readFile(path.join(root, "public/fonts/morna/morna-bold.woff")),
    fs.readFile(path.join(root, "public/fonts/outfit/Outfit-Regular.ttf")),
    fs.readFile(path.join(root, "public/fonts/outfit/Outfit-Medium.ttf")),
  ])
  const png = (svg, width) => sharp(Buffer.from(svg)).resize({ width }).png().toBuffer().then(dataUrl)
  const [wordmarkLight, wordmarkDark, markLime, markForest] = await Promise.all([
    png(wordmark.replaceAll("#1B4040", palette.cream).replaceAll("#0A0B0A", palette.cream), 620),
    png(wordmark.replaceAll("#1B4040", palette.forest).replaceAll("#0A0B0A", palette.forest), 620),
    png(mark.replaceAll('"white"', `"${palette.lime}"`), 856),
    png(mark.replaceAll('"white"', `"${palette.forest}"`), 856),
  ])
  const assets = { wordmarkLight, wordmarkDark, markLime, markForest }
  const output = path.join(root, "public/images/social")
  const design = path.join(root, "design/social-cards")
  await fs.mkdir(output, { recursive: true })
  await fs.mkdir(design, { recursive: true })
  const items = []
  for (const locale of ["fr", "en", "es"]) {
    for (const [variant, translations] of Object.entries(cards.variants)) {
      const copy = translations[locale]
      const response = new ImageResponse(artwork(variant, copy, assets), {
        width: cards.width, height: cards.height,
        fonts: [
          { name: "Morna", data: morna, weight: 700, style: "normal" },
          { name: "Outfit", data: outfit, weight: 400, style: "normal" },
          { name: "Outfit", data: outfitMedium, weight: 500, style: "normal" },
        ],
      })
      const filename = `le-bon-dev-${variant}-${locale}-${cards.version}.jpg`
      const jpeg = await sharp(Buffer.from(await response.arrayBuffer()))
        .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
        .toBuffer()
      await fs.writeFile(path.join(output, filename), jpeg)
      items.push({ variant, locale, filename, alt: copy.alt, source: dataUrl(jpeg, "image/jpeg") })
      console.log(`Créé : public/images/social/${filename}`)
    }
  }
  await fs.writeFile(path.join(design, "index.html"), gallery(items, { morna, outfit }))
  console.log("Galerie : design/social-cards/index.html")
}

generate().catch(error => { console.error(error); process.exitCode = 1 })
