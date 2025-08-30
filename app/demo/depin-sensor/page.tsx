"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Thermometer } from "lucide-react"
import { BlockchainSubmit } from "@/components/web3/blockchain-submit"

interface SensorReading {
  timestamp: string
  temperature: number
  humidity: number
  pressure: number
  voltage: number
}

interface ValidationResult {
  isValid: boolean
  confidence: number
  reasoning: string
  anomalies: string[]
  flags: string[]
  metadata: {
    dataPoints: number
    timeRange: string
    sensorType: string
  }
}

export default function DePINSensorDemo() {
  const [sensorData, setSensorData] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [location, setLocation] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidation = async () => {
    if (!sensorData.trim() || !deviceId.trim()) return

    setIsValidating(true)
    setResult(null)

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "depin-sensor",
          data: {
            sensorData,
            deviceId,
            location,
            timestamp: new Date().toISOString(),
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

  const loadSampleData = () => {
    const sampleReadings: SensorReading[] = [
      { timestamp: "2024-01-15T10:00:00Z", temperature: 22.5, humidity: 45.2, pressure: 1013.25, voltage: 3.3 },
      { timestamp: "2024-01-15T10:05:00Z", temperature: 22.7, humidity: 44.8, pressure: 1013.2, voltage: 3.29 },
      { timestamp: "2024-01-15T10:10:00Z", temperature: 23.1, humidity: 44.5, pressure: 1013.15, voltage: 3.31 },
      { timestamp: "2024-01-15T10:15:00Z", temperature: 85.2, humidity: 44.1, pressure: 1013.1, voltage: 2.1 }, // Anomaly
      { timestamp: "2024-01-15T10:20:00Z", temperature: 23.8, humidity: 43.9, pressure: 1013.05, voltage: 3.28 },
    ]

    setSensorData(JSON.stringify(sampleReadings, null, 2))
    setDeviceId("DEPIN-SENSOR-001")
    setLocation("San Francisco, CA")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DePIN Sensor Validation Demo</h1>
        <p className="text-muted-foreground">
          Test AI-powered validation for decentralized physical infrastructure sensor data
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Sensor Data Input
            </CardTitle>
            <CardDescription>Submit sensor readings for anomaly detection and validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="e.g., DEPIN-SENSOR-001"
              />
            </div>

            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <Label htmlFor="sensorData">Sensor Readings (JSON)</Label>
              <Textarea
                id="sensorData"
                value={sensorData}
                onChange={(e) => setSensorData(e.target.value)}
                placeholder="Paste sensor data JSON here..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={loadSampleData} variant="outline" className="flex-1 bg-transparent">
                Load Sample Data
              </Button>
              <Button
                onClick={handleValidation}
                disabled={isValidating || !sensorData.trim() || !deviceId.trim()}
                className="flex-1"
              >
                {isValidating ? "Validating..." : "Validate Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>AI analysis of sensor data quality and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            {isValidating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing sensor data...</span>
                </div>
                <Progress value={65} className="w-full" />
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
                  <span className="font-medium">{result.isValid ? "Data Valid" : "Data Invalid"}</span>
                  <Badge variant={result.confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(result.confidence * 100)}% confidence
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Analysis</h4>
                  <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </div>

                {result.anomalies.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Detected Anomalies
                    </h4>
                    <div className="space-y-1">
                      {result.anomalies.map((anomaly, index) => (
                        <Badge key={index} variant="destructive" className="mr-2">
                          {anomaly}
                        </Badge>
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
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="ml-2 font-medium">{result.metadata.dataPoints}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time Range:</span>
                    <span className="ml-2 font-medium">{result.metadata.timeRange}</span>
                  </div>
                </div>

                <BlockchainSubmit validationResult={result} validationType="depin-sensor" dataHash={deviceId} />
              </div>
            )}

            {!isValidating && !result && (
              <div className="text-center py-8 text-muted-foreground">
                <Thermometer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Submit sensor data to see validation results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Example</CardTitle>
          <CardDescription>How to integrate DePIN sensor validation in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`import { URAClient } from '@ura/sdk'

const ura = new URAClient({
  apiKey: 'your-api-key',
  network: 'ethereum'
})

// Validate sensor data
const result = await ura.validate({
  type: 'depin-sensor',
  data: {
    sensorData: readings,
    deviceId: 'DEPIN-SENSOR-001',
    location: 'San Francisco, CA'
  }
})

if (result.isValid) {
  // Submit to blockchain
  const proof = await ura.submitValidated(result)
  console.log('Validation proof:', proof.transactionHash)
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
