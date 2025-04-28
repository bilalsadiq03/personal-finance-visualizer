import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance-visualizer");

    const transactions = await db.collection("transactions").find({}).toArray();

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else if (transaction.amount < 0) {
        totalExpenses += transaction.amount;
      }
    });

    const netSavings = totalIncome + totalExpenses;

    return NextResponse.json({
      totalTransactions: transactions.length,
      totalIncome,
      totalExpenses: Math.abs(totalExpenses), 
      netSavings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate summary" }, { status: 500 });
  }
}
