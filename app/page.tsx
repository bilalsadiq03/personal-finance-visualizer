"use client"
import { DollarSign, CreditCard, TrendingUp, ArrowDownUp } from "lucide-react"
import { useState, useEffect } from "react"

import SummaryCard from "@/components/summary-card"
import MonthlyExpensesChart from "@/components/monthly-expenses-chart"
import CategoryPieChart from "@/components/category-pie-chart"
import BudgetInsights from "@/components/budget-insights"
import RecentTransactions from "@/components/recent-transactions"
import { Summary } from "@/lib/types"




export default function Dashboard() {

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/transactions/summary");
        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Expenses"
          value={summary?.totalExpenses?.toString() || "0"}
          description="This month"
          icon={DollarSign}
          // trend={{ value: 12, isPositive: false }}
        />
        <SummaryCard
          title="Total Income"
          value={summary?.totalIncome?.toString() || "0"}
          description="This month"
          icon={CreditCard}
        />
        <SummaryCard
          title="Net Savings"
          value={summary?.netSavings?.toString() || "0"}
          description="This month"
          icon={TrendingUp}
        />
        <SummaryCard 
          title="Transactions" 
          value={summary?.totalTransactions?.toString() || "0"} 
          description="This month" 
          icon={ArrowDownUp} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BudgetInsights />
        <RecentTransactions />
      </div>
    </div>
  )
}
