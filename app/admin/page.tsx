"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, getVendors, getOrders, getProducts } from "@/lib/data"
import type { Order } from "@/lib/data"
import { Users, Store, ShoppingCart, Package, TrendingUp, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [] as Order[],
  })

  useEffect(() => {
    async function loadStats() {
      const [users, vendors, orders, products] = await Promise.all([
        getUsers(),
        getVendors(),
        getOrders(),
        getProducts(),
      ])

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const recentOrders = orders.slice(-5).reverse()

      setStats({
        totalUsers: users.filter((u) => u.role === "user").length,
        totalVendors: vendors.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders,
      })
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Active customers",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Store,
      description: "Registered sellers",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "All time orders",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Listed products",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "All time revenue",
    },
  ]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard Overview</h1>
          <p className="text-muted-foreground text-pretty">
            Monitor your e-commerce platform performance and key metrics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">View and edit user accounts</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <p className="font-medium">Review Vendors</p>
                  <p className="text-sm text-muted-foreground">Approve pending vendor applications</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <p className="font-medium">Process Orders</p>
                  <p className="text-sm text-muted-foreground">Update order statuses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
