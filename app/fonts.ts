import localFont from "next/font/local"

export const outfit = localFont({
  src: [
    { path: "../public/fonts/outfit/Outfit-Thin.woff2", weight: "100" },
    { path: "../public/fonts/outfit/Outfit-ExtraLight.woff2", weight: "200" },
    { path: "../public/fonts/outfit/Outfit-Light.woff2", weight: "300" },
    { path: "../public/fonts/outfit/Outfit-Regular.woff2", weight: "400" },
    { path: "../public/fonts/outfit/Outfit-Medium.woff2", weight: "500" },
    { path: "../public/fonts/outfit/Outfit-SemiBold.woff2", weight: "600" },
    { path: "../public/fonts/outfit/Outfit-Bold.woff2", weight: "700" },
    { path: "../public/fonts/outfit/Outfit-ExtraBold.woff2", weight: "800" },
    { path: "../public/fonts/outfit/Outfit-Black.woff2", weight: "900" },
  ],
  variable: "--font-outfit",
  display: "swap",
  preload: false,
})

export const morna = localFont({
  src: "../public/fonts/morna/morna-bold.woff2",
  weight: "700",
  variable: "--font-morna",
  display: "swap",
})

export const caveat = localFont({
  src: [
    { path: "../public/fonts/caveat/Caveat-Medium.woff2", weight: "500" },
    { path: "../public/fonts/caveat/Caveat-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
})
