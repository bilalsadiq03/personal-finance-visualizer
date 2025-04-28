import CategoryForm from "@/components/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Category</h1>
      <div className="max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  )
}
