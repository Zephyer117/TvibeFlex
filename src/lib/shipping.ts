/** Shipping rules (amounts in BDT) */
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_COST = 150;

export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}
