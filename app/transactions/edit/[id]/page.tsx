import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import TransactionForm from "@/components/transaction-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditTransactionPage({ params }: PageProps) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(params.id) })

    if (!transaction) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Transaction</h1>
        <div className="max-w-2xl">
          <TransactionForm transaction={JSON.parse(JSON.stringify(transaction))} />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
