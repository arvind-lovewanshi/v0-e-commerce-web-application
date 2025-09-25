"use client"

import { useEffect, useState } from "react"
import { VendorLayout } from "@/components/vendor/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getVendorProducts, getVendorOrders } from "@/lib/vendor-data"
import type { Product, Order } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye } from "lucide-react"

export default function VendorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as Order[],
    topProducts: [] as Product[],
  })

  useEffect(() => {
    async function loadStats() {
      if (!user) return

      const [products, orders] = await Promise.all([getVendorProducts(user.id), getVendorOrders(user.id)])

      const totalRevenue = orders.reduce((sum, order) => {
        return (
          sum +
          order.items
            .filter((item) => products.some((p) => p.id === item.productId))
            .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
        )
      }, 0)

      const recentOrders = orders.slice(-5).reverse()

      // Get top products by order frequency
      const productOrderCount = new Map<string, number>()
      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (products.some((p) => p.id === item.productId)) {
            productOrderCount.set(item.productId, (productOrderCount.get(item.productId) || 0) + item.quantity)
          }
        })
      })

      const topProducts = products
        .map((product) => ({
          ...product,
          orderCount: productOrderCount.get(product.id) || 0,
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 3)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders,
        topProducts,
      })
    }

    loadStats()
  }, [user])

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Listed products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders received",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "All time earnings",
    },
  ]

  return (
    <VendorLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Vendor Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Monitor your store performance and manage your products</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest orders for your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.userName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p
                          className={`text-sm capitalize ${
                            order.status === "delivered"
                              ? "text-green-500"
                              : order.status === "processing"
                                ? "text-blue-500"
                                : order.status === "shipped"
                                  ? "text-purple-500"
                                  : "text-yellow-500"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Top Products
              </CardTitle>
              <CardDescription>Your best-selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.orderCount} sold</p>
                        <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No products yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  )
}
