"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/context/cartStore";
import type { CartVariation, Product } from "@/types";

interface Props {
  product: Product;
  imageUrl: string;
}

export default function AddToCartButton({ product, imageUrl }: Props) {
  const [added, setAdded] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const addItem = useCartStore((s) => s.addItem);

  const variantOptions = product.variantOptions ?? [];

  const variations: CartVariation[] = useMemo(
    () =>
      variantOptions.map((opt) => ({
        name: opt.name,
        value: selections[opt.name] ?? "",
      })),
    [variantOptions, selections]
  );

  const allVariantsSelected =
    variantOptions.length === 0 ||
    variantOptions.every((opt) => Boolean(selections[opt.name]));

  const handleAdd = () => {
    if (product.stock === 0) return;
    if (!allVariantsSelected) {
      toast.error("Please select all product options");
      return;
    }
    addItem(
      product,
      imageUrl,
      variations.length ? variations.filter((v) => v.value) : undefined
    );
    setAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {variantOptions.map((option) => (
        <div key={option.name}>
          <p className="text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] mb-2 font-body">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setSelections((prev) => ({ ...prev, [option.name]: value }))
                }
                className={`px-4 py-2 text-sm font-body border transition-colors ${
                  selections[option.name] === value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-gold/50"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`w-full py-4 font-body font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
          product.stock === 0
            ? "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]"
            : added
              ? "bg-green-600 text-white"
              : "btn-gold"
        }`}
      >
        {added ? <Check size={16} /> : <ShoppingBag size={16} />}
        <span>
          {product.stock === 0
            ? "Out of Stock"
            : added
              ? "Added!"
              : "Add to Cart"}
        </span>
      </button>
    </div>
  );
}
