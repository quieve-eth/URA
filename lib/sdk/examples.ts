import { URAClient, ValidationType, type ValidationRequest } from "./index"
import { createDefaultConfig } from "./utils"

/**
 * Example usage of URA SDK
 */
export class URAExamples {
  private client: URAClient

  constructor() {
    // Initialize with default configuration
    const config = createDefaultConfig()
    this.client = new URAClient({
      config,
      autoConnect: false,
    })
  }

  /**
   * Example: DeFi KYC validation
   */
  async validateDeFiKYC(walletAddress: string): Promise<void> {
    try {
      console.log("🔍 Validating DeFi KYC for address:", walletAddress)

      const request: ValidationRequest = {
        data: { walletAddress },
        ruleSetId: "defi-kyc-v1",
        validationType: ValidationType.DEFI_KYC,
        metadata: { source: "example-dapp" },
      }

      const result = await this.client.validate(request)
      console.log("✅ Validation result:", result)

      if (result.isValid) {
        // Submit to blockchain
        await this.client.connectWallet()
        const txHash = await this.client.submitValidated(result)
        console.log("📝 Submitted to blockchain:", txHash)
      }
    } catch (error) {
      console.error("❌ DeFi KYC validation failed:", error)
    }
  }

  /**
   * Example: DeSci plagiarism check
   */
  async validateDeSciPaper(paperContent: string, title: string): Promise<void> {
    try {
      console.log("📄 Checking paper for plagiarism:", title)

      const request: ValidationRequest = {
        data: { content: paperContent, title },
        ruleSetId: "desci-plagiarism-v1",
        validationType: ValidationType.DESCI_PLAGIARISM,
        metadata: { title, wordCount: paperContent.split(" ").length },
      }

      const result = await this.client.validate(request)
      console.log("✅ Plagiarism check result:", result)

      if (result.confidence && result.confidence > 0.8) {
        console.log("🎯 High confidence result, submitting to blockchain")
        await this.client.connectWallet()
        const txHash = await this.client.submitValidated(result)
        console.log("📝 Submitted to blockchain:", txHash)
      }
    } catch (error) {
      console.error("❌ DeSci validation failed:", error)
    }
  }

  /**
   * Example: DePIN sensor data validation
   */
  async validateSensorData(sensorId: string, readings: number[]): Promise<void> {
    try {
      console.log("🌡️ Validating sensor data from:", sensorId)

      const request: ValidationRequest = {
        data: { sensorId, readings, timestamp: Date.now() },
        ruleSetId: "depin-sensor-v1",
        validationType: ValidationType.DEPIN_SENSOR,
        metadata: { sensorType: "temperature", location: "outdoor" },
      }

      const result = await this.client.validate(request)
      console.log("✅ Sensor validation result:", result)

      // Batch multiple sensor readings
      const batchRequests = readings.map((reading, index) => ({
        data: { sensorId, reading, timestamp: Date.now() + index },
        ruleSetId: "depin-sensor-v1",
        validationType: ValidationType.DEPIN_SENSOR,
        metadata: { readingIndex: index },
      }))

      const batchResults = await this.client.batchValidate(batchRequests)
      console.log("📊 Batch validation results:", batchResults.length, "processed")
    } catch (error) {
      console.error("❌ DePIN validation failed:", error)
    }
  }

  /**
   * Example: Web3 Social content moderation
   */
  async validateSocialContent(content: string, author: string): Promise<void> {
    try {
      console.log("💬 Moderating social content from:", author)

      const request: ValidationRequest = {
        data: { content, author, timestamp: Date.now() },
        ruleSetId: "web3-social-v1",
        validationType: ValidationType.WEB3_SOCIAL,
        metadata: { platform: "example-social", contentType: "post" },
      }

      const result = await this.client.validate(request)
      console.log("✅ Content moderation result:", result)

      if (!result.isValid) {
        console.log("⚠️ Content flagged for moderation")
        // Handle flagged content
      } else {
        console.log("✅ Content approved for publication")
      }
    } catch (error) {
      console.error("❌ Social validation failed:", error)
    }
  }

  /**
   * Example: Get validation history
   */
  async showValidationHistory(): Promise<void> {
    try {
      await this.client.connectWallet()
      const history = await this.client.getValidationHistory(10)

      console.log("📜 Validation History:")
      history.forEach((proof, index) => {
        console.log(
          `${index + 1}. ${proof.ruleSetId} - ${proof.isValid ? "✅" : "❌"} - ${new Date(proof.timestamp * 1000).toLocaleString()}`,
        )
      })
    } catch (error) {
      console.error("❌ Failed to get history:", error)
    }
  }

  /**
   * Example: Create custom rule set
   */
  async createCustomRuleSet(): Promise<void> {
    try {
      await this.client.connectWallet()

      const txHash = await this.client.createRuleSet(
        "custom-validation-v1",
        "Custom Validation Rules",
        "Custom validation logic for specific use case",
        ValidationType.WEB3_SOCIAL,
      )

      console.log("🎯 Created custom rule set:", txHash)
    } catch (error) {
      console.error("❌ Failed to create rule set:", error)
    }
  }
}

// Export example instance for easy testing
export const examples = new URAExamples()
