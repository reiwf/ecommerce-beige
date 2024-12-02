import { getMyOrders } from "@/sanity/lib/order/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order , Product } from "@/lib/products";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";


async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const orders = await getMyOrders(userId) as Order[];
  const productIds = [...new Set(orders.flatMap(order => 
    order.items.map(item => item.productId._ref)
  ))];
  const products = await client.fetch(PRODUCTS_QUERY, { productIds });
  const productMap = products.reduce((acc: Record<string, Product>, product: Product) => {
    acc[product._id] = product;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="text-beige-600 hover:text-beige-800" 
          asChild
        >
          <Link href="/products">
            ← Back to Products
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-beige-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-beige-700 mb-4">Buy something first?</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-beige-100 rounded-lg shadow-md p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-beige-200">
                <div>
                  <h3 className="text-xl font-semibold text-beige-800">
                    Order Number: {order.orderId}
                  </h3>
                  <p className="text-sm text-beige-500 mt-1">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  {order.customerDetails && (
                    <div className="mt-2 text-sm text-beige-600 line-clamp-2">
                      <p className="font-medium">Ships To:{order.customerDetails.address}</p>                 
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
                    style={{
                      backgroundColor: order.status === 'Paid' ? '#F3F4F6' : 
                                     order.status === 'processing' ? '#FEF3C7' :
                                     order.status === 'completed' ? '#D1FAE5' :
                                     '#FEE2E2',
                      color: order.status === 'Paid' ? '#374151' :
                             order.status === 'processing' ? '#92400E' :
                             order.status === 'completed' ? '#065F46' :
                             '#991B1B'
                    }}
                  >
                    {order.status}
                  </div>
                  <p className="text-beige-800 font-semibold">
                    {productMap[order.items[0].productId._ref]?.currency || 'JPY'} {order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => {
                  const product = productMap[item.productId._ref];
                  const selectedVariant = product?.variants?.find(
                    (v: { color: string })  => v.color === item.options?.variant
                  );
                  const imageUrl = selectedVariant?.imageUrl || product?.imageUrl || '';

                  return (
                    <div key={item._key} className="flex items-center justify-between border-b border-beige-200 pb-4">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-grow ml-4">
                        <h3 className="text-beige-800 font-semibold">{item.name}</h3>
                        {(item.options?.variant || item.options?.size) && (
                          <div className="text-sm text-beige-600 mt-1">
                            {item.options?.variant && (
                              <p>Color: {item.options.variant}</p>
                            )}
                            {item.options?.size && (
                              <p>Size: {item.options.size}</p>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-beige-600 mt-1">
                          Quantity: {item.quantity} × {product?.currency || 'JPY'} {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-beige-800 font-semibold">
                          {product?.currency || 'JPY'} {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
