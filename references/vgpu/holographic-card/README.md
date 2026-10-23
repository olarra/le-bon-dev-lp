# Référence vgpu — Holographic Card

Les cinq fichiers d’origine (`index.tsx`, `renderer.ts`, `scene.ts`,
`lettering.ts`, `shader.wgsl`) ont été téléchargés sans modification avec :

```bash
npx vgpu examples pull holographic-card --out ./references/vgpu/holographic-card
```

La référence a été récupérée à nouveau le 3 octobre 2026 avec `--force`,
après sauvegarde du dossier existant, car la CLI refuse une destination
déjà présente. Les cinq fichiers de l'exemple restent sans modification ;
ce README et la licence locale ont été conservés.

Source : <https://vgpu.sh/examples/holographic-card/source.md>

Provenance renvoyée par le téléchargement du 3 octobre 2026 :

- Révision : `6fa27bb458ffc3f498727090f09dce3fe5faabb43689fd669d633a2a23dc36bb`
- SHA-256 agrégé : `7855eb828f858f8efc7d20805665e0b6980796d925b6af3e08b48ff52f25c144`
- 5 fichiers, 57 833 octets.

L’adaptation utilisée par le site se trouve dans
`components/sections/guarantees-timeline/` :

- `card-foil.wgsl` reprend les fonctions de gravure, diffraction et nacre,
  l'écho spectral et le grain de la référence pour les cartes mobiles entières.
  La teinte du métal vient du CSS du site ; quelques éclats en étoile complètent
  le reflet. Le triangle et les libellés de démonstration sont remplacés par
  les illustrations et textes HTML traduits du site.
- `blob-foil.wgsl` conserve la surcouche transparente des blobs du desktop.
- `blob-foil-renderer.ts` remplace le suivi du curseur par un trajet de lumière
  lié au scroll. Le trajet des cartes se termine avant leur recouvrement et
  s'adapte à leur hauteur. Le contexte GPU est partagé et ne dessine que lors
  du scroll, de l'amortissement ou d'un changement de dimensions.

`vgpu` est déjà installé. Le montage asynchrone, la compilation des shaders,
le nettoyage des ressources, des observateurs et des écouteurs sont conservés,
avec un repli CSS en cas d'indisponibilité ou de perte du GPU.

Ce dossier de référence est exclu du périmètre TypeScript de l’application.
La source d’origine et les portions adaptées relèvent de la licence MIT jointe.
Le téléchargement ne constitue pas une validation de l’intégration dans ce site.
