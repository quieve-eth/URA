import { type NextRequest, NextResponse } from "next/server"
import { ValidationType } from "@/lib/sdk/types"
import { ValidationEngine } from "@/lib/validation/engine"
import { generateProofHash } from "@/lib/sdk/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, dataHash, ruleSetId, validationType, metadata } = body

    console.log("[v0] Starting validation for type:", validationType)
    console.log("[v0] Validation data:", { dataHash, ruleSetId })

    // Validate required fields
    if (!data || !dataHash || !ruleSetId || !validationType) {
      return NextResponse.json(
        { error: "Missing required fields: data, dataHash, ruleSetId, validationType" },
        { status: 400 },
      )
    }

    // Validate validation type
    if (!Object.values(ValidationType).includes(validationType)) {
      return NextResponse.json({ error: "Invalid validation type" }, { status: 400 })
    }

    // Initialize validation engine
    const engine = new ValidationEngine()

    console.log("[v0] Calling validation engine...")

    // Perform validation based on type
    const validationResult = await engine.validate({
      data,
      dataHash,
      ruleSetId,
      validationType,
      metadata: metadata || {},
    })

    console.log("[v0] Validation result:", validationResult)

    // Generate proof hash
    const proofHash = generateProofHash({
      dataHash,
      isValid: validationResult.isValid,
      ruleSetId,
      timestamp: validationResult.timestamp,
    })

    const response = {
      isValid: validationResult.isValid,
      proofHash,
      dataHash,
      timestamp: validationResult.timestamp,
      validator: "ura-validator-v1",
      ruleSetId,
      confidence: validationResult.confidence,
      details: validationResult.details,
      flags: validationResult.details?.flags || [],
      metadata: JSON.stringify(metadata || {}),
    }

    console.log("[v0] Sending response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Validation API error:", error)
    return NextResponse.json({ error: "Internal server error during validation" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "URA Validation API",
    version: "1.0.0",
    endpoints: {
      validate: "POST /api/validate",
      validationTypes: "GET /api/validation-types",
      rulesets: "GET /api/rulesets",
    },
  })
}
