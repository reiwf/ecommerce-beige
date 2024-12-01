'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  date: string
  total: number
}

export default function UserPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // In a real application, you would fetch the user's orders from an API
    // For this example, we'll use mock data
    const mockOrders: Order[] = [
      { id: '1234', date: '2023-05-01', total: 129.99 },
      { id: '5678', date: '2023-05-15', total: 79.99 },
      { id: '9012', date: '2023-05-30', total: 199.99 },
    ]
    setOrders(mockOrders)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-beige-900 mb-8">Your Account</h1>
      <div className="bg-beige-500 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-beige-900 mb-4">Your Orders</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <div className="bg-beige-400 rounded-lg p-4 hover:bg-beige-300 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-beige-900">Order #{order.id}</p>
                      <p className="text-beige-700">Date: {order.date}</p>
                    </div>
                    <div>
                      <p className="text-beige-900 font-semibold">${order.total.toFixed(2)}</p>
                      <Button variant="link" className="p-0 h-auto font-normal text-beige-800">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-beige-700">You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  )
}

