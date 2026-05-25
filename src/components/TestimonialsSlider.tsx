"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";

const PER_VIEW_DESKTOP = 3;
const PER_VIEW_MOBILE = 1;
const DESKTOP_MQ = "(min-width: 768px)";

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialsSlider({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(PER_VIEW_DESKTOP);
  const count = testimonials.length;
  const canSlide = count > perView;

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () =>
      setPerView(mq.matches ? PER_VIEW_DESKTOP : PER_VIEW_MOBILE);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setIndex((i) => (count > 0 ? i % count : 0));
  }, [perView, count]);

  const go = useCallback(
    (direction: 1 | -1) => {
      if (!canSlide) return;
      setIndex((i) => (i + direction + count) % count);
    },
    [canSlide, count]
  );

  const visible = Array.from({ length: Math.min(perView, count) }, (_, i) => {
    const item = testimonials[(index + i) % count];
    return { testimonial: item, key: `${item._id}-${i}` };
  });

  const dotCount = canSlide ? count : 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "grid gap-6 transition-opacity duration-300",
          perView === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
        )}
        aria-live="polite"
      >
        {visible.map(({ testimonial, key }) => (
          <TestimonialCard
            key={key}
            testimonial={testimonial}
            featured={testimonial.featured}
          />
        ))}
      </div>

      {canSlide && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-gold hover:text-gold transition-colors shadow-sm"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-gold hover:text-gold transition-colors shadow-sm"
            aria-label="Next testimonials"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={testimonials[i]._id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-8 bg-gold"
                    : "w-1.5 bg-[var(--border)] hover:bg-gold/50"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
