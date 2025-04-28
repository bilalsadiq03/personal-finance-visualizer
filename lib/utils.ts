import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function calculateTrend(
  current: number,
  previous: number,
): {
  value: number
  isPositive: boolean
} {
  if (previous === 0) return { value: 0, isPositive: false }

  const difference = current - previous
  const percentage = Math.abs(Math.round((difference / previous) * 100))

  return {
    value: percentage,
    isPositive: difference >= 0,
  }
}
