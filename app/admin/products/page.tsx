"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/lib/data"
import type { Product } from "@/lib/data"
import { Package } from "lucide-react"
import Image from "next/image"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const productData = await getProducts()
      setProducts(productData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      setLoading(false)
    }
    loadProducts()
  }, [])

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
          <h1 className="text-3xl font-bold text-balance">Product Management</h1>
          <p className="text-muted-foreground text-pretty">Monitor all products across vendors</p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground text-center">Products from vendors will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Vendor:</span>
                        <span className="font-medium">{product.vendorName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Stock:</span>
                        <span
                          className={
                            product.stock > 10
                              ? "text-green-500"
                              : product.stock > 0
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                        >
                          {product.stock} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Added:</span>
                        <span>{product.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
