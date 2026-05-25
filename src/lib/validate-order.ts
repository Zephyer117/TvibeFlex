import { sanityClient } from "./sanity";
import type { CartItem } from "@/types";
import { buildCartKey } from "./cart-utils";

interface SanityProductRow {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ValidatedCartLine {
  cartKey: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variations?: CartItem["variations"];
}

export async function validateCartItems(
  items: CartItem[]
): Promise<{ ok: true; lines: ValidatedCartLine[] } | { ok: false; error: string }> {
  if (!items?.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const normalized = items.map((item) => ({
    ...item,
    cartKey: item.cartKey || buildCartKey(item._id, item.variations),
  }));

  for (const item of normalized) {
    if (!item._id || !item.name || item.quantity < 1) {
      return { ok: false, error: "Invalid cart item." };
    }
    if (typeof item.price !== "number" || item.price <= 0) {
      return { ok: false, error: `Invalid price for ${item.name}.` };
    }
  }

  const productIds = Array.from(new Set(normalized.map((i) => i._id)));
  const products = await sanityClient.fetch<SanityProductRow[]>(
    `*[_type == "product" && _id in $ids]{ _id, name, price, stock }`,
    { ids: productIds }
  );

  const byId = new Map(products.map((p) => [p._id, p]));

  for (const item of normalized) {
    const product = byId.get(item._id);
    if (!product) {
      return { ok: false, error: `"${item.name}" is no longer available.` };
    }
    if (product.stock < item.quantity) {
      return {
        ok: false,
        error:
          product.stock === 0
            ? `"${product.name}" is out of stock.`
            : `Only ${product.stock} of "${product.name}" available.`,
      };
    }
    if (Math.abs(product.price - item.price) > 0.01) {
      return {
        ok: false,
        error: `Price for "${product.name}" has changed. Please refresh your cart.`,
      };
    }
  }

  const lines: ValidatedCartLine[] = normalized.map((item) => ({
    cartKey: item.cartKey,
    productId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || "",
    variations: item.variations,
  }));

  return { ok: true, lines };
}
