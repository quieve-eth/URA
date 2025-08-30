import { ValidationType } from "@/lib/sdk/types"

export interface RuleSetConfig {
  id: string
  name: string
  description: string
  validationType: ValidationType
  parameters: Record<string, any>
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export class RuleSetManager {
  private ruleSets: Map<string, RuleSetConfig>

  constructor() {
    this.ruleSets = new Map()
    this.initializeDefaultRuleSets()
  }

  private initializeDefaultRuleSets(): void {
    const defaultRuleSets: RuleSetConfig[] = [
      {
        id: "defi-kyc-v1",
        name: "DeFi KYC Validation",
        description: "Standard KYC validation for DeFi protocols including OFAC screening",
        validationType: ValidationType.DEFI_KYC,
        parameters: {
          checkOFAC: true,
          riskThreshold: 0.7,
          requireDocuments: false,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "desci-plagiarism-v1",
        name: "DeSci Plagiarism Detection",
        description: "Plagiarism detection for scientific papers and research",
        validationType: ValidationType.DESCI_PLAGIARISM,
        parameters: {
          similarityThreshold: 0.8,
          checkCitations: true,
          minWordCount: 100,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "depin-sensor-v1",
        name: "DePIN Sensor Validation",
        description: "IoT sensor data validation and anomaly detection",
        validationType: ValidationType.DEPIN_SENSOR,
        parameters: {
          anomalyThreshold: 0.9,
          timeWindowMinutes: 60,
          requireConsensus: true,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "web3-social-v1",
        name: "Web3 Social Moderation",
        description: "Content moderation for decentralized social platforms",
        validationType: ValidationType.WEB3_SOCIAL,
        parameters: {
          toxicityThreshold: 0.8,
          checkSpam: true,
          allowAppeal: true,
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]

    defaultRuleSets.forEach((ruleSet) => {
      this.ruleSets.set(ruleSet.id, ruleSet)
    })
  }

  async getRuleSets(validationType?: ValidationType): Promise<RuleSetConfig[]> {
    const allRuleSets = Array.from(this.ruleSets.values())

    if (validationType) {
      return allRuleSets.filter((ruleSet) => ruleSet.validationType === validationType)
    }

    return allRuleSets
  }

  async getRuleSetById(id: string): Promise<RuleSetConfig | null> {
    return this.ruleSets.get(id) || null
  }

  async createRuleSet(config: Omit<RuleSetConfig, "createdAt" | "updatedAt">): Promise<RuleSetConfig> {
    if (this.ruleSets.has(config.id)) {
      throw new Error(`Rule set with ID ${config.id} already exists`)
    }

    const ruleSet: RuleSetConfig = {
      ...config,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    this.ruleSets.set(config.id, ruleSet)
    return ruleSet
  }

  async updateRuleSet(
    id: string,
    updates: Partial<Omit<RuleSetConfig, "id" | "createdAt" | "updatedAt">>,
  ): Promise<RuleSetConfig | null> {
    const existing = this.ruleSets.get(id)
    if (!existing) {
      return null
    }

    const updated: RuleSetConfig = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    }

    this.ruleSets.set(id, updated)
    return updated
  }

  async deleteRuleSet(id: string): Promise<boolean> {
    return this.ruleSets.delete(id)
  }

  async getRuleSetParameters(id: string): Promise<Record<string, any> | null> {
    const ruleSet = this.ruleSets.get(id)
    return ruleSet?.parameters || null
  }

  async updateRuleSetParameters(id: string, parameters: Record<string, any>): Promise<boolean> {
    const ruleSet = this.ruleSets.get(id)
    if (!ruleSet) {
      return false
    }

    ruleSet.parameters = { ...ruleSet.parameters, ...parameters }
    ruleSet.updatedAt = Date.now()

    return true
  }
}
