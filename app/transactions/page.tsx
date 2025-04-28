import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import TransactionList from "@/components/transaction-list"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Link>
        </Button>
      </div>

      <TransactionList />
    </div>
  )
}
