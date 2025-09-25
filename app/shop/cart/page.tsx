"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { createOrder } from "@/lib/orders"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clear } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
      return
    }
    updateQuantity(productId, newQuantity)
  }

  const handleCheckout = async () => {
    if (items.length === 0 || !user) return

    setIsCheckingOut(true)

    try {
      // Convert cart items to order items
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }))

      // Create the order
      const order = await createOrder(user.id, user.name, user.email, orderItems)

      // Clear the cart
      clear()

      toast({
        title: "Order placed successfully!",
        description: `Your order ${order.id} has been placed and is being processed.`,
      })

      // Redirect to orders page
      router.push("/shop/orders")
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-background">
        <ShopHeader />

        <main className="container py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-balance">Shopping Cart</h1>
              <p className="text-muted-foreground text-pretty">
                {itemCount > 0 ? `${itemCount} items in your cart` : "Your cart is empty"}
              </p>
            </div>

            {items.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-center mb-4">Add some products to get started</p>
                  <Link href="/shop">
                    <Button>Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <Card key={item.productId}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.productName}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-medium">{item.productName}</h3>
                              <p className="text-sm text-muted-foreground">by {item.vendorName}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(item.productId, Number.parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 text-center"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                <Button size="sm" variant="destructive" onClick={() => removeItem(item.productId)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal ({itemCount} items)</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                        {isCheckingOut ? "Processing..." : "Place Order"}
                      </Button>

                      <Link href="/shop">
                        <Button variant="outline" className="w-full bg-transparent">
                          Continue Shopping
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
