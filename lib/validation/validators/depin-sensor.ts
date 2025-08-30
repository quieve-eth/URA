import { BaseValidator } from "./base"
import type { ValidationRequest, ValidationResult } from "../engine"

export class DePINSensorValidator extends BaseValidator {
  async validate(request: ValidationRequest): Promise<ValidationResult> {
    const { data } = request

    await this.delay(300) // Simulate sensor data processing

    const sensorId = data.sensorId
    const readings = data.readings || [data.reading]

    if (!sensorId || !readings || readings.length === 0) {
      return this.createResult(false, 0, { error: "Missing sensor ID or readings" })
    }

    // Mock anomaly detection
    const anomalyScore = await this.detectAnomalies(readings)
    const consensusScore = await this.checkConsensus(sensorId, readings)

    const threshold = 0.9
    const isValid = anomalyScore < threshold && consensusScore > 0.6

    return this.createResult(isValid, 0.8, {
      anomalyScore,
      consensusScore,
      threshold,
      readingCount: readings.length,
      sensorId,
      checks: {
        anomalyDetection: anomalyScore < threshold ? "passed" : "failed",
        consensusValidation: consensusScore > 0.6 ? "passed" : "failed",
      },
    })
  }

  private async detectAnomalies(readings: number[]): Promise<number> {
    // Mock anomaly detection using statistical analysis
    if (readings.length < 2) return 0

    const mean = readings.reduce((sum, val) => sum + val, 0) / readings.length
    const variance = readings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / readings.length
    const stdDev = Math.sqrt(variance)

    let anomalies = 0
    readings.forEach((reading) => {
      const zScore = Math.abs((reading - mean) / stdDev)
      if (zScore > 2) {
        // More than 2 standard deviations
        anomalies++
      }
    })

    return anomalies / readings.length
  }

  private async checkConsensus(sensorId: string, readings: number[]): Promise<number> {
    // Mock consensus check with nearby sensors
    // In production, this would query other sensors in the area
    const mockNearbySensors = [
      { id: "sensor-001", reading: readings[0] + (Math.random() - 0.5) * 2 },
      { id: "sensor-002", reading: readings[0] + (Math.random() - 0.5) * 2 },
      { id: "sensor-003", reading: readings[0] + (Math.random() - 0.5) * 2 },
    ]

    const currentReading = readings[readings.length - 1]
    let consensusCount = 0

    mockNearbySensors.forEach((sensor) => {
      const difference = Math.abs(sensor.reading - currentReading)
      if (difference < 5) {
        // Within 5 units
        consensusCount++
      }
    })

    return consensusCount / mockNearbySensors.length
  }
}
