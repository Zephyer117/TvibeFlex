"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWishlistStore } from "@/context/wishlistStore";
import { useCartStore } from "@/context/cartStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddToCart = (item: (typeof items)[0]) => {
    if (item.stock === 0) {
      toast.error("This item is out of stock.");
      return;
    }
    addToCart(
      {
        _id: item._id,
        name: item.name,
        slug: { current: item.slug },
        price: item.price,
        comparePrice: item.comparePrice,
        images: [],
        description: "",
        category: { _id: "", name: "", slug: { current: "" } },
        stock: item.stock,
      },
      item.image
    );
    toast.success(`${item.name} added to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <Heart size={60} className="text-[var(--text-muted)] mx-auto mb-6" />
          <h1 className="font-display text-3xl text-[var(--text-primary)] mb-3">
            Your wishlist is empty
          </h1>
          <p className="text-[var(--text-muted)] font-body mb-8">
            Save items you love and come back anytime.
          </p>
          <Link href="/shop" className="btn-gold inline-flex items-center gap-3">
            <span>Browse Shop</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
            Saved For Later
          </p>
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)]">
            My Wishlist
          </h1>
          <p className="text-[var(--text-muted)] font-body text-sm mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card-luxury overflow-hidden flex flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="relative aspect-[4/5] block overflow-hidden"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                {item.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-[var(--text-muted)] text-white text-2xs font-bold px-2 py-1 tracking-widest uppercase">
                    Sold Out
                  </span>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <Link href={`/product/${item.slug}`}>
                  <h2 className="font-body font-medium text-[var(--text-primary)] hover:text-gold transition-colors line-clamp-2">
                    {item.name}
                  </h2>
                </Link>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <span className="font-body font-semibold text-[var(--text-primary)]">
                    {formatPrice(item.price)}
                  </span>
                  {item.comparePrice && (
                    <span className="font-body text-sm text-[var(--text-muted)] line-through">
                      {formatPrice(item.comparePrice)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    className="btn-gold flex-1 flex items-center justify-center gap-2 text-xs py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item._id);
                      toast.success("Removed from wishlist");
                    }}
                    className="px-3 border border-[var(--border)] text-[var(--text-muted)] hover:border-red-400 hover:text-red-400 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
