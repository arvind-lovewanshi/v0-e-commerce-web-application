export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
  vendorName: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0, itemCount: 0 }
  }

  const cartData = localStorage.getItem("cart")
  if (!cartData) {
    return { items: [], total: 0, itemCount: 0 }
  }

  const items: CartItem[] = JSON.parse(cartData)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, total, itemCount }
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1): Cart {
  const cart = getCart()
  const existingItemIndex = cart.items.findIndex((cartItem) => cartItem.productId === item.productId)

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity
  } else {
    cart.items.push({ ...item, quantity })
  }

  const updatedCart = {
    items: cart.items,
    total: cart.items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
    itemCount: cart.items.reduce((sum, cartItem) => sum + cartItem.quantity, 0),
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart.items))
  return updatedCart
}

export function updateCartItemQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()
  const itemIndex = cart.items.findIndex((item) => item.productId === productId)

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }

  const updatedCart = {
    items: cart.items,
    total: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart.items))
  return updatedCart
}

export function removeFromCart(productId: string): Cart {
  return updateCartItemQuantity(productId, 0)
}

export function clearCart(): Cart {
  localStorage.removeItem("cart")
  return { items: [], total: 0, itemCount: 0 }
}
