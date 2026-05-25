"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="aspect-[4/5] card-luxury bg-[var(--bg-secondary)] flex items-center justify-center">
        <p className="text-[var(--text-muted)] font-body text-sm">No image available</p>
      </div>
    );
  }

  const go = (direction: 1 | -1) => {
    setSelectedIndex((i) => (i + direction + count) % count);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden card-luxury group">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} — image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={selectedIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg)]/80 border border-[var(--border)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:border-gold hover:text-gold transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg)]/80 border border-[var(--border)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:border-gold hover:text-gold transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 text-xs font-body tracking-widest uppercase bg-[var(--bg)]/80 border border-[var(--border)] px-2 py-1 text-[var(--text-muted)]">
              {selectedIndex + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((src, i) => (
            <button
              key={`${i}-${src}`}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden card-luxury transition-all",
                i === selectedIndex
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-[var(--bg)]"
                  : "opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : undefined}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
