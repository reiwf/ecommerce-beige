'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/app/components/cart-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    let isSubscribed = true;

    const handleCartClear = async () => {
      const sessionId = searchParams.get('session_id')
      if (sessionId && isSubscribed) {
        try {
          await clearCart();
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      }
    };

    handleCartClear();

    return () => {
      isSubscribed = false;
    };
  }, [clearCart, searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-gray-600 mb-8">
          We&apos;ll send you an email with your order details shortly.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
} 