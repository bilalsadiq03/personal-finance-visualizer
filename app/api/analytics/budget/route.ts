import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const { searchParams } = new URL(request.url)
    const month = Number.parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString())
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())

    // Get all categories
    const categories = await db.collection("categories").find({}).toArray()

    // Get all budgets for the month
    const budgets = await db.collection("budgets").find({ month, year }).toArray()

    // Get transactions for the month
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`
    const endDate = `${year}-${month.toString().padStart(2, "0")}-31`

    const transactions = await db
      .collection("transactions")
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray()

    // Calculate budget vs actual spending
    const budgetComparison = categories
      .map((category) => {
        const budget = budgets.find((b) => b.categoryId === category._id.toString())
        const categoryTransactions = transactions.filter((t) => t.category === category._id.toString())

        const actual = categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
          category: category.name,
          budget: budget ? budget.amount : 0,
          actual,
          color: category.color,
        }
      })
      .filter((item) => item.budget > 0 || item.actual > 0)

    return NextResponse.json(budgetComparison)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budget comparison" }, { status: 500 })
  }
}
