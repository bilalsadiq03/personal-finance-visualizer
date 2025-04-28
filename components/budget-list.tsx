"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Budget, Category, CategoryWithBudget } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function BudgetList() {
  const router = useRouter()
  const { toast } = useToast()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
          fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`),
          fetch("/api/categories"),
          fetch("/api/transactions"),
        ])

        if (budgetsRes.ok && categoriesRes.ok && transactionsRes.ok) {
          const [budgetsData, categoriesData, transactionsData] = await Promise.all([
            budgetsRes.json(),
            categoriesRes.json(),
            transactionsRes.json(),
          ])

          setBudgets(budgetsData)
          setCategories(categoriesData)
          setTransactions(transactionsData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load budgets",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast, selectedMonth, selectedYear])

  async function deleteBudget() {
    if (!budgetToDelete) return

    try {
      const response = await fetch(`/api/budgets/${budgetToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBudgets(budgets.filter((b) => b._id !== budgetToDelete))
        toast({
          title: "Budget deleted",
          description: "The budget has been deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete budget")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      })
    } finally {
      setBudgetToDelete(null)
    }
  }

  function getCategoryName(categoryId: string) {
    const category = categories.find((c) => c._id === categoryId)
    return category ? category.name : "Unknown"
  }

  function getCategoryWithBudgets(): CategoryWithBudget[] {
    return categories.map((category) => {
      const budget = budgets.find((b) => b.categoryId === category._id)

      // Filter transactions for this category and month/year
      const startDate = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-01`
      const endDate = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-31`

      const categoryTransactions = transactions.filter(
        (t) => t.category === category._id && t.date >= startDate && t.date <= endDate,
      )

      const spent = categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

      const budgetAmount = budget?.amount || 0
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

      return {
        ...category,
        budget: budgetAmount,
        spent,
        percentage,
      }
    })
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() + i - 2)

  const categoriesWithBudgets = getCategoryWithBudgets().filter((c) => c.budget > 0)

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading budgets...</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-40">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button asChild>
          <Link href="/budgets/new">
            <Plus className="mr-2 h-4 w-4" /> Add Budget
          </Link>
        </Button>
      </div>

      {categoriesWithBudgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4 text-muted-foreground">No budgets found for this month</p>
          <Button asChild>
            <Link href="/budgets/new">Add Your First Budget</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesWithBudgets.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.budget)}</TableCell>
                  <TableCell>{formatCurrency(item.spent)}</TableCell>
                  <TableCell>{formatCurrency(item.budget - item.spent)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={Math.min(item.percentage, 100)}
                        className="h-2"
                        indicatorClassName={
                          item.percentage > 100 ? "bg-destructive" : item.percentage > 80 ? "bg-warning" : undefined
                        }
                      />
                      <span className="text-xs w-12">{Math.round(item.percentage)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const budget = budgets.find((b) => b.categoryId === item._id)
                          if (budget) {
                            router.push(`/budgets/edit/${budget._id}`)
                          }
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const budget = budgets.find((b) => b.categoryId === item._id)
                              if (budget) {
                                setBudgetToDelete(budget._id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this budget? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setBudgetToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteBudget}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
