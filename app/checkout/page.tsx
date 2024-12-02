'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/app/components/cart-context'
import { useUser, SignIn } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { countries } from '@/lib/countries'
import { createCheckoutSession, Metadata } from '../api/create-checkout-session/createCheckSession'
import { nanoid } from 'nanoid'
import { ArrowLeft } from 'lucide-react'

// // Add CartItem type
// interface CartItem {
//   _id: string
//   name: string
//   price: number
//   quantity: number
//   imageUrl: string
//   currency: string
//   options?: {
//     color?: string
//     size?: string
//   }
//   variant?: {
//     color: string
//     imageUrl: string
//     selectedSize?: {
//       name: string
//       quantity: number
//     }
//   }
// }

export default function Checkout() {
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  const { toast } = useToast()
  const { cart, getCartTotal } = useCart()
  const [total, setTotal] = useState(getCartTotal())
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
  })
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    setTotal(getCartTotal())
  }, [cart, getCartTotal])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your purchase",
        variant: "destructive",
      })
      router.push('/checkout')
      return
    }

    try {
      const metadata : Metadata = {
        orderNumber: nanoid(10),
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phoneNumber,
        customerAddress: formData.address,
        clerkUserId: user?.id,
      }

      // Convert cart items to GroupedCartItem format
      const groupedItems = cart.map(item => ({
        product: {
          ...item.product,
          variants: item.variants,  // Include the selected variants
          sizes: item.sizes        // Include the selected sizes
        },
        quantity: item.quantity
      }));

      const checkoutSession = await createCheckoutSession(groupedItems, metadata)

      if (checkoutSession) {
        window.location.href = checkoutSession
      }
    } catch (error) {
      console.error('Error: Creating checkout session', error)  
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      })
    }
  }

  
    // try {
    //   const response = await fetch('/api/create-checkout-session', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       items: cart,
    //       userData: {
    //         ...formData,
    //         email: user?.emailAddresses[0]?.emailAddress || formData.email,
    //         userId: user?.id,
    //         shippingAddress: {
    //           firstName: formData.firstName,
    //           lastName: formData.lastName,
    //           address: formData.address,
    //           city: formData.city,
    //           postalCode: formData.postalCode,
    //           country: formData.country,
    //           phoneNumber: formData.phoneNumber,
    //         }
    //       },
    //     }),
    //   })

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok')
    //   }

    //   const { sessionUrl } = await response.json()
    //   window.location.href = sessionUrl
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Something went wrong. Please try again later.",
    //     variant: "destructive",
    //   })
    //   console.error('Error:', error)
    // }
  // }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center mb-3 sm:mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/cart')}
          className="text-beige-600 hover:text-beige-800 -ml-2"
        >
          <span className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
          </span>
        </Button>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-beige-900 mb-4 sm:mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Order Summary - Moved to top on mobile */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="bg-beige-100 rounded-lg shadow-md p-3 sm:p-6 sticky top-[76px]">
            <h2 className="text-lg sm:text-xl font-semibold text-beige-900 mb-3 sm:mb-4">Order Summary</h2>
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => {
                const itemKey = `${item.product._id}-${item.variants?.[0]?.color || 'default'}-${item.sizes?.[0]?.name || 'default'}`;
                
                return (
                  <div key={itemKey} className="flex items-start space-x-2 sm:space-x-4 border-b border-beige-200 pb-3 sm:pb-4">
                    <div className="relative w-16 sm:w-20 aspect-square flex-shrink-0">
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
                        <div className="text-xs sm:text-sm text-beige-600 mt-0.5">
                          {item.variants?.[0]?.color && (
                            <p>Color: {item.variants[0].color}</p>
                          )}
                          {item.sizes?.[0]?.name && (
                            <p>Size: {item.sizes[0].name}</p>
                          )}
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-beige-600 mt-0.5">
                        {item.product.currency}{item.product.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base text-beige-800 font-light">
                      {item.product.currency}{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-beige-200 my-3 sm:my-4"></div>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-beige-700">Subtotal</span>
                <span className="text-beige-900">
                  {cart[0]?.product?.currency || 'JPY'}{total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-beige-700">Shipping</span>
                <span className="text-beige-900">Free</span>
              </div>
              <div className="border-t border-beige-200 my-2 sm:my-3"></div>
              <div className="flex justify-between">
                <span className="font-semibold text-beige-900">Total</span>
                <span className="font-semibold text-beige-900">
                  {cart[0]?.product?.currency || 'JPY'}{(total + 10).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="bg-beige-100 rounded-lg shadow-md p-3 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-beige-900 mb-3 sm:mb-4">
              Shipping Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {!isSignedIn ? (
                <div className="text-center py-4 sm:py-8">
                  {showSignIn ? (
                    <SignIn 
                      afterSignInUrl="/checkout"
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "mx-auto",
                          card: "bg-white shadow-md rounded-lg"
                        }
                      }}
                    />
                  ) : (
                    <>
                      <p className="text-sm sm:text-base text-beige-700 mb-4">
                        Please sign in to continue with your purchase
                      </p>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full max-w-md text-sm sm:text-base"
                        onClick={() => setShowSignIn(true)}
                      >
                        Sign In to Continue
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        required 
                        value={formData.firstName} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        required 
                        value={formData.lastName} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" required value={formData.phoneNumber} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      name="country" 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange({ target: { name: 'country', value } } as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full mt-6 sm:mt-8 text-sm sm:text-base py-5 sm:py-6"
                  >
                    Proceed to Payment
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
  
