import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { Inter, Playfair_Display } from "next/font/google" // Import fonts from next/font/google

// Define Inter font with specified weights and variable
const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap", // Ensures fallback font is used while loading
  variable: "--font-inter", // CSS variable for Tailwind
})

// Define Playfair Display font with specified weights and variable
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap", // Ensures fallback font is used while loading
  variable: "--font-playfair", // CSS variable for Tailwind
})

export const metadata: Metadata = {
  title: "Sunega Novel",
  description: "A next-generation storytelling and reading platform.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Apply font variables to the html tag
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>{/* No direct link tags needed for Google Fonts here anymore */}</head>
      <body>
        {/* ThemeProvider configured for light theme only */}
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster /> {/* Add Toaster component here */}
        </ThemeProvider>
      </body>
    </html>
  )
}
