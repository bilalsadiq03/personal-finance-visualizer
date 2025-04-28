"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Transaction, Category } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsRes, categoriesRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/categories"),
        ])

        if (transactionsRes.ok && categoriesRes.ok) {
          const [transactionsData, categoriesData] = await Promise.all([transactionsRes.json(), categoriesRes.json()])

          setTransactions(transactionsData)
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  function getCategoryName(categoryId?: string) {
    if (!categoryId) return "Uncategorized"
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  function getCategoryColor(categoryId?: string) {
    if (!categoryId) return "#CBD5E0"
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.color : "#CBD5E0"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Loading transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">No transactions found</div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-2 h-10 rounded-full"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  />
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM d, yyyy")} • {getCategoryName(transaction.category)}
                    </p>
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(transaction.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/transactions">
            View All Transactions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
