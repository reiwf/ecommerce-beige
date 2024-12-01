'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { client } from '@/sanity/lib/client'
import { PRODUCT_FOR_CART_QUERY } from '@/sanity/lib/queries'
import { Product, GalleryImage, ColorVariant, Size } from '@/lib/products'

export interface CartItem {
  product: Product;
  quantity: number;
  imageUrl: string;
  gallery?: GalleryImage[];
  variants?: ColorVariant[];
  sizes?: Size[];
  };



interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  validateAndAddToCart: (
    productId: string,
    quantity: number,
    options?: { color?: string; size?: string }
  ) => Promise<void>
  removeFromCart: (_id: string, color?: string, size?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  getGroupedItems: () => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.product._id === item.product._id && 
          cartItem.variants?.[0]?.color === item.variants?.[0]?.color &&
          cartItem.sizes?.[0]?.name === item.sizes?.[0]?.name
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        return updatedCart
      }
      return [...prevCart, item]
    })
  }

  const removeFromCart = (_id: string, color?: string, size?: string) => {
    setCart((prevCart) => 
      prevCart.filter((item) => {
        if (color && size) {
          return !(
            item.product._id === _id && 
            item.variants?.[0]?.color === color &&
            item.sizes?.[0]?.name === size
          );
        }
        return item.product._id !== _id;
      })
    );
  };

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const validateAndAddToCart = async (
    productId: string,
    quantity: number,
    options?: { variant?: string; size?: string }
  ) => {
    try {
      const product = await client.fetch(PRODUCT_FOR_CART_QUERY, { productId })
      
      if (!product) {
        throw new Error('Product not found')
      }

      let selectedVariant;
      if (options?.variant) {
        selectedVariant = product.variants?.find(
          (v: any) => v.color === options.variant
        );
      }

      const cartItem: CartItem = {
        product: product,
        quantity: quantity,
        imageUrl: product.imageUrl || product.images?.[0]?.url || '',
        variants: selectedVariant ? [selectedVariant] : undefined,
        sizes: selectedVariant?.sizes ? [selectedVariant.sizes[0]] : undefined,
      };    
      addToCart(cartItem);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  };

  const getGroupedItems = () => {
    return cart;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        validateAndAddToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getGroupedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
