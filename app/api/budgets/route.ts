import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const query: any = {}

    if (month && year) {
      query.month = Number.parseInt(month)
      query.year = Number.parseInt(year)
    }

    const budgets = await db.collection("budgets").find(query).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const budget = await request.json()

    // Validate budget data
    if (!budget.categoryId || !budget.amount || budget.month === undefined || budget.year === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if budget already exists for this category and month/year
    const existingBudget = await db.collection("budgets").findOne({
      categoryId: budget.categoryId,
      month: budget.month,
      year: budget.year,
    })

    if (existingBudget) {
      // Update existing budget
      await db.collection("budgets").updateOne({ _id: existingBudget._id }, { $set: { amount: budget.amount } })

      return NextResponse.json({
        _id: existingBudget._id,
        ...budget,
      })
    }

    // Create new budget
    const result = await db.collection("budgets").insertOne(budget)

    return NextResponse.json({
      _id: result.insertedId,
      ...budget,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add budget" }, { status: 500 })
  }
}
