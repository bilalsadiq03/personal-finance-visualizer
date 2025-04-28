import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const transaction = await request.json()

    // Validate transaction data
    if (!transaction.amount || !transaction.date || !transaction.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await db.collection("transactions").insertOne(transaction)

    return NextResponse.json({
      _id: result.insertedId,
      ...transaction,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 })
  }
}
