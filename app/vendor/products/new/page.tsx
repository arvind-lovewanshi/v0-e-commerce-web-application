"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VendorLayout } from "@/components/vendor/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addProduct } from "@/lib/vendor-data"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
  "Automotive",
  "Other",
]

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        vendorId: user.id,
        vendorName: user.name,
        imageUrl:
          formData.imageUrl || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.name)}`,
      }

      await addProduct(productData)

      toast({
        title: "Product added",
        description: "Your product has been successfully added to your store",
      })

      router.push("/vendor/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <VendorLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Add New Product</h1>
            <p className="text-muted-foreground text-pretty">Create a new product listing for your store</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in the information about your product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty to auto-generate a placeholder image</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
                <Link href="/vendor/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  )
}
