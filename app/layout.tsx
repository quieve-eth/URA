import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SimpleWeb3Provider } from "@/components/web3/simple-web3-provider"
import "./globals.css"
import { Suspense } from "react"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "URA Protocol - Universal Rule Attestation",
  description: "Decentralized data validation for Web3 applications",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading application...</div>}>
          <SimpleWeb3Provider>
            <Suspense fallback={<div>Loading content...</div>}>{children}</Suspense>
          </SimpleWeb3Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
