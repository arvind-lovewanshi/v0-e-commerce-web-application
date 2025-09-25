import { mockOrders } from "./data"
import type { Order, OrderItem } from "./data"

export async function createOrder(
  userId: string,
  userName: string,
  userEmail: string,
  items: OrderItem[],
): Promise<Order> {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    userName,
    userEmail,
    items,
    total,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockOrders.push(newOrder)
  return newOrder
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  return mockOrders
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  return mockOrders.find((order) => order.id === orderId) || null
}
