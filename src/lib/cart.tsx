'use client'

import React, { createContext, useContext, useState } from 'react'

// ─── Types ───────────────────────────────────────────────

export type CartItem = {
  productId: string
  name: string
  slug: string
  price: number // in cents
  size?: string
  quantity: number
  stock: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

// ─── Context Creation ────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined)

// ─── Cart Provider ───────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.size === item.size
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        )
      }

      return [...prevItems, item]
    })
  }

  const removeFromCart = (productId: string, size?: string) => {
    setItems((prevItems) =>
      prevItems.filter((i) => !(i.productId === productId && i.size === size))
    )
  }

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) }
          : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── useCart Hook ─────────────────────────────────────────

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
