import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Cormorant } from "next/font/google"
import "./globals.css"
import "./custom.css"

const inter = Inter({ subsets: ["latin"] })

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kinsol Films - Making Meaningful Media",
  description: "Film production company creating impactful documentaries and narrative films.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${cormorant.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
