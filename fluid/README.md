# Interactive Fluid — source de référence vgpu

Source officielle téléchargée avec la commande demandée :

```bash
npx vgpu examples pull fluid --out ./fluid
```

Le CLI a fourni 13 fichiers (24 357 octets), conservés sans modification ici :

- Révision : `6fa27bb458ffc3f498727090f09dce3fe5faabb43689fd669d633a2a23dc36bb`
- Empreinte agrégée SHA-256 : `7c0e7f7a91d49673a1cf1ca1596ac83aad2c161a22eedb734eda8b9f09da0635`

`LICENSE` reprend la licence MIT de vgpu (Vercel). La provenance du téléchargement
ne constitue pas une vérification de l’intégration dans l’application.

La copie adaptée se trouve dans `components/sections/hero/fluid/` et son montage
React dans `HeroFluid.tsx`. Voir le [README du Hero](../components/sections/hero/README.md)
pour les changements de palette, de composition, d’interaction et de nettoyage.

Le solveur utilise seulement `vgpu`, déjà installé avec son chargeur WGSL.
Le `index.tsx` original est une démonstration autonome et n’est pas monté dans
l’application. Ce dossier de référence est exclu de la compilation TypeScript.
