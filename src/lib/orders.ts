import { sanityWriteClient } from "./sanity";
import type { CodCheckoutFormData, Order, OrderStatus } from "@/types";
import type { ValidatedCartLine } from "./validate-order";

import { getShippingCost } from "./shipping";

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LX-${timestamp}-${random}`;
}

export function calculateOrderTotals(lines: ValidatedCartLine[]) {
  const subtotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = getShippingCost(subtotal);
  const total = subtotal + shippingCost;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export interface CreateCodOrderInput {
  lines: ValidatedCartLine[];
  customerDetails: CodCheckoutFormData;
  status?: OrderStatus;
  /** Sanity storeUser document _id */
  customerUserId: string;
}

export async function createCodOrder(
  input: CreateCodOrderInput
): Promise<Order> {
  const { lines, customerDetails, status = "pending", customerUserId } = input;
  const { subtotal, shippingCost, total } = calculateOrderTotals(lines);
  const orderNumber = generateOrderNumber();
  const orderPlacedAt = new Date().toISOString();

  const doc = {
    _type: "order",
    orderNumber,
    paymentMethod: "cod",
    status,
    orderPlacedAt,
    customerUser: { _type: "reference", _ref: customerUserId },
    customer: {
      fullName: customerDetails.fullName.trim(),
      phone: customerDetails.phone.trim(),
      email: customerDetails.email?.trim() || "",
    },
    shippingAddress: {
      address: customerDetails.address.trim(),
      city: customerDetails.city.trim(),
      state: customerDetails.state.trim(),
      postalCode: customerDetails.postalCode.trim(),
      country: "",
    },
    items: lines.map((line) => ({
      _key: line.cartKey,
      productId: line.productId,
      name: line.name,
      price: line.price,
      quantity: line.quantity,
      image: line.image,
      variations: line.variations?.length
        ? line.variations.map((v) => ({
            _key: `${v.name}-${v.value}`,
            name: v.name,
            value: v.value,
          }))
        : [],
    })),
    subtotal,
    shippingCost,
    total,
  };

  const created = await sanityWriteClient.create(doc);
  return created as unknown as Order;
}

export async function updateOrderStatus(
  sanityId: string,
  status: Order["status"]
) {
  return sanityWriteClient.patch(sanityId).set({ status }).commit();
}
