import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().getMonth() + 1
    const year = searchParams.get("year") || new Date().getFullYear()

    // Get all categories
    const categories = await db.collection("categories").find({}).toArray()

    // Get transactions for the specified month
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

    // Calculate expenses by category
    const categoryExpenses = categories
      .map((category) => {
        const categoryTransactions = transactions.filter((t) => t.category === category._id.toString())

        const amount = categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
          category: category.name,
          amount,
          color: category.color,
        }
      })
      .filter((category) => category.amount > 0)

    // Add "Uncategorized" for transactions without a category
    const uncategorizedTransactions = transactions.filter((t) => !t.category)
    if (uncategorizedTransactions.length > 0) {
      const uncategorizedAmount = uncategorizedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

      categoryExpenses.push({
        category: "Uncategorized",
        amount: uncategorizedAmount,
        color: "#CBD5E0",
      })
    }

    return NextResponse.json(categoryExpenses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category expenses" }, { status: 500 })
  }
}
