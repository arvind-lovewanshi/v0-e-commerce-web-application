"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getOrders, updateOrderStatus } from "@/lib/data"
import type { Order } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadOrders() {
      const orderData = await getOrders()
      setOrders(orderData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      setLoading(false)
    }
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    const success = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order)),
      )
      toast({
        title: "Status updated",
        description: "Order status has been successfully updated",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Order Management</h1>
          <p className="text-muted-foreground text-pretty">Track and manage all customer orders</p>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
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
                    <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Items:</h4>
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
                    <Select
                      value={order.status}
                      onValueChange={(value: Order["status"]) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
