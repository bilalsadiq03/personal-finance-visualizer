import TransactionForm from "@/components/transaction-form"

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Transaction</h1>
      <div className="max-w-2xl">
        <TransactionForm />
      </div>
    </div>
  )
}
