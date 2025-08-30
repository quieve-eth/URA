import { NextResponse } from "next/server"
import { ValidationType } from "@/lib/sdk/types"

export async function GET() {
  try {
    const validationTypes = Object.values(ValidationType).map((type) => ({
      type,
      name: formatValidationTypeName(type),
      description: getValidationTypeDescription(type),
      defaultRuleSet: getDefaultRuleSetId(type),
    }))

    return NextResponse.json(validationTypes)
  } catch (error) {
    console.error("Error fetching validation types:", error)
    return NextResponse.json({ error: "Failed to fetch validation types" }, { status: 500 })
  }
}

function formatValidationTypeName(type: ValidationType): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function getValidationTypeDescription(type: ValidationType): string {
  const descriptions = {
    [ValidationType.DEFI_KYC]: "Know Your Customer validation for DeFi protocols including sanction screening",
    [ValidationType.DESCI_PLAGIARISM]:
      "Plagiarism detection and research integrity validation for decentralized science",
    [ValidationType.DEPIN_SENSOR]: "IoT sensor data validation and anomaly detection for physical infrastructure",
    [ValidationType.WEB3_SOCIAL]: "Content moderation and toxicity detection for decentralized social platforms",
  }
  return descriptions[type] || "Unknown validation type"
}

function getDefaultRuleSetId(type: ValidationType): string {
  const ruleSetIds = {
    [ValidationType.DEFI_KYC]: "defi-kyc-v1",
    [ValidationType.DESCI_PLAGIARISM]: "desci-plagiarism-v1",
    [ValidationType.DEPIN_SENSOR]: "depin-sensor-v1",
    [ValidationType.WEB3_SOCIAL]: "web3-social-v1",
  }
  return ruleSetIds[type] || "unknown"
}
