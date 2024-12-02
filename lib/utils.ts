import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { client } from '@/sanity/lib/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount);
}

// // Function to prepare order data
// export function prepareOrderData(session: any, orderItems: any[], userData: any, paymentIntent: any) {
//   return {
//     _type: 'order',
//     orderId: session.id,
//     userId: userData.userId,
//     customerDetails: {
//       _type: 'customerDetails',
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       phoneNumber: userData.phoneNumber,
//       address: userData.address,
//       city: userData.city,
//       postalCode: userData.postalCode,
//       country: userData.country,
//     },
//     items: orderItems.map((item: any) => ({
//       _type: 'orderItem',
//       productId: { _type: 'reference', _ref: item._id.split('-')[0] },
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price,
//       imageUrl: item.imageUrl,
//       options: item.options || {},
//     })),
//     paymentDetails: {
//       _type: 'paymentDetails',
//       paymentId: paymentIntent.id,
//       paymentStatus: paymentIntent.status,
//       paymentMethod: paymentIntent.payment_method_types[0],
//       amount: paymentIntent.amount,
//       currency: paymentIntent.currency,
//     },
//     status: 'processing',
//     createdAt: new Date().toISOString(),
//   }
// }

// // Function to create order in Sanity
// export async function createOrder(orderData: any) {
//   try {
//     console.log('------------------------')
//     console.log('Creating Order:')
//     console.log('Order ID:', orderData.orderId)
//     console.log('User ID:', orderData.userId)
//     console.log('Items:', orderData.items.length)
//     console.log('------------------------')
    
//     const order = await client.create(orderData)
    
//     console.log('------------------------')
//     console.log('Order Created Successfully:')
//     console.log('Sanity Document ID:', order._id)
//     console.log('------------------------')
    
//     return order
//   } catch (error) {
//     console.error('------------------------')
//     console.error('Order Creation Failed:')
//     console.error('Error:', error)
//     console.error('Order Data:', JSON.stringify(orderData, null, 2))
//     console.error('------------------------')
//     throw error
//   }
// }

// // Function to update product quantities
// export async function updateProductQuantities(items: any[]) {
//   try {
//     console.log('Updating quantities for items:', items)
//     const transaction = client.transaction()
    
//     for (const item of items) {
//       transaction.patch(item._id, {
//         dec: {
//           quantity: item.quantity
//         }
//       })
//     }
    
//     const result = await transaction.commit()
//     console.log('Quantities updated successfully:', result)
//     return result
//   } catch (error) {
//     console.error('Error updating product quantities:', error)
//     throw error
//   }
// }

// // Function to verify Sanity connection
// export async function verifySanityConnection() {
//   try {
//     const result = await client.fetch('*[_type == "product"][0]')
//     console.log('Sanity connection verified:', result)
//     return true
//   } catch (error) {
//     console.error('Sanity connection failed:', error)
//     return false
//   }
// }
