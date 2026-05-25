import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem, WishlistStore } from "@/types";

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, imageUrl: string) => {
        const items = get().items;
        if (items.some((i) => i._id === product._id)) return;
        const newItem: WishlistItem = {
          _id: product._id,
          name: product.name,
          slug: product.slug.current,
          price: product.price,
          comparePrice: product.comparePrice,
          image: imageUrl,
          stock: product.stock,
        };
        set({ items: [...items, newItem] });
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i._id !== productId) });
      },

      toggleItem: (product: Product, imageUrl: string) => {
        if (get().isInWishlist(product._id)) {
          get().removeItem(product._id);
        } else {
          get().addItem(product, imageUrl);
        }
      },

      isInWishlist: (productId: string) =>
        get().items.some((i) => i._id === productId),

      totalItems: () => get().items.length,
    }),
    { name: "luxe-wishlist" }
  )
);
