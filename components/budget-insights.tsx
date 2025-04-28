"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CategoryWithBudget } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function BudgetInsights() {
  const [categories, setCategories] = useState<CategoryWithBudget[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const currentDate = new Date()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()

        const [categoriesRes, budgetsRes, transactionsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/budgets?month=${month}&year=${year}`),
          fetch("/api/transactions"),
        ])

        if (categoriesRes.ok && budgetsRes.ok && transactionsRes.ok) {
          const [categoriesData, budgetsData, transactionsData] = await Promise.all([
            categoriesRes.json(),
            budgetsRes.json(),
            transactionsRes.json(),
          ])

          // Process data to get insights
          const categoriesWithBudgets = categoriesData
            .map((category: any) => {
              const budget = budgetsData.find((b: any) => b.categoryId === category._id)

              // Filter transactions for this category and current month
              const startDate = `${year}-${month.toString().padStart(2, "0")}-01`
              const endDate = `${year}-${month.toString().padStart(2, "0")}-31`

              const categoryTransactions = transactionsData.filter(
                (t: any) => t.category === category._id && t.date >= startDate && t.date <= endDate,
              )

              const spent = categoryTransactions.reduce((sum: number, transaction: any) => sum + transaction.amount, 0)

              const budgetAmount = budget?.amount || 0
              const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

              return {
                ...category,
                budget: budgetAmount,
                spent,
                percentage,
              }
            })
            .filter((c: any) => c.budget > 0)

          setCategories(categoriesWithBudgets)
        }
      } catch (error) {
        console.error("Failed to fetch data for insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
          <CardDescription>Loading insights...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
          <CardDescription>No budget data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Set up budgets to see insights
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort categories by percentage (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.percentage - a.percentage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Insights</CardTitle>
        <CardDescription>Your spending against budgets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.slice(0, 3).map((category) => (
            <div key={category._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm">
                  {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress
                  value={Math.min(category.percentage, 100)}
                  className="h-2"
                  indicatorClassName={
                    category.percentage > 100 ? "bg-destructive" : category.percentage > 80 ? "bg-warning" : undefined
                  }
                />
                <span className="text-xs w-12">{Math.round(category.percentage)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {category.percentage > 100
                  ? `You've exceeded your ${category.name} budget by ${formatCurrency(category.spent - category.budget)}`
                  : category.percentage > 80
                    ? `You've spent ${Math.round(category.percentage)}% of your ${category.name} budget`
                    : `You have ${formatCurrency(category.budget - category.spent)} left in your ${category.name} budget`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
