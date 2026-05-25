"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  currentSort: string;
}

export default function ProductSort({ currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal size={14} className="text-[var(--text-muted)]" />
      <select
        value={currentSort}
        className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-xs tracking-wide py-2 px-3 focus:outline-none focus:border-gold font-body"
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="">Sort: Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
