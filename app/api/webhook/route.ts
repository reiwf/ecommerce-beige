import { headers } from 'next/headers'
import { Stripe } from 'stripe'
import { NextResponse , NextRequest } from 'next/server'
import stripe from '@/lib/stripe'
import { backendClient } from '@/sanity/lib/backendClient'
import { updateProductQuantity } from "@/app/components/quantityupdate";



export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new Response('No signature found', { status: 400 })
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


  if (!webhookSecret) {
    console.error('No webhook secret found')
    return NextResponse.json({ error: 'No webhook secret found' }, { status: 400 })
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      try {
        const order = await createOrderInSanity(session);
        console.log('Order created in Sanity:', order);
      } catch (error) {
        console.error('Error creating order in Sanity:', error);
      } return NextResponse.json({ message: 'Order created in Sanity' }, { status: 200 });
    }
  return NextResponse.json({ received: true }); 
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;  

  // Get orderNumber from metadata m
  const orderNumber = metadata?.orderNumber;
  if (!orderNumber) {
    throw new Error('Order number not found in session metadata');
  }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ['data.price.product'],
    }
  );

  // Map line items to Sanity order items format
  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    productId: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    name: item.description || 'Unknown Product',
    quantity: item.quantity || 0,
    price: item.price?.unit_amount || 0,
    options: {
      variant: (item.price?.product as Stripe.Product)?.metadata?.color,
      size: (item.price?.product as Stripe.Product)?.metadata?.size,
    }
  }));

  const order = await backendClient.create({
    _type: 'order',
    orderId: orderNumber,  // Use orderNumber as orderId
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    clerkUserId: metadata?.clerkUserId,
    customerDetails: {
      userId: metadata?.clerkUserId,
      email: metadata?.customerEmail,
      firstName: metadata?.customerName?.split(' ')[0],
      lastName: metadata?.customerName?.split(' ')[1],
      phoneNumber: metadata?.customerPhone,
      address: metadata?.customerAddress,
    },
    items: sanityProducts,
    totalAmount: session.amount_total,
    status: 'Paid',
    orderDate: new Date().toISOString(),
  });

  try {
    const quantityUpdateResults = [];
    
    for (const item of sanityProducts) {
      const productId = item.productId._ref;
      const size = item.options.size;
      const variant = item.options.variant;
      const quantity = item.quantity;

      try {
        const result = await updateProductQuantity({
          productId,
          size,
          quantity,
          variant
        });
        quantityUpdateResults.push(result);
      } catch (error) {
        console.error(`Failed to update quantity for product ${productId}:`, error);
        quantityUpdateResults.push({
          success: false,
          productId,
          error: (error as Error).message
        });
      }
    }

    console.log('Quantity update results:', quantityUpdateResults);
  } catch (error) {
    console.error('Error updating product quantities:', error);
  }

  return order;
}

  






      

//         _type: 'order',
//         orderId: session.id,
//         customerDetails: {
//           userId: shippingDetails.userId,
//           email: shippingDetails.email,
//           firstName: shippingDetails.firstName,
//           lastName: shippingDetails.lastName,
//           phoneNumber: shippingDetails.phoneNumber,
//           address: shippingDetails.address,
//           city: shippingDetails.city,
//           postalCode: shippingDetails.postalCode,
//           country: shippingDetails.country,
//         },
//         items: items.map((item: any) => ({
//           _type: 'orderItem',
//           productId: {
//             _type: 'reference',
//             _ref: item._id, // Get the base product ID
//           },
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//           options: {
//             variant: item.options?.variant,
//             size: item.options?.size,
//           },
//         })),
//         status: 'processing',
//         totalAmount: session.amount_total ? session.amount_total / 100 : 0,
//         paymentDetails: {
//           paymentId: session.payment_intent as string,
//           paymentStatus: session.payment_status,
//           paymentMethod: session.payment_method_types?.[0] || 'card',
//           amount: session.amount_total ? session.amount_total / 100 : 0,
//           currency: session.currency?.toUpperCase(),
//         },
//         createdAt: new Date().toISOString(),
//       }

//       // Create the order in Sanity
//       await client.create(order)

//       // You could also update product inventory here if needed
//       for (const item of items) {
//         // Get the product from Sanity
//         const productId = item._id
//         const product = await client.fetch(`*[_type == "product" && _id == $productId][0]`, {
//           productId
//         })

//         if (product) {
//           // Find the variant and update its quantity
//           const variant = product.variants?.find(
//             (v: any) => v.color === item.options?.variant
//           )
//           const size = variant?.sizes?.find(
//             (s: any) => s.name === item.options?.size
//           )

//           if (size) {
//             // Update the quantity
//             size.quantity -= item.quantity
//             await client
//               .patch(productId)
//               .set({
//                 variants: product.variants.map((v: any) =>
//                   v.color === item.options?.variant
//                     ? {
//                         ...v,
//                         sizes: v.sizes.map((s: any) =>
//                           s.name === item.options?.size
//                             ? { ...s, quantity: size.quantity }
//                             : s
//                         ),
//                       }
//                     : v
//                 ),
//               })
//               .commit()
//           }
//         }
//       }
//     }

//     return new Response(null, { status: 200 })
//   } catch (error) {
//     console.error('Webhook error:', error)
//     return new Response(
//       JSON.stringify({ error: 'Webhook handler failed' }),
//       { status: 400 }
//     )
//   }
// } 