export interface Transaction {
  _id?: string
  amount: number
  date: string
  description: string
  category?: string
}

export interface Category {
  _id?: string
  name: string
  color: string
}

export interface Budget {
  _id?: string
  categoryId: string
  amount: number
  month: number
  year: number
}

export interface CategoryWithBudget extends Category {
  budget?: number
  spent?: number
  percentage?: number
}

export interface MonthlyExpense {
  month: string
  amount: number
}

export interface CategoryExpense {
  category: string
  amount: number
  color: string
}

export interface BudgetComparison {
  category: string
  budget: number
  actual: number
  color: string
}

export interface Summary {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}
