'use client'

import { useState, useEffect, useCallback } from 'react'
import { CartItem, useCart } from '@/app/components/cart-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_ID_QUERY} from '@/sanity/lib/queries'
import { useToast } from "@/hooks/use-toast"
import {  Size, ColorVariant } from '@/lib/products'
import { ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, addToCart } = useCart()
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // Add this function to check and fix quantities on component mount
  const validateCartQuantities = useCallback(async () => {
    for (const item of cart) {
      try {
        const productId = item.product._id;
        const productData = await client.fetch<CartItem>(PRODUCT_BY_ID_QUERY, { id: productId });
        
        if (!productData?.variants) continue;

        const variant = productData.variants.find(
          (v: ColorVariant) => v.color === item.variants?.[0]?.color
        );
        
        if (!variant) continue;

        const sizeData = variant.sizes.find(
          (s: Size) => s.name === item.sizes?.[0]?.name
        );
        
        if (!sizeData) continue;

        const availableQuantity = sizeData.quantity;

        if (item.quantity > availableQuantity) {
          removeFromCart(
            item.product._id,
            item.variants?.[0]?.color,
            item.sizes?.[0]?.name
          );
          
          addToCart({
            product: item.product,
            quantity: availableQuantity,
            imageUrl: item.imageUrl,
            variants: item.variants,    // Preserve variants
            sizes: item.sizes,         // Preserve sizes
            gallery: item.gallery      // Preserve gallery
          });
          
          toast({
            title: "Quantity Adjusted",
            description: `Quantity for ${item.product.name} (${item.variants?.[0]?.color}) has been adjusted to match available stock (${availableQuantity})`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error validating cart quantity:', error);
      }
    }
  }, [cart, removeFromCart, addToCart, toast])

  // Add useEffect to validate quantities on mount
  useEffect(() => {
    validateCartQuantities()
  }, [cart, removeFromCart, addToCart, toast, validateCartQuantities])

  const updateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setLoading(prev => ({ ...prev, [item.product._id]: true }));
      
      const productId = item.product._id;
      const productData = await client.fetch(PRODUCT_BY_ID_QUERY, { id: productId });
      
      if (!productData || !productData.variants) {
        throw new Error('Product data not found');
      }

      // Find the selected color variant
      const variant = productData.variants.find(
        (v: ColorVariant) => v.color === item.variants?.[0]?.color
      );

      if (!variant) {
        throw new Error('Variant not found');
      }

      // Find the size in the variant
      const sizeData = variant.sizes.find(
        (s: Size) => s.name === item.sizes?.[0]?.name
      );

      if (!sizeData) {
        throw new Error('Size not found');
      }

      const availableQuantity = sizeData.quantity;

      // Check if the new quantity would exceed available stock
      if (newQuantity > availableQuantity) {
        toast({
          variant: "destructive",
          title: "Stock limit reached",
          description: `Only ${availableQuantity} items available in stock`
        });
        return;
      }

      // Remove the old item and add it back with new quantity
      removeFromCart(
        item.product._id,
        item.variants?.[0]?.color,
        item.sizes?.[0]?.name
      );
      
      addToCart({
        product: item.product,
        quantity: newQuantity,
        imageUrl: item.imageUrl,
        variants: item.variants,    // Preserve variants
        sizes: item.sizes,         // Preserve sizes
        gallery: item.gallery      // Preserve gallery
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update quantity'
      });
    } finally {
      setLoading(prev => ({ ...prev, [item.product._id]: false }));
    }
  };
  return (  
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center mb-3 sm:mb-6">
        <Button 
          variant="ghost" 
          className="text-beige-600 hover:text-beige-800 -ml-2" 
          asChild
        >
          <Link href="/products" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Products</span>
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-beige-900 mb-4 sm:mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-beige-700 mb-4">Your cart is empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Cart items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-beige-100 rounded-lg shadow-md p-3 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-beige-900 mb-3 sm:mb-4">Cart Items</h2>
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => {
                  const itemKey = `${item.product._id}-${item.variants?.[0]?.color || 'default'}-${item.sizes?.[0]?.name || 'default'}`;
                  
                  return (
                    <div key={itemKey} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-beige-200 pb-3 sm:pb-4">
                      <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                        <div className="relative w-20 sm:w-28 aspect-square flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm sm:text-base text-beige-800 font-semibold">{item.product.name}</h3>
                          {(item.variants?.[0]?.color || item.sizes?.[0]?.name) && (
                            <div className="text-xs sm:text-sm text-beige-600 mt-1">
                              {item.variants?.[0]?.color && (
                                <p>Color: {item.variants[0].color}</p>
                              )}
                              {item.sizes?.[0]?.name && (
                                <p>Size: {item.sizes[0].name}</p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1 sm:gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item, item.quantity - 1)}
                              disabled={loading[item.product._id] || item.quantity <= 1}
                              className="h-6 w-6 sm:h-8 sm:w-8 bg-white"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                              disabled={loading[item.product._id]}
                              className="h-6 w-6 sm:h-8 sm:w-8 bg-white"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between sm:flex-col sm:items-end gap-2">
                        <p className="text-sm sm:text-base text-beige-800 font-light">
                          {item.product.currency || 'JPY'} {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromCart(item.product._id)}
                          className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 bg-white"
                          disabled={loading[item.product._id]}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-beige-100 rounded-lg shadow-md p-3 sm:p-6 sticky top-[76px]">
              <h2 className="text-lg sm:text-xl font-semibold text-beige-900 mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base text-beige-700">
                  <span>Subtotal</span>
                  <span>JPY {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-beige-700">
                  <span>Shipping</span>
                  <span>{getCartTotal() > 10000 ? 'Free' : 'JPY 800'}</span>
                </div>
                <div className="border-t border-beige-200 my-2 sm:my-3"></div>
                <div className="flex justify-between text-base sm:text-lg font-semibold text-beige-900">
                  <span>Total</span>
                  <span>
                    JPY {(getCartTotal() + (getCartTotal() > 10000 ? 0 : 800)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button variant="outline" className="w-full text-sm sm:text-base" asChild>
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
                <Button className="w-full text-sm sm:text-base" asChild>
                  <Link href="/checkout">
                    Checkout
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

