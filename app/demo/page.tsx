import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Database, Zap, Users, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"

export default function DemoPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Interactive Demos
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Test URA Validation Live</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Experience the power of AI-driven validation across different Web3 verticals. Try our interactive demos to
            see how URA Protocol validates data in real-time.
          </p>
        </div>
      </section>

      {/* Demo Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>DeFi KYC Demo</CardTitle>
                  <CardDescription>Test wallet address compliance and risk assessment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Validate wallet addresses against OFAC sanctions lists, perform AML risk scoring, and assess
                  compliance for DeFi protocols.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">OFAC Screening</Badge>
                  <Badge variant="outline">Risk Assessment</Badge>
                  <Badge variant="outline">AML Compliance</Badge>
                </div>
                <Link href="/demo/defi-kyc">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Try DeFi KYC Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>DeSci Plagiarism Demo</CardTitle>
                  <CardDescription>Check research papers for plagiarism and integrity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyze scientific content for originality, proper citations, and academic integrity using advanced AI
                  models.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Plagiarism Detection</Badge>
                  <Badge variant="outline">Citation Analysis</Badge>
                  <Badge variant="outline">Originality Score</Badge>
                </div>
                <Link href="/demo/desci-plagiarism">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Try DeSci Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>DePIN Sensor Demo</CardTitle>
                  <CardDescription>Validate IoT sensor data and detect anomalies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyze sensor readings for anomalies, validate data integrity, and ensure physical plausibility of
                  IoT measurements.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Anomaly Detection</Badge>
                  <Badge variant="outline">Data Quality</Badge>
                  <Badge variant="outline">Consensus Check</Badge>
                </div>
                <Link href="/demo/depin-sensor">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Try DePIN Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Web3 Social Demo</CardTitle>
                  <CardDescription>Moderate content and detect toxicity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyze social media content for toxicity, spam, harassment, and policy violations using advanced NLP
                  models.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Toxicity Detection</Badge>
                  <Badge variant="outline">Spam Filter</Badge>
                  <Badge variant="outline">Content Policy</Badge>
                </div>
                <Link href="/demo/web3-social">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Try Social Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration Example */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-muted/30">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how easy it is to add URA validation to your dApp with just a few lines of code.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 font-mono text-sm">
              <div className="text-muted-foreground mb-2">// Install URA SDK</div>
              <div className="text-green-400 mb-4">npm install @ura-protocol/sdk</div>

              <div className="text-muted-foreground mb-2">// Initialize and validate</div>
              <div className="space-y-1">
                <div>
                  <span className="text-blue-400">import</span> {`{ URAClient }`}{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-green-400">'@ura-protocol/sdk'</span>
                </div>
                <div className="mt-2">
                  <span className="text-blue-400">const</span> client = <span className="text-blue-400">new</span>{" "}
                  <span className="text-yellow-400">URAClient</span>(config)
                </div>
                <div>
                  <span className="text-blue-400">const</span> result = <span className="text-blue-400">await</span>{" "}
                  client.<span className="text-yellow-400">validate</span>(data)
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  View Full Documentation <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  )
}
