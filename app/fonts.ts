import localFont from "next/font/local"

export const outfit = localFont({
  src: [
    { path: "../public/fonts/outfit/Outfit-Thin.ttf", weight: "100" },
    { path: "../public/fonts/outfit/Outfit-ExtraLight.ttf", weight: "200" },
    { path: "../public/fonts/outfit/Outfit-Light.ttf", weight: "300" },
    { path: "../public/fonts/outfit/Outfit-Regular.ttf", weight: "400" },
    { path: "../public/fonts/outfit/Outfit-Medium.ttf", weight: "500" },
    { path: "../public/fonts/outfit/Outfit-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/outfit/Outfit-Bold.ttf", weight: "700" },
    { path: "../public/fonts/outfit/Outfit-ExtraBold.ttf", weight: "800" },
    { path: "../public/fonts/outfit/Outfit-Black.ttf", weight: "900" },
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
    { path: "../public/fonts/caveat/Caveat-Medium.ttf", weight: "500" },
    { path: "../public/fonts/caveat/Caveat-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
})
