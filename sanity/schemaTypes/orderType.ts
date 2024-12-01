import {defineArrayMember, defineField, defineType} from "sanity";
import {BasketIcon} from "@sanity/icons";

export const orderType = defineType({
    name: "order",
    title: "Orders",
    type: "document",
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderId",
            title: "Order ID",
            type: "string",
        }),
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string",
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
        }),
        defineField({
            name: "stripePaymentIntentId",
            title: "Stripe Payment Intent ID",
            type: "string",
        }),
        defineField({
            name: "clerkUserId",
            title: "Clerk UserID",
            type: "string",
        }),
        defineField({
            name: "customerDetails",
            title: "Shipping Details",
            type: "object",
            fields: [
                defineField({ name: "userId", type: "string" }),
                defineField({ name: "email", type: "string" }),
                defineField({ name: "firstName", type: "string" }),
                defineField({ name: "lastName", type: "string" }),
                defineField({ name: "phoneNumber", type: "string" }),
                defineField({ name: "address", type: "string" }),
                defineField({ name: "city", type: "string" }),
                defineField({ name: "postalCode", type: "string" }),
                defineField({ name: "country", type: "string" }),
            ],
        }),
        defineField({
            name: "items",
            title: "Order Items",
            type: "array",
            of: [defineArrayMember({
                type: "object",
                fields: [
                    defineField({ name: "productId", type: "reference", to: [{type: "product"}] }),
                    defineField({ name: "name", type: "string" }),
                    defineField({ name: "quantity", type: "number" }),
                    defineField({ name: "price", type: "number" }),
                    defineField({
                        name: "options",
                        type: "object",
                        fields: [
                            defineField({ name: "variant", type: "string" }),
                            defineField({ name: "size", type: "string" }),
                        ],
                    }),
                ],
            })],
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    {title: "Paid", value: "Paid"},
                    {title: "Processing", value: "processing"},
                    {title: "Completed", value: "completed"},
                    {title: "Cancelled", value: "cancelled"},
                ],
            },
        }),
        defineField({
            name: "totalAmount",
            title: "Total Amount",
            type: "number",
        }),
        defineField({
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
        }),
    ],
});

// Export the types
export const schemaTypes = [orderType];