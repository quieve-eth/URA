"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Database, Users, CheckCircle, Play } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Universal Rule Attestation Protocol
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Decentralized Data Validation for Web3</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            URA Protocol provides AI-powered validation services for DeFi, DeSci, DePIN, and Web3 Social applications.
            Validate data integrity with cryptographic proofs and smart contract attestations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="gap-2">
                Try Interactive Demo <Play className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Validation Modules</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purpose-built validation engines for different Web3 verticals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>DeFi KYC</CardTitle>
              <CardDescription>Sanction list screening and compliance validation for DeFi protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>OFAC Compliance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Risk Scoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time Validation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>DeSci Integrity</CardTitle>
              <CardDescription>Plagiarism detection and research validation for decentralized science</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Plagiarism Detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Citation Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Peer Review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>DePIN Sensors</CardTitle>
              <CardDescription>
                IoT sensor data validation and anomaly detection for physical infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Anomaly Detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Data Integrity</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Consensus Validation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Web3 Social</CardTitle>
              <CardDescription>
                Content moderation and toxicity detection for decentralized social platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Toxicity Detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Spam Filtering</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Community Standards</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">How It Works</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three-layer architecture for scalable and secure validation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">SDK Integration</h4>
            <p className="text-muted-foreground">
              Developers integrate URA SDK with simple API calls for data validation
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">AI Validation</h4>
            <p className="text-muted-foreground">
              Off-chain AI models and rule engines process and validate submitted data
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h4 className="text-xl font-semibold mb-2">Blockchain Proof</h4>
            <p className="text-muted-foreground">
              Validation results are stored on-chain as cryptographic proofs and attestations
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Build with URA?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join the next generation of Web3 applications with built-in data validation and integrity guarantees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Try Interactive Demo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Start Building
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("https://discord.gg/ura-protocol", "_blank")}
              >
                Join Discord
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  )
}
