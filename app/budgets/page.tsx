import BudgetList from "@/components/budget-list"

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budgets</h1>
      <BudgetList />
    </div>
  )
}
