"use client"

import { useEffect, useState } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProductCard } from "@/components/shop/product-card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProducts } from "@/lib/data"
import type { Product } from "@/lib/data"
import { Search, Filter } from "lucide-react"

const categories = ["All", "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Books", "Health & Beauty"]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    async function loadProducts() {
      const productData = await getProducts()
      setProducts(productData)
      setFilteredProducts(productData)
      setLoading(false)
    }
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.vendorName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <div className="min-h-screen bg-background">
          <ShopHeader />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-background">
        <ShopHeader />

        <main className="container py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-balance">Shop Products</h1>
              <p className="text-muted-foreground text-pretty">Discover amazing products from our vendors</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found matching your criteria</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
