import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateProductQuantity } from "@/app/components/quantityupdate";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status === 'paid') {
      // Get line items from the session
      const lineItems = session.line_items?.data;

      if (lineItems) {
        // Update quantities for each purchased item
        for (const item of lineItems) {
          const metadata = item.price?.product as Stripe.Product;
          if (metadata.metadata) {
            await updateProductQuantity({
              productId: metadata.metadata.productId,
              size: metadata.metadata.size,
              quantity: item.quantity || 0,
            });
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Payment not confirmed' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Payment verification failed' });
  }
} 