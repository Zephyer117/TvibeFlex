"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/context/cartStore";
import WishlistButton from "@/components/WishlistButton";
import { useWishlistStore } from "@/context/wishlistStore";
import { urlForImage } from "@/lib/sanity";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = useWishlistStore((s) => s.isInWishlist(product._id));

  const imageUrl = product.images?.[0]
    ? urlForImage(product.images[0], 600, 750)
    : "/placeholder.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, imageUrl);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="group card-luxury relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
          {product.images?.[0] && (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-gold text-obsidian text-xs tracking-widest uppercase font-semibold py-3 
                       translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>Add to Cart</span>
          </button>

          <WishlistButton
            product={product}
            imageUrl={imageUrl}
            className={`absolute top-4 right-4 ${
              inWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />

          {/* Badges */}
          {product.comparePrice && (
            <span className="absolute top-4 left-4 bg-gold text-obsidian text-2xs font-bold px-2 py-1 tracking-widest uppercase">
              Sale
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-4 left-4 bg-[var(--text-muted)] text-white text-2xs font-bold px-2 py-1 tracking-widest uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-gold text-2xs tracking-widest uppercase font-semibold mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-body font-medium text-[var(--text-primary)] text-sm mb-2 line-clamp-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="font-body text-sm text-[var(--text-muted)] line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
