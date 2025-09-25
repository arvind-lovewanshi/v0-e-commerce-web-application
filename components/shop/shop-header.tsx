"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { ShoppingCart, LogOut, Store, Package } from "lucide-react"
import Link from "next/link"

export function ShopHeader() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/shop" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">E-Commerce</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/shop/orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </Button>
          </Link>

          <Link href="/shop/cart">
            <Button variant="ghost" size="sm" className="relative gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">{user.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
