"use client"

import { useEffect, useState } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserOrders } from "@/lib/orders"
import type { Order } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { Package, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user) return
      const orderData = await getUserOrders(user.id)
      setOrders(orderData)
      setLoading(false)
    }
    loadOrders()
  }, [user])

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-500"
      case "shipped":
        return "text-purple-500"
      case "processing":
        return "text-blue-500"
      case "pending":
        return "text-yellow-500"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="min-h-screen bg-background">
          <ShopHeader />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-background">
        <ShopHeader />

        <main className="container py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-balance">My Orders</h1>
              <p className="text-muted-foreground text-pretty">Track your order history and status</p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground text-center mb-4">Start shopping to see your orders here</p>
                  <Link href="/shop">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {order.id}
                            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </CardTitle>
                          <CardDescription>
                            Placed on {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                          <p className={`text-sm capitalize ${getStatusColor(order.status)}`}>{order.status}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Items ({order.items.length}):</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.productName} × {item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            Last updated: {order.updatedAt.toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Status: </span>
                            <span className={`capitalize font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
