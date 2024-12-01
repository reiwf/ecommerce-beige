'use server'

import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { CartItem } from '@/app/components/cart-context'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  clerkUserId: string;
};

export type GroupedCartItem = {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItem[],
  metadata: Metadata
) {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price)
    if (itemsWithoutPrice.length > 0) {
      throw new Error('Some items do not have a price')
    }
    
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    })
    let customerId: string | undefined;
    if (customers.data.length > 0){
      customerId = customers.data[0].id;
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/checkout`,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'jpy',
          unit_amount: item.product.price,
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: [
              item.product.variants?.[0]?.color && `${item.product.variants[0].color}`,
              item.product.variants?.[0]?.sizes?.[0]?.name && `${item.product.variants[0].sizes[0].name}`,
            ].filter(Boolean).join(', ') || undefined,          
            metadata: {
              id: item.product._id,
              color: item.product.variants?.[0]?.color || null,
              size: item.product.variants?.[0]?.sizes?.[0]?.name || null
            },
            images: [item.product.imageUrl]
          },       
        }, 
        quantity: item.quantity
      })),
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }

}























// interface CartItem {
//   _id: string
//   name: string
//   price: number
//   quantity: number
//   imageUrl: string
//   currency: string
//   options?: {
//     variant?: string
//     size?: string
//   }
// }

// interface UserData {
//   userId: string
//   email: string
//   firstName: string
//   lastName: string
//   phoneNumber: string
//   address: string
//   city: string
//   postalCode: string
//   country: string
// }

// export async function POST(req: Request) {
//   try {
//     const { items, userData }: { items: CartItem[], userData: UserData } = await req.json()

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000'
//     const customerEmail = userData.email?.trim()

//     // Create metadata that Stripe needs
//     const orderMetadata = {
//       items: JSON.stringify(items.map(item => ({
//         _id: item._id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         options: item.options,
//       }))),
//       shippingDetails: JSON.stringify({
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         phoneNumber: userData.phoneNumber,
//         address: userData.address,
//         city: userData.city,
//         postalCode: userData.postalCode,
//         country: userData.country,
//       })
//     }

  

//     const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            
//       line_items: items.map((item: CartItem) => ({
//         price_data: {
//           currency: 'jpy',
//           unit_amount: item.price,
//           product_data: {
//             name: item.name,
//             description: [
//               item.options?.variant && `Color: ${item.options.variant}`,
//               item.options?.size && `Size: ${item.options.size}`,
//             ].filter(Boolean).join(', ') || undefined,
//             images: [item.imageUrl],
//             metadata: {
//               productId: item._id,
//               variantOption: item.options?.variant || null,
//               sizeOption: item.options?.size || null
//             }
//           },
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${baseUrl}/checkout`,
//       metadata: orderMetadata,
//       customer_email: customerEmail || undefined,
//     }

//     const session = await stripe.checkout.sessions.create(sessionConfig)

//     return new Response(JSON.stringify({ sessionUrl: session.url }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error) {
//     console.error('Error:', error)
//     return new Response(
//       JSON.stringify({ 
//         error: 'Error creating checkout session',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }),
//       { 
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     )
//   }
// } 