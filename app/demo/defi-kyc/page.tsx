"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletConnect } from "@/components/web3/wallet-connect"
import { BlockchainSubmit } from "@/components/web3/blockchain-submit"

interface ValidationResult {
  isValid: boolean
  confidence: number
  proofHash: string
  dataHash: string
  ruleSetId: string
  details: {
    riskScore?: number
    ofacStatus?: string
    amlFlags?: string[]
    geographicRisk?: string
    reasoning?: string
  }
  flags: string[]
  metadata?: string
}

export default function DeFiKYCDemo() {
  const [walletAddress, setWalletAddress] = useState("")
  const [userInfo, setUserInfo] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleValidate = async () => {
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address")
      return
    }

    setIsValidating(true)
    setError("")
    setResult(null)
    setTxHash(null)

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            walletAddress: walletAddress.trim(),
            userInfo: userInfo.trim() || undefined,
          },
          dataHash: `0x${Math.random().toString(16).slice(2)}`, // Mock hash
          ruleSetId: "defi-kyc-v1",
          validationType: "DEFI_KYC",
          metadata: { demo: true, timestamp: Date.now() },
        }),
      })

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed")
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmitSuccess = (hash: string) => {
    setTxHash(hash)
  }

  const getStatusIcon = (isValid: boolean) => {
    if (isValid) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (isValid: boolean) => {
    return isValid ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/demo" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">DeFi KYC Demo</h1>
            </Link>
            <Badge variant="secondary">Interactive Demo</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                DeFi KYC Validation Demo
              </CardTitle>
              <CardDescription>
                Test wallet address compliance against OFAC sanctions lists and perform AML risk assessment. Connect
                your wallet to submit validation proofs to the blockchain.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Validation Input</CardTitle>
                <CardDescription>Enter wallet address and optional user information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address *</Label>
                  <Input
                    id="wallet"
                    placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userInfo">Additional User Info (Optional)</Label>
                  <Textarea
                    id="userInfo"
                    placeholder="Enter any additional user information, transaction history, or context..."
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    rows={4}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleValidate} disabled={isValidating || !walletAddress.trim()} className="w-full">
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Validate Address"
                  )}
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>Try these example addresses:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87 (Clean)</li>
                    <li>• 0x1234567890123456789012345678901234567890 (Flagged)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
                <CardDescription>AI-powered compliance analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                {!result && !isValidating && (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter a wallet address and click validate to see results
                  </div>
                )}

                {isValidating && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyzing wallet address...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {/* Overall Status */}
                    <div className="flex items-center gap-3 p-4 rounded-lg border">
                      {getStatusIcon(result.isValid)}
                      <div>
                        <div className={`font-semibold ${getStatusColor(result.isValid)}`}>
                          {result.isValid ? "Validation Passed" : "Validation Failed"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {Math.round(result.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Analysis Details</h4>

                      {result.details.riskScore !== undefined && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Risk Score</span>
                          <Badge variant={result.details.riskScore > 0.7 ? "destructive" : "secondary"}>
                            {Math.round(result.details.riskScore * 100)}%
                          </Badge>
                        </div>
                      )}

                      {result.details.ofacStatus && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>OFAC Status</span>
                          <Badge variant={result.details.ofacStatus === "clear" ? "secondary" : "destructive"}>
                            {result.details.ofacStatus.toUpperCase()}
                          </Badge>
                        </div>
                      )}

                      {result.details.geographicRisk && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Geographic Risk</span>
                          <Badge variant="outline">{result.details.geographicRisk.toUpperCase()}</Badge>
                        </div>
                      )}

                      {result.details.amlFlags && result.details.amlFlags.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-medium">AML Flags</span>
                          <div className="flex flex-wrap gap-2">
                            {result.details.amlFlags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.flags.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-medium">Validation Flags</span>
                          <div className="flex flex-wrap gap-2">
                            {result.flags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.details.reasoning && (
                        <div className="space-y-2">
                          <span className="font-medium">AI Analysis</span>
                          <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
                            {result.details.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Web3 Integration */}
            <div className="space-y-6">
              <WalletConnect />
              <BlockchainSubmit validationResult={result} onSubmitSuccess={handleSubmitSuccess} />

              {txHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Success!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your validation proof has been recorded on the blockchain.
                    </p>
                    <div className="font-mono text-xs bg-muted/50 p-2 rounded">{txHash}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Integration Example */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Integration Example</CardTitle>
              <CardDescription>How to integrate this validation into your dApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">// DeFi KYC Integration</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-400">const</span> result = <span className="text-blue-400">await</span>{" "}
                    uraClient.<span className="text-yellow-400">validate</span>({`{`}
                  </div>
                  <div className="ml-4">data: {`{ walletAddress: userWallet }`},</div>
                  <div className="ml-4">
                    ruleSetId: <span className="text-green-400">"defi-kyc-v1"</span>,
                  </div>
                  <div className="ml-4">
                    validationType: <span className="text-green-400">"DEFI_KYC"</span>
                  </div>
                  <div>{`})`}</div>
                  <div className="mt-2">
                    <span className="text-blue-400">if</span> (result.isValid) {`{`}
                  </div>
                  <div className="ml-4">// Allow DeFi interaction</div>
                  <div>{`}`}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
