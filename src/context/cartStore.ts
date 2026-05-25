import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartStore, CartVariation, Product } from "@/types";
import { buildCartKey, normalizeCartItem } from "@/lib/cart-utils";

function migrateItems(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const normalized = normalizeCartItem({
      ...item,
      cartKey: item.cartKey || buildCartKey(item._id, item.variations),
    });
    return normalized;
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, imageUrl: string, variations?: CartVariation[]) => {
        const cartKey = buildCartKey(product._id, variations);
        const items = migrateItems(get().items);
        const existing = items.find((i) => i.cartKey === cartKey);

        if (existing) {
          if (existing.quantity >= product.stock) return;
          set({
            items: items.map((i) =>
              i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          const newItem: CartItem = {
            cartKey,
            _id: product._id,
            name: product.name,
            slug: product.slug.current,
            price: product.price,
            image: imageUrl,
            quantity: 1,
            variations: variations?.length ? variations : undefined,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (cartKey: string) => {
        set({ items: get().items.filter((i) => i.cartKey !== cartKey) });
      },

      updateQuantity: (cartKey: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.cartKey === cartKey ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "luxe-cart",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { items?: CartItem[] };
        if (state?.items) {
          state.items = migrateItems(state.items);
        }
        return state as CartStore;
      },
    }
  )
);
