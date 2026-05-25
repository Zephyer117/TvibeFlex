"use client";

import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWishlistStore } from "@/context/wishlistStore";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  imageUrl: string;
  variant?: "icon" | "button";
  className?: string;
}

export default function WishlistButton({
  product,
  imageUrl,
  variant = "icon",
  className,
}: Props) {
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product._id));
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product, imageUrl);
    toast.success(
      isInWishlist
        ? `Removed ${product.name} from wishlist`
        : `Saved ${product.name} to wishlist`
    );
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-full py-4 font-body font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-3 border transition-all duration-300",
          isInWishlist
            ? "border-gold bg-gold/10 text-gold"
            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-gold/50 hover:text-gold",
          className
        )}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} className={isInWishlist ? "fill-current" : ""} />
        <span>{isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-8 h-8 bg-[var(--surface)]/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:text-gold",
        isInWishlist && "text-gold opacity-100",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={14} className={isInWishlist ? "fill-current" : ""} />
    </button>
  );
}
