import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import BudgetForm from "@/components/budget-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditBudgetPage({ params }: PageProps) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const budget = await db.collection("budgets").findOne({ _id: new ObjectId(params.id) })

    if (!budget) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Budget</h1>
        <div className="max-w-2xl">
          <BudgetForm budget={JSON.parse(JSON.stringify(budget))} />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
