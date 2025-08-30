import { type NextRequest, NextResponse } from "next/server"
import { RuleSetManager } from "@/lib/validation/rulesets"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ruleSetManager = new RuleSetManager()
    const ruleSet = await ruleSetManager.getRuleSetById(params.id)

    if (!ruleSet) {
      return NextResponse.json({ error: "Rule set not found" }, { status: 404 })
    }

    return NextResponse.json(ruleSet)
  } catch (error) {
    console.error("Error fetching rule set:", error)
    return NextResponse.json({ error: "Failed to fetch rule set" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, parameters, isActive } = body

    const ruleSetManager = new RuleSetManager()
    const updatedRuleSet = await ruleSetManager.updateRuleSet(params.id, {
      name,
      description,
      parameters,
      isActive,
    })

    if (!updatedRuleSet) {
      return NextResponse.json({ error: "Rule set not found" }, { status: 404 })
    }

    return NextResponse.json(updatedRuleSet)
  } catch (error) {
    console.error("Error updating rule set:", error)
    return NextResponse.json({ error: "Failed to update rule set" }, { status: 500 })
  }
}
