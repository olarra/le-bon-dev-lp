import type { ReactNode } from "react"
import { Inter, Playfair_Display } from "next/font/google"
import "@/framer/styles.css"
import "@/components/framer/framer-styles.css"
import "./globals.css"
import { Providers } from "./providers"

export const metadata = { title: "Agenius - Creative Agency Portfolio Website" }

// Only for the ported French Pixel Studio header (logo wordmark + TopBar);
// this project's own sections use the self-hosted Oswald in framer/styles.css.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
