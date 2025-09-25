"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getCart, addToCart as addToCartUtil, updateCartItemQuantity, removeFromCart, clearCart } from "@/lib/cart"
import type { Cart, CartItem } from "@/lib/cart"

interface CartContextType extends Cart {
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 })

  useEffect(() => {
    setCart(getCart())
  }, [])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const updatedCart = addToCartUtil(item, quantity)
    setCart(updatedCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity)
    setCart(updatedCart)
  }

  const removeItem = (productId: string) => {
    const updatedCart = removeFromCart(productId)
    setCart(updatedCart)
  }

  const clear = () => {
    const updatedCart = clearCart()
    setCart(updatedCart)
  }

  return (
    <CartContext.Provider
      value={{
        ...cart,
        addToCart,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
