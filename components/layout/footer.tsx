import { Shield, Github, Twitter, Diamond as Discord } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">URA Protocol</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Universal Rule Attestation for Web3. Decentralized data validation with AI-powered integrity guarantees.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2">
              <Link
                href="/demo"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Interactive Demo
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API Reference
              </Link>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <h3 className="font-semibold">Use Cases</h3>
            <div className="space-y-2">
              <Link
                href="/demo/defi-kyc"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                DeFi KYC
              </Link>
              <Link
                href="/demo/desci-plagiarism"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                DeSci Integrity
              </Link>
              <Link
                href="/demo/depin-sensor"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                DePIN Sensors
              </Link>
              <Link
                href="/demo/web3-social"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Web3 Social
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/ura-protocol" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://twitter.com/ura_protocol" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://discord.gg/ura-protocol" target="_blank" rel="noopener noreferrer">
                  <Discord className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 URA Protocol. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
