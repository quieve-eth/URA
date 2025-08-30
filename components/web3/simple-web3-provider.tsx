"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  chainId: number | null
  isWalletAvailable: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

export function SimpleWeb3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isWalletAvailable, setIsWalletAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already connected
    console.log("[v0] Checking wallet availability...")

    if (typeof window !== "undefined" && window.ethereum) {
      setIsWalletAvailable(true)
      console.log("[v0] Wallet detected:", window.ethereum)

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          console.log("[v0] Existing accounts:", accounts)
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
            setError(null)
          }
        })
        .catch((err) => {
          console.error("[v0] Failed to get accounts:", err)
          setError("Failed to get wallet accounts")
        })

      window.ethereum
        .request({ method: "eth_chainId" })
        .then((chainId: string) => {
          const numChainId = Number.parseInt(chainId, 16)
          console.log("[v0] Chain ID:", numChainId)
          setChainId(numChainId)
        })
        .catch((err) => {
          console.error("[v0] Failed to get chain ID:", err)
        })

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("[v0] Accounts changed:", accounts)
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          setError(null)
        } else {
          setAccount(null)
          setIsConnected(false)
        }
      })

      window.ethereum.on("chainChanged", (chainId: string) => {
        const numChainId = Number.parseInt(chainId, 16)
        console.log("[v0] Chain changed:", numChainId)
        setChainId(numChainId)
      })
    } else {
      console.log("[v0] No wallet detected")
      setIsWalletAvailable(false)
      setError("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.")
    }
  }, [])

  const connect = async () => {
    console.log("[v0] Attempting to connect wallet...")
    setError(null)

    if (!isWalletAvailable) {
      const errorMsg = "No Web3 wallet detected. Please install MetaMask or another Web3 wallet."
      setError(errorMsg)
      console.error("[v0]", errorMsg)
      return
    }

    if (typeof window !== "undefined" && window.ethereum) {
      try {
        console.log("[v0] Requesting wallet connection...")
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        console.log("[v0] Connection successful, accounts:", accounts)

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          setError(null)
        } else {
          setError("No accounts returned from wallet")
        }
      } catch (error: any) {
        console.error("[v0] Failed to connect wallet:", error)
        if (error.code === 4001) {
          setError("Wallet connection rejected by user")
        } else if (error.code === -32002) {
          setError("Wallet connection request already pending")
        } else {
          setError(`Failed to connect wallet: ${error.message || "Unknown error"}`)
        }
      }
    }
  }

  const disconnect = () => {
    console.log("[v0] Disconnecting wallet...")
    setAccount(null)
    setIsConnected(false)
    setError(null)
  }

  const switchChain = async (targetChainId: number) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        console.log("[v0] Switching to chain:", targetChainId)
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
      } catch (error: any) {
        console.error("[v0] Failed to switch chain:", error)
        setError(`Failed to switch chain: ${error.message || "Unknown error"}`)
      }
    }
  }

  const value = {
    account,
    isConnected,
    chainId,
    isWalletAvailable,
    error,
    connect,
    disconnect,
    switchChain,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
}
