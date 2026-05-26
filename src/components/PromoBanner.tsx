"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Flame, Sparkles, Tag } from "lucide-react";
import { urlForImage } from "@/lib/sanity";
import { formatPrice } from "@/lib/utils";
import type { HomepagePromoBanner, Product } from "@/types";

const VARIANT_META = {
  flash_sale: { label: "Flash Sale", Icon: Flame },
  featured: { label: "Featured", Icon: Sparkles },
  offer: { label: "Special Offer", Icon: Tag },
} as const;

function useCountdown(endAt?: string) {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!endAt) {
      setLeft(null);
      return;
    }

    const end = new Date(endAt).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setLeft("Ended");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(
        d > 0
          ? `${d}d ${h}h ${m}m`
          : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endAt]);

  return left;
}

function PromoProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]
    ? urlForImage(product.images[0], 320, 400)
    : "/placeholder.jpg";
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${product.slug.current}`}
      className="group shrink-0 w-[140px] sm:w-[160px] card-luxury overflow-hidden bg-[var(--surface)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
        {product.images?.[0] && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="160px"
          />
        )}
        {discount != null && discount > 0 && (
          <span className="absolute top-2 left-2 bg-gold text-obsidian text-[10px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[var(--text-primary)] text-xs font-medium line-clamp-2 group-hover:text-gold transition-colors">
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-[var(--text-muted)] line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface Props {
  banner: HomepagePromoBanner;
}

export default function PromoBanner({ banner }: Props) {
  const variant = banner.variant ?? "offer";
  const meta = VARIANT_META[variant];
  const Icon = meta.Icon;
  const countdown = useCountdown(banner.endAt);
  const bgUrl = banner.backgroundImage
    ? urlForImage(banner.backgroundImage, 1400, 600)
    : null;
  const products = banner.products ?? [];

  return (
    <section className="relative py-16 md:py-20 px-6 overflow-hidden border-y border-[var(--border)]">
      {bgUrl && (
        <>
          <div className="absolute inset-0">
            <Image
              src={bgUrl}
              alt=""
              fill
              className="object-cover opacity-15"
              sizes="100vw"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 bg-[var(--bg)]/90" aria-hidden />
        </>
      )}

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 bg-gold/10 mb-5">
              <Icon size={14} className="text-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-semibold">
                {banner.eyebrow || meta.label}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] leading-tight mb-4">
              {banner.title}
            </h2>
            {banner.description && (
              <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-6">
                {banner.description}
              </p>
            )}

            {countdown && banner.endAt && (
              <div className="flex items-center gap-3 mb-6 p-4 border border-[var(--border)] bg-[var(--surface)]">
                <Clock size={18} className="text-gold shrink-0" />
                <div>
                  <p className="text-[var(--text-muted)] text-2xs tracking-widest uppercase">
                    Ends in
                  </p>
                  <p className="font-display text-2xl font-semibold gold-text tabular-nums">
                    {countdown}
                  </p>
                </div>
              </div>
            )}

            <Link
              href={banner.ctaHref || "/shop"}
              className="btn-gold inline-flex items-center gap-2"
            >
              <span>{banner.ctaLabel || "Shop Now"}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="min-w-0">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
              {products.map((product) => (
                <div key={product._id} className="snap-start">
                  <PromoProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
