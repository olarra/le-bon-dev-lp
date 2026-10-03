# Référence vgpu — Holographic Card

Les cinq fichiers d’origine (`index.tsx`, `renderer.ts`, `scene.ts`,
`lettering.ts`, `shader.wgsl`) ont été téléchargés sans modification avec :

```bash
npx vgpu examples pull holographic-card --out ./holographic-card
```

Source : <https://vgpu.sh/examples/holographic-card/source.md>

Provenance renvoyée par le téléchargement du 3 octobre 2026 :

- Révision : `6fa27bb458ffc3f498727090f09dce3fe5faabb43689fd669d633a2a23dc36bb`
- SHA-256 agrégé : `7855eb828f858f8efc7d20805665e0b6980796d925b6af3e08b48ff52f25c144`
- 5 fichiers, 57 833 octets.

L’adaptation utilisée par le site se trouve dans
`components/sections/hero/wave-foil-renderer.ts` et `wave-foil.wgsl`.
Elle conserve la lumière de proximité, la gravure et la diffraction, en les
appliquant aux logos animés existants avec un contexte GPU partagé.

Ce dossier de référence est exclu du périmètre TypeScript de l’application.
La source d’origine et les portions adaptées relèvent de la licence MIT jointe.
Le téléchargement ne constitue pas une validation de l’intégration dans ce site.
