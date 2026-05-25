import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";

export default function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: Testimonial;
  featured?: boolean;
}) {
  const initials = testimonial.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "card-luxury p-7 flex flex-col h-full",
        featured && "border-gold/40 ring-1 ring-gold/20"
      )}
    >
      {featured && (
        <p className="text-gold text-2xs tracking-widest uppercase font-semibold mb-3">
          Featured
        </p>
      )}
      {testimonial.rating != null && testimonial.rating > 0 && (
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < testimonial.rating!
                  ? "fill-gold text-gold"
                  : "text-[var(--border)]"
              }
            />
          ))}
        </div>
      )}
      <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-6 italic flex-1">
        &ldquo;{testimonial.message}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        {testimonial.authorImageUrl ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
            <Image
              src={testimonial.authorImageUrl}
              alt={testimonial.authorName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-semibold shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="font-body font-semibold text-[var(--text-primary)] text-sm">
            {testimonial.authorName}
          </p>
          <p className="text-[var(--text-muted)] text-xs font-body">Verified customer</p>
        </div>
      </div>
    </div>
  );
}
