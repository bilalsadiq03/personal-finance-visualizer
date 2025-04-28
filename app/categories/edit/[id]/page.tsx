import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import CategoryForm from "@/components/category-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: PageProps) {
  try {
    const client = await clientPromise
    const db = client.db("finance-visualizer")

    const category = await db.collection("categories").findOne({ _id: new ObjectId(params.id) })

    if (!category) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <div className="max-w-2xl">
          <CategoryForm category={JSON.parse(JSON.stringify(category))} />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
