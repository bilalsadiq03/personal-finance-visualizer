import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    const transactions = await db
      .collection("transactions")
      .find({
        date: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        },
      })
      .toArray()

    // Group transactions by month
    const monthlyExpenses = Array(12)
      .fill(0)
      .map((_, index) => {
        const monthName = new Date(0, index).toLocaleString("default", { month: "short" })
        return {
          month: monthName,
          amount: 0,
        }
      })

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthIndex = date.getMonth()
      monthlyExpenses[monthIndex].amount += transaction.amount
    })

    return NextResponse.json(monthlyExpenses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch monthly expenses" }, { status: 500 })
  }
}
