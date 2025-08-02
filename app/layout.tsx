import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeFi Protocol Hub",
  description: "Advanced Web3 platform for DeFi, NFTs, DAOs, and more",
  generator: "Tanvir",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster />
          {/* Custom watermark */}
          <div className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-70 transition-opacity duration-300">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white/70 animate-pulse">
              created by Tanvir
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
