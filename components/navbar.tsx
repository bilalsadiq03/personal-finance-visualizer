"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, PieChart, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: DollarSign,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: PieChart,
    },
    {
      name: "Budgets",
      href: "/budgets",
      icon: Target,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <DollarSign className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Finance Visualizer</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-foreground/60",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.name}</span>
              </Link>
            ))}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
