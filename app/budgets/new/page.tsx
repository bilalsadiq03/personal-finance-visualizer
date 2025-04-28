import BudgetForm from "@/components/budget-form"

export default function NewBudgetPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Budget</h1>
      <div className="max-w-2xl">
        <BudgetForm />
      </div>
    </div>
  )
}
