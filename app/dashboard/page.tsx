"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, BarChart3, Clock, Shield, Code, Copy, Eye, EyeOff, Plus, Trash2, Activity } from "lucide-react"
import { WalletConnect } from "@/components/web3/wallet-connect"

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  requests: number
  status: "active" | "inactive"
}

interface UsageStats {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  requestsToday: number
  validationTypes: {
    "defi-kyc": number
    "web3-social": number
    "depin-sensor": number
    "desci-plagiarism": number
  }
}

interface ValidationHistory {
  id: string
  type: string
  timestamp: string
  status: "success" | "failed"
  confidence: number
  txHash?: string
}

export default function DeveloperDashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "ura_live_sk_1234567890abcdef",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
      requests: 1247,
      status: "active",
    },
    {
      id: "2",
      name: "Development API",
      key: "ura_test_sk_abcdef1234567890",
      created: "2024-01-10",
      lastUsed: "2024-01-19",
      requests: 523,
      status: "active",
    },
  ])

  const [usageStats] = useState<UsageStats>({
    totalRequests: 1770,
    successRate: 98.5,
    avgResponseTime: 1.2,
    requestsToday: 47,
    validationTypes: {
      "defi-kyc": 650,
      "web3-social": 520,
      "depin-sensor": 380,
      "desci-plagiarism": 220,
    },
  })

  const [validationHistory] = useState<ValidationHistory[]>([
    {
      id: "1",
      type: "web3-social",
      timestamp: "2024-01-20T14:30:00Z",
      status: "success",
      confidence: 0.95,
      txHash: "0x1234...abcd",
    },
    {
      id: "2",
      type: "defi-kyc",
      timestamp: "2024-01-20T14:25:00Z",
      status: "success",
      confidence: 0.88,
    },
    {
      id: "3",
      type: "depin-sensor",
      timestamp: "2024-01-20T14:20:00Z",
      status: "failed",
      confidence: 0.45,
    },
  ])

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState("")

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const createNewApiKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `ura_${Math.random() > 0.5 ? "live" : "test"}_sk_${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      requests: 0,
      status: "active",
    }

    setApiKeys((prev) => [...prev, newKey])
    setNewKeyName("")
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground">Manage your URA Protocol integration and monitor usage</p>
        </div>
        <WalletConnect />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{usageStats.requestsToday} today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.avgResponseTime}s</div>
                <p className="text-xs text-muted-foreground">Response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiKeys.filter((k) => k.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">API keys active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Validation Types Usage</CardTitle>
                <CardDescription>Breakdown by validation type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(usageStats.validationTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{type}</Badge>
                    </div>
                    <div className="text-sm font-medium">{count.toLocaleString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest validation requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationHistory.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>Generate a new API key for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API, Development API"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={createNewApiKey} disabled={!newKeyName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>Manage your existing API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{apiKey.name}</h3>
                      <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>{apiKey.status}</Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => deleteApiKey(apiKey.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {showApiKey[apiKey.id] ? apiKey.key : "•".repeat(apiKey.key.length)}
                    </code>
                    <Button variant="outline" size="sm" onClick={() => toggleApiKeyVisibility(apiKey.id)}>
                      {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Created: {apiKey.created}</div>
                    <div>Last used: {apiKey.lastUsed}</div>
                    <div>Requests: {apiKey.requests.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Detailed breakdown of your API usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{usageStats.totalRequests}</div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{usageStats.requestsToday}</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>API performance and reliability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium">{usageStats.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-medium">{usageStats.avgResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation History</CardTitle>
              <CardDescription>Recent validation requests and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationHistory.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
                        {item.confidence && (
                          <Badge variant="secondary">{Math.round(item.confidence * 100)}% confidence</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                    {item.txHash && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Transaction: </span>
                        <code className="bg-muted px-1 rounded">{item.txHash}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Quick Start
                </CardTitle>
                <CardDescription>Get started with URA Protocol in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`npm install @ura/sdk

import { URAClient } from '@ura/sdk'

const ura = new URAClient({
  apiKey: 'your-api-key',
  network: 'ethereum'
})

const result = await ura.validate({
  type: 'web3-social',
  data: { content: 'Hello world!' }
})`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Documentation and guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.open("https://docs.ura-protocol.com/api", "_blank")}
                >
                  API Reference
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.open("https://docs.ura-protocol.com/integration", "_blank")}
                >
                  Integration Guide
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.open("https://docs.ura-protocol.com/contracts", "_blank")}
                >
                  Smart Contract Docs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => window.open("https://github.com/ura-protocol/examples", "_blank")}
                >
                  Example Applications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
