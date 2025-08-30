"use client"

import { useState } from "react"
import { useWeb3 } from "./simple-web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function WalletConnect() {
  const { account, isConnected, chainId, connect, disconnect } = useWeb3()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>Your wallet is connected and ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-mono text-sm">{formatAddress(account)}</div>
              <div className="text-xs text-muted-foreground">
                {chainId ? `Chain ID: ${chainId}` : "Unknown Network"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAddress} className="gap-2 bg-transparent">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={disconnect} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>

          {chainId && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Chain ID: {chainId}</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>Connect your wallet to submit validation results to the blockchain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            You need to connect a wallet to submit validation proofs to the blockchain. Your validation results will be
            stored as immutable attestations.
          </AlertDescription>
        </Alert>

        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={connect}>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
