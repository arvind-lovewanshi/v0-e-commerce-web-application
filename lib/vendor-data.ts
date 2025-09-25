import { mockProducts, mockOrders } from "./data"
import type { Product, Order } from "./data"

export async function getVendorProducts(vendorId: string): Promise<Product[]> {
  return mockProducts.filter((product) => product.vendorId === vendorId)
}

export async function getVendorOrders(vendorId: string): Promise<Order[]> {
  // Get orders that contain products from this vendor
  const vendorProducts = await getVendorProducts(vendorId)
  const vendorProductIds = vendorProducts.map((p) => p.id)

  return mockOrders.filter((order) => order.items.some((item) => vendorProductIds.includes(item.productId)))
}

export async function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
  const productIndex = mockProducts.findIndex((p) => p.id === productId)
  if (productIndex !== -1) {
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updates,
      updatedAt: new Date(),
    }
    return true
  }
  return false
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const productIndex = mockProducts.findIndex((p) => p.id === productId)
  if (productIndex !== -1) {
    mockProducts.splice(productIndex, 1)
    return true
  }
  return false
}
