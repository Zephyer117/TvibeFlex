import type { CartItem, CartVariation } from "@/types";

export function buildCartKey(
  productId: string,
  variations?: CartVariation[]
): string {
  if (!variations?.length) return productId;
  const part = variations
    .map((v) => `${v.name}=${v.value}`)
    .sort()
    .join("|");
  return `${productId}::${part}`;
}

export function formatVariationsLabel(variations?: CartVariation[]): string {
  if (!variations?.length) return "";
  return variations.map((v) => `${v.name}: ${v.value}`).join(" · ");
}

export function normalizeCartItem(item: CartItem): CartItem {
  const cartKey = item.cartKey || buildCartKey(item._id, item.variations);
  return { ...item, cartKey };
}
