import { type NextRequest, NextResponse } from "next/server"
import { ValidationType } from "@/lib/sdk/types"
import { RuleSetManager } from "@/lib/validation/rulesets"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validationType = searchParams.get("type") as ValidationType | null

    const ruleSetManager = new RuleSetManager()
    const ruleSets = await ruleSetManager.getRuleSets(validationType)

    return NextResponse.json(ruleSets)
  } catch (error) {
    console.error("Error fetching rule sets:", error)
    return NextResponse.json({ error: "Failed to fetch rule sets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, validationType, parameters } = body

    // Validate required fields
    if (!id || !name || !validationType) {
      return NextResponse.json({ error: "Missing required fields: id, name, validationType" }, { status: 400 })
    }

    // Validate validation type
    if (!Object.values(ValidationType).includes(validationType)) {
      return NextResponse.json({ error: "Invalid validation type" }, { status: 400 })
    }

    const ruleSetManager = new RuleSetManager()
    const ruleSet = await ruleSetManager.createRuleSet({
      id,
      name,
      description: description || "",
      validationType,
      parameters: parameters || {},
    })

    return NextResponse.json(ruleSet, { status: 201 })
  } catch (error) {
    console.error("Error creating rule set:", error)
    return NextResponse.json({ error: "Failed to create rule set" }, { status: 500 })
  }
}
