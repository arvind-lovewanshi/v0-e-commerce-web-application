"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      })
      return
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      vendorName: product.vendorName,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  return (
    <Card className="h-full flex flex-col">
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
        <div className="space-y-1">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">{product.description}</CardDescription>
          <p className="text-sm text-muted-foreground">by {product.vendorName}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <Badge variant="outline">{product.category}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock:</span>
            <span
              className={product.stock > 10 ? "text-green-500" : product.stock > 0 ? "text-yellow-500" : "text-red-500"}
            >
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </div>
        </div>

        <Button
          className="w-full mt-4 gap-2"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          variant={product.stock <= 0 ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  )
}
