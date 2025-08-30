"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, FileText, Search } from "lucide-react"
import { BlockchainSubmit } from "@/components/web3/blockchain-submit"

interface ValidationResult {
  isValid: boolean
  confidence: number
  reasoning: string
  plagiarismScore: number
  matches: Array<{
    source: string
    similarity: number
    excerpt: string
  }>
  flags: string[]
  metadata: {
    wordCount: number
    uniquenessScore: number
    analysisType: string
  }
}

export default function DeSciPlagiarismDemo() {
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [content, setContent] = useState("")
  const [authors, setAuthors] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidation = async () => {
    if (!title.trim() || !abstract.trim()) return

    setIsValidating(true)
    setResult(null)

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "desci-plagiarism",
          data: {
            title,
            abstract,
            content,
            authors,
            submissionDate: new Date().toISOString(),
          },
        }),
      })

      const validationResult = await response.json()
      setResult(validationResult.result)
    } catch (error) {
      console.error("Validation failed:", error)
    } finally {
      setIsValidating(false)
    }
  }

  const loadSamplePaper = () => {
    setTitle("Novel Approaches to Quantum Computing Error Correction")
    setAuthors("Dr. Jane Smith, Prof. John Doe")
    setAbstract(`This paper presents innovative methods for quantum error correction using topological qubits. 
    We demonstrate a new approach that significantly reduces decoherence rates while maintaining computational efficiency. 
    Our experimental results show a 40% improvement in error correction compared to existing methods.`)
    setContent(`Introduction: Quantum computing represents a paradigm shift in computational capabilities...
    
    Methodology: We employed a novel topological approach using Majorana fermions...
    
    Results: Our experiments demonstrate significant improvements in error correction rates...`)
  }

  const loadPlagiarizedSample = () => {
    setTitle("Quantum Error Correction Using Advanced Techniques")
    setAuthors("Anonymous Researcher")
    setAbstract(`Quantum computing is a revolutionary technology that promises to solve complex problems. 
    Error correction is crucial for practical quantum computers. This work explores various methods 
    for implementing quantum error correction codes.`)
    setContent(`Quantum computing has emerged as one of the most promising technologies of the 21st century.
    The field has seen rapid development in recent years, with major breakthroughs in hardware and algorithms...`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DeSci Plagiarism Detection Demo</h1>
        <p className="text-muted-foreground">
          Test AI-powered plagiarism detection for decentralized science publications
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Paper Input
            </CardTitle>
            <CardDescription>Submit your research paper for plagiarism analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Paper Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your paper title"
              />
            </div>

            <div>
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="e.g., Dr. Jane Smith, Prof. John Doe"
              />
            </div>

            <div>
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Enter your paper abstract..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="content">Paper Content (Optional)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your paper content for more thorough analysis..."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={loadSamplePaper} variant="outline" className="flex-1 bg-transparent">
                Load Original Paper
              </Button>
              <Button onClick={loadPlagiarizedSample} variant="outline" className="flex-1 bg-transparent">
                Load Plagiarized Sample
              </Button>
            </div>

            <Button
              onClick={handleValidation}
              disabled={isValidating || !title.trim() || !abstract.trim()}
              className="w-full"
            >
              {isValidating ? "Analyzing..." : "Check for Plagiarism"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plagiarism Analysis</CardTitle>
            <CardDescription>AI-powered detection of potential plagiarism and similarity</CardDescription>
          </CardHeader>
          <CardContent>
            {isValidating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing paper for plagiarism...</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {result.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{result.isValid ? "Original Content" : "Plagiarism Detected"}</span>
                  <Badge variant={result.plagiarismScore < 0.3 ? "default" : "destructive"}>
                    {Math.round(result.plagiarismScore * 100)}% similarity
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Analysis Summary</h4>
                  <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </div>

                {result.matches.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Similar Sources Found
                    </h4>
                    <div className="space-y-2">
                      {result.matches.map((match, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{match.source}</span>
                            <Badge variant="outline">{Math.round(match.similarity * 100)}% match</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground italic">"{match.excerpt}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.flags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Quality Flags</h4>
                    <div className="space-y-1">
                      {result.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Word Count:</span>
                    <span className="ml-2 font-medium">{result.metadata.wordCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uniqueness:</span>
                    <span className="ml-2 font-medium">{Math.round(result.metadata.uniquenessScore * 100)}%</span>
                  </div>
                </div>

                <BlockchainSubmit validationResult={result} validationType="desci-plagiarism" dataHash={title} />
              </div>
            )}

            {!isValidating && !result && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Submit your paper to check for plagiarism</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Example</CardTitle>
          <CardDescription>How to integrate DeSci plagiarism detection in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`import { URAClient } from '@ura/sdk'

const ura = new URAClient({
  apiKey: 'your-api-key',
  network: 'ethereum'
})

// Check for plagiarism
const result = await ura.validate({
  type: 'desci-plagiarism',
  data: {
    title: 'Your Paper Title',
    abstract: 'Your paper abstract...',
    content: 'Full paper content...',
    authors: 'Author names'
  }
})

if (result.isValid && result.plagiarismScore < 0.3) {
  // Submit original work proof to blockchain
  const proof = await ura.submitValidated(result)
  console.log('Originality proof:', proof.transactionHash)
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
