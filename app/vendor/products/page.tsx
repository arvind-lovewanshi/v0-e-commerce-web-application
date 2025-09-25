"use client"

import { useEffect, useState } from "react"
import { VendorLayout } from "@/components/vendor/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVendorProducts, deleteProduct } from "@/lib/vendor-data"
import type { Product } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VendorProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadProducts() {
      if (!user) return
      const productData = await getVendorProducts(user.id)
      setProducts(productData)
      setLoading(false)
    }
    loadProducts()
  }, [user])

  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId)
    if (success) {
      setProducts(products.filter((p) => p.id !== productId))
      toast({
        title: "Product deleted",
        description: "Product has been successfully removed",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">My Products</h1>
            <p className="text-muted-foreground text-pretty">Manage your product catalog</p>
          </div>
          <Link href="/vendor/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground text-center mb-4">Start by adding your first product to your store</p>
              <Link href="/vendor/products/new">
                <Button>Add Your First Product</Button>
              </Link>
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

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span
                        className={
                          product.stock > 10 ? "text-green-500" : product.stock > 0 ? "text-yellow-500" : "text-red-500"
                        }
                      >
                        {product.stock} units
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  )
}
