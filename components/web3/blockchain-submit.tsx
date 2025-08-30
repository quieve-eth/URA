"use client"

import { useState } from "react"
import { useWeb3 } from "./simple-web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, ExternalLink, AlertTriangle } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  confidence: number
  proofHash: string
  dataHash: string
  ruleSetId: string
  metadata?: string
}

interface BlockchainSubmitProps {
  validationResult: ValidationResult | null
  onSubmitSuccess?: (txHash: string) => void
}

export function BlockchainSubmit({ validationResult, onSubmitSuccess }: BlockchainSubmitProps) {
  const { account, isConnected, chainId } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleSubmit = async () => {
    if (!validationResult || !isConnected || !account) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate blockchain transaction for demo purposes
      // In a real implementation, you would use ethers.js or similar
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      setTxHash(mockTxHash)

      // Simulate confirmation
      setTimeout(() => {
        setIsConfirmed(true)
        if (onSubmitSuccess) {
          onSubmitSuccess(mockTxHash)
        }
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Submission</CardTitle>
          <CardDescription>Submit validation results to the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to submit validation results to the blockchain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!validationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Submission</CardTitle>
          <CardDescription>Submit validation results to the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>Complete a validation first to submit results to the blockchain.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Submission</CardTitle>
        <CardDescription>Submit your validation proof as an immutable attestation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Validation Status</span>
            <Badge variant={validationResult.isValid ? "secondary" : "destructive"}>
              {validationResult.isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm">{Math.round(validationResult.confidence * 100)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Rule Set</span>
            <span className="text-sm font-mono">{validationResult.ruleSetId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Proof Hash</span>
            <span className="text-xs font-mono">{validationResult.proofHash.slice(0, 10)}...</span>
          </div>
        </div>

        {/* Transaction Status */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Transaction failed: {error}</AlertDescription>
          </Alert>
        )}

        {txHash && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Transaction submitted!</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, "_blank")}
              >
                View on Etherscan <ExternalLink className="h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isConfirmed && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Validation proof successfully recorded on blockchain!</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={isSubmitting || isConfirmed} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting to Blockchain...
            </>
          ) : isConfirmed ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Successfully Submitted
            </>
          ) : (
            "Submit to Blockchain"
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>Gas fees will apply for blockchain submission.</p>
          <p>Your validation proof will be permanently stored on-chain.</p>
        </div>
      </CardContent>
    </Card>
  )
}
