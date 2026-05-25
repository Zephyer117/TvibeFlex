"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@/types";

interface Props {
  allProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSort?: string;
  initialQuery?: string;
}

export default function ShopClient({
  allProducts,
  categories,
  initialCategory,
  initialSort,
  initialQuery,
}: Props) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "");
  const [sort, setSort] = useState(initialSort || "");
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");

  const products = useMemo(() => {
    let list = [...allProducts];

    if (activeCategory) {
      list = list.filter((p) => p.category?.slug?.current === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [allProducts, activeCategory, sort, searchQuery]);

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">Our Collection</p>
          <h1 className="section-title">Shop All Products</h1>
          <p className="text-[var(--text-muted)] font-body mt-2 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""}
            {activeCategory && ` in ${categories.find((c) => c.slug.current === activeCategory)?.name}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, tags…"
            className="input-luxury w-full pl-10 pr-10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10 pb-6 border-b border-[var(--border)]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("")}
              className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors font-body font-medium ${
                !activeCategory
                  ? "border-gold bg-gold text-obsidian"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-[var(--text-primary)]"
              }`}>
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(activeCategory === cat.slug.current ? "" : cat.slug.current)}
                className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors font-body font-medium ${
                  activeCategory === cat.slug.current
                    ? "border-gold bg-gold text-obsidian"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-gold hover:text-[var(--text-primary)]"
                }`}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={14} className="text-[var(--text-muted)]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-xs tracking-wide py-2 px-3 focus:outline-none focus:border-gold font-body cursor-pointer">
              <option value="">Sort: Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[var(--text-muted)] mb-4">No products found</p>
            <button
              onClick={() => { setActiveCategory(""); setSearchQuery(""); setSort(""); }}
              className="btn-gold inline-flex">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
