import type { User, UserRole } from "./auth"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  vendorId: string
  vendorName: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Vendor {
  id: string
  name: string
  email: string
  businessName: string
  status: "active" | "pending" | "suspended"
  totalProducts: number
  totalOrders: number
  createdAt: Date
}

// Mock data for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@ecommerce.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "vendor@ecommerce.com",
    name: "Vendor User",
    role: "vendor",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    email: "user@ecommerce.com",
    name: "Regular User",
    role: "user",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "user",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "5",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "vendor",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

export const mockVendors: Vendor[] = [
  {
    id: "2",
    name: "Vendor User",
    email: "vendor@ecommerce.com",
    businessName: "Tech Solutions Inc",
    status: "active",
    totalProducts: 15,
    totalOrders: 42,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    businessName: "Fashion Forward",
    status: "active",
    totalProducts: 8,
    totalOrders: 23,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "6",
    name: "Mike Johnson",
    email: "mike@homegoods.com",
    businessName: "Home & Garden Co",
    status: "pending",
    totalProducts: 0,
    totalOrders: 0,
    createdAt: new Date("2024-03-15"),
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    stock: 50,
    vendorId: "2",
    vendorName: "Tech Solutions Inc",
    imageUrl: "/wireless-headphones.png",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 299.99,
    category: "Electronics",
    stock: 25,
    vendorId: "2",
    vendorName: "Tech Solutions Inc",
    imageUrl: "/smartwatch-lifestyle.png",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "3",
    name: "Designer Jacket",
    description: "Premium leather jacket with modern styling",
    price: 449.99,
    category: "Fashion",
    stock: 12,
    vendorId: "5",
    vendorName: "Fashion Forward",
    imageUrl: "/classic-leather-jacket.png",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "3",
    userName: "Regular User",
    userEmail: "user@ecommerce.com",
    items: [
      {
        productId: "1",
        productName: "Wireless Headphones",
        quantity: 1,
        price: 199.99,
      },
    ],
    total: 199.99,
    status: "delivered",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "ORD-002",
    userId: "4",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    items: [
      {
        productId: "2",
        productName: "Smart Watch",
        quantity: 1,
        price: 299.99,
      },
      {
        productId: "1",
        productName: "Wireless Headphones",
        quantity: 1,
        price: 199.99,
      },
    ],
    total: 499.98,
    status: "processing",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-06"),
  },
  {
    id: "ORD-003",
    userId: "3",
    userName: "Regular User",
    userEmail: "user@ecommerce.com",
    items: [
      {
        productId: "3",
        productName: "Designer Jacket",
        quantity: 1,
        price: 449.99,
      },
    ],
    total: 449.99,
    status: "shipped",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-12"),
  },
]

// API functions for data management
export async function getUsers(): Promise<User[]> {
  return mockUsers
}

export async function getVendors(): Promise<Vendor[]> {
  return mockVendors
}

export async function getProducts(): Promise<Product[]> {
  return mockProducts
}

export async function getOrders(): Promise<Order[]> {
  return mockOrders
}

export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    mockUsers[userIndex].role = role
    mockUsers[userIndex].updatedAt = new Date()
    return true
  }
  return false
}

export async function updateVendorStatus(
  vendorId: string,
  status: "active" | "pending" | "suspended",
): Promise<boolean> {
  const vendorIndex = mockVendors.findIndex((v) => v.id === vendorId)
  if (vendorIndex !== -1) {
    mockVendors[vendorIndex].status = status
    return true
  }
  return false
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<boolean> {
  const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status
    mockOrders[orderIndex].updatedAt = new Date()
    return true
  }
  return false
}
