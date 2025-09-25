"use client"

import { useEffect, useState } from "react"
import { VendorLayout } from "@/components/vendor/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getVendorOrders, getVendorProducts } from "@/lib/vendor-data"
import type { Order, Product } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart } from "lucide-react"

export default function VendorOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user) return

      const [orderData, productData] = await Promise.all([getVendorOrders(user.id), getVendorProducts(user.id)])

      setOrders(orderData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      setProducts(productData)
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

  const getVendorItemsFromOrder = (order: Order) => {
    const vendorProductIds = products.map((p) => p.id)
    return order.items.filter((item) => vendorProductIds.includes(item.productId))
  }

  const getVendorOrderTotal = (order: Order) => {
    const vendorItems = getVendorItemsFromOrder(order)
    return vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Orders</h1>
          <p className="text-muted-foreground text-pretty">Track orders containing your products</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center">Orders containing your products will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const vendorItems = getVendorItemsFromOrder(order)
              const vendorTotal = getVendorOrderTotal(order)

              if (vendorItems.length === 0) return null

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {order.id}
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {order.userName} • {order.userEmail}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${vendorTotal.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Your earnings</p>
                        <p className="text-xs text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Your Items in this Order:</h4>
                        <div className="space-y-1">
                          {vendorItems.map((item, index) => (
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
                          Order Total: ${order.total.toFixed(2)} • Last updated: {order.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </VendorLayout>
  )
}
