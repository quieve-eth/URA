import { ValidationType } from "@/lib/sdk/types"
import type { BaseAIModel } from "./models/base-ai-model"
import { DeFiKYCAIModel } from "./models/defi-kyc-ai"
import { DeSciPlagiarismAIModel } from "./models/desci-plagiarism-ai"
import { DePINSensorAIModel } from "./models/depin-sensor-ai"
import { Web3SocialAIModel } from "./models/web3-social-ai"

export class AIModelFactory {
  private static models: Map<ValidationType, BaseAIModel> = new Map()

  static getModel(validationType: ValidationType): BaseAIModel {
    if (!this.models.has(validationType)) {
      this.models.set(validationType, this.createModel(validationType))
    }

    return this.models.get(validationType)!
  }

  private static createModel(validationType: ValidationType): BaseAIModel {
    switch (validationType) {
      case ValidationType.DEFI_KYC:
        return new DeFiKYCAIModel()
      case ValidationType.DESCI_PLAGIARISM:
        return new DeSciPlagiarismAIModel()
      case ValidationType.DEPIN_SENSOR:
        return new DePINSensorAIModel()
      case ValidationType.WEB3_SOCIAL:
        return new Web3SocialAIModel()
      default:
        throw new Error(`No AI model available for validation type: ${validationType}`)
    }
  }

  static getAllModels(): Map<ValidationType, BaseAIModel> {
    // Initialize all models
    Object.values(ValidationType).forEach((type) => {
      this.getModel(type)
    })
    return new Map(this.models)
  }

  static clearCache(): void {
    this.models.clear()
  }
}
