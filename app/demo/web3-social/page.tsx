"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ValidationResult {
  isValid: boolean
  confidence: number
  details: {
    toxicityScore?: number
    spamScore?: number
    harassmentScore?: number
    contentCategory?: string
    reasoning?: string
  }
  flags: string[]
}

export default function Web3SocialDemo() {
  const [content, setContent] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [error, setError] = useState("")

  const exampleContents = [
    "Just launched my new NFT collection! Check it out and let me know what you think. Really excited to share this with the community!",
    "This project is absolutely terrible and the developers are complete idiots who don't know what they're doing.",
    "🚀🚀🚀 AMAZING OPPORTUNITY!!! 💰💰💰 Get rich quick with this new token!!! Click here now!!! 🔥🔥🔥",
  ]

  const handleValidate = async () => {
    if (!content.trim()) {
      setError("Please enter some content to validate")
      return
    }

    setIsValidating(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            content: content.trim(),
            author: "demo-user",
            platform: "demo-platform",
            contentType: "post",
          },
          dataHash: `0x${Math.random().toString(16).slice(2)}`,
          ruleSetId: "web3-social-v1",
          validationType: "WEB3_SOCIAL",
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

  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-green-600"
    if (score < 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreVariant = (score: number) => {
    if (score < 0.3) return "secondary"
    if (score < 0.7) return "outline"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/demo" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Web3 Social Demo</h1>
            </Link>
            <Badge variant="secondary">Interactive Demo</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Web3 Social Content Moderation Demo
              </CardTitle>
              <CardDescription>
                Test content moderation using AI-powered analysis for toxicity, spam, and harassment detection. This
                demo helps ensure community standards are maintained on decentralized social platforms.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Content Input</CardTitle>
                <CardDescription>Enter social media content to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Social Media Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the social media post, comment, or message you want to analyze..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="text-xs text-muted-foreground">{content.length}/1000 characters</div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleValidate} disabled={isValidating || !content.trim()} className="w-full">
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    "Analyze Content"
                  )}
                </Button>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Try these examples:</div>
                  {exampleContents.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left h-auto p-3 text-xs bg-transparent"
                      onClick={() => setContent(example)}
                    >
                      {example.length > 80 ? `${example.slice(0, 80)}...` : example}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Moderation Results</CardTitle>
                <CardDescription>AI-powered content analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                {!result && !isValidating && (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter content and click analyze to see moderation results
                  </div>
                )}

                {isValidating && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyzing content for policy violations...</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {/* Overall Status */}
                    <div className="flex items-center gap-3 p-4 rounded-lg border">
                      {result.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className={`font-semibold ${result.isValid ? "text-green-600" : "text-red-600"}`}>
                          {result.isValid ? "Content Approved" : "Content Flagged"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {Math.round(result.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Analysis Scores</h4>

                      {result.details.toxicityScore !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Toxicity Score</span>
                            <Badge variant={getScoreVariant(result.details.toxicityScore)}>
                              {Math.round(result.details.toxicityScore * 100)}%
                            </Badge>
                          </div>
                          <Progress value={result.details.toxicityScore * 100} className="h-2" />
                        </div>
                      )}

                      {result.details.spamScore !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Spam Score</span>
                            <Badge variant={getScoreVariant(result.details.spamScore)}>
                              {Math.round(result.details.spamScore * 100)}%
                            </Badge>
                          </div>
                          <Progress value={result.details.spamScore * 100} className="h-2" />
                        </div>
                      )}

                      {result.details.harassmentScore !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Harassment Score</span>
                            <Badge variant={getScoreVariant(result.details.harassmentScore)}>
                              {Math.round(result.details.harassmentScore * 100)}%
                            </Badge>
                          </div>
                          <Progress value={result.details.harassmentScore * 100} className="h-2" />
                        </div>
                      )}

                      {result.details.contentCategory && (
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span>Content Category</span>
                          <Badge
                            variant={
                              result.details.contentCategory === "safe"
                                ? "secondary"
                                : result.details.contentCategory === "warning"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {result.details.contentCategory.toUpperCase()}
                          </Badge>
                        </div>
                      )}

                      {result.flags.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-medium">Policy Violations</span>
                          <div className="flex flex-wrap gap-2">
                            {result.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
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
          </div>

          {/* Integration Example */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Integration Example</CardTitle>
              <CardDescription>How to integrate content moderation into your social platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">// Social Content Moderation</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-400">const</span> result = <span className="text-blue-400">await</span>{" "}
                    uraClient.<span className="text-yellow-400">validate</span>({`{`}
                  </div>
                  <div className="ml-4">data: {`{ content: userPost, author: userId }`},</div>
                  <div className="ml-4">
                    ruleSetId: <span className="text-green-400">"web3-social-v1"</span>,
                  </div>
                  <div className="ml-4">
                    validationType: <span className="text-green-400">"WEB3_SOCIAL"</span>
                  </div>
                  <div>{`})`}</div>
                  <div className="mt-2">
                    <span className="text-blue-400">if</span> (result.isValid) {`{`}
                  </div>
                  <div className="ml-4">// Publish content</div>
                  <div>{`} else {`}</div>
                  <div className="ml-4">// Flag for review</div>
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
