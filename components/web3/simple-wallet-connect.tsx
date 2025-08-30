"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "./simple-web3-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SimpleWalletConnect() {
  const { account, isConnected, chainId, isWalletAvailable, error, connect, disconnect } = useWeb3()

  if (error) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {!isWalletAvailable && (
          <Button onClick={() => window.open("https://metamask.io/download/", "_blank")} variant="outline" size="sm">
            Install MetaMask
          </Button>
        )}
      </div>
    )
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          {chainId && <div className="text-muted-foreground">Chain: {chainId}</div>}
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} size="sm" disabled={!isWalletAvailable}>
      {isWalletAvailable ? "Connect Wallet" : "No Wallet Detected"}
    </Button>
  )
}
