import { defineType, defineField, defineArrayMember } from "sanity";
import { BasketIcon } from "@sanity/icons";
import { formatBdt } from "../lib/format";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order ID",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Cash on Delivery", value: "cod" },
          { title: "Stripe (legacy)", value: "stripe" },
        ],
        layout: "radio",
      },
      initialValue: "cod",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          // Legacy Stripe workflow statuses
          { title: "Paid (legacy)", value: "paid" },
          { title: "Processing (legacy)", value: "processing" },
          { title: "Shipped (legacy)", value: "shipped" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "orderPlacedAt",
      title: "Order Date & Time",
      type: "datetime",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "customerUser",
      title: "Authenticated Customer",
      type: "reference",
      to: [{ type: "storeUser" }],
      readOnly: true,
      description: "Linked account — used for secure My Orders access.",
    }),
    defineField({
      name: "customer",
      title: "Customer Details",
      type: "object",
      fields: [
        defineField({ name: "fullName", title: "Full Name", type: "string" }),
        defineField({ name: "phone", title: "Phone Number", type: "string" }),
        defineField({ name: "email", title: "Email (optional)", type: "string" }),
        // Legacy fields for older orders
        defineField({ name: "firstName", title: "First Name (legacy)", type: "string" }),
        defineField({ name: "lastName", title: "Last Name (legacy)", type: "string" }),
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Delivery Address",
      type: "object",
      fields: [
        defineField({ name: "address", title: "Full Address / Location", type: "text", rows: 2 }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country (optional)", type: "string" }),
      ],
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "productId", title: "Product ID", type: "string" }),
            defineField({ name: "name", title: "Product Name", type: "string" }),
            defineField({ name: "price", title: "Unit Price", type: "number" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "image", title: "Image URL", type: "string" }),
            defineField({
              name: "variations",
              title: "Selected Variations",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "name", title: "Option", type: "string" }),
                    defineField({ name: "value", title: "Value", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "name", qty: "quantity", price: "price" },
            prepare: ({ title, qty, price }) => ({
              title,
              subtitle: `Qty: ${qty} × ${formatBdt(price)}`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "subtotal", title: "Subtotal (BDT)", type: "number", readOnly: true }),
    defineField({ name: "shippingCost", title: "Shipping Cost (BDT)", type: "number", readOnly: true }),
    defineField({ name: "total", title: "Total (BDT)", type: "number", readOnly: true }),
    defineField({ name: "notes", title: "Internal Notes", type: "text", rows: 3 }),
    // Legacy Stripe fields
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID (legacy)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID (legacy)",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      fullName: "customer.fullName",
      phone: "customer.phone",
      total: "total",
      status: "status",
      placedAt: "orderPlacedAt",
    },
    prepare: ({ orderNumber, fullName, phone, total, status, placedAt }) => ({
      title: `#${orderNumber}`,
      subtitle: `${fullName || phone || "Customer"} — ${formatBdt(total)} — ${status}${placedAt ? ` — ${new Date(placedAt).toLocaleString()}` : ""}`,
    }),
  },
  orderings: [
    {
      title: "Newest First",
      name: "orderPlacedAtDesc",
      by: [{ field: "orderPlacedAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
