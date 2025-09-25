"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Users, Store, ShoppingCart, BarChart3, Settings, LogOut, Package } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Vendors",
    href: "/admin/vendors",
    icon: Store,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-left",
                    isActive && "bg-secondary text-secondary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{user?.name?.charAt(0) || "A"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-left" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
