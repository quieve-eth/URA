import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SimpleWeb3Provider } from "@/components/web3/simple-web3-provider"
import "./globals.css"
import { Suspense } from "react"

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
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
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
