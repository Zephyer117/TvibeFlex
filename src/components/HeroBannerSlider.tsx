"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { urlForImage } from "@/lib/sanity";
import { cn } from "@/lib/utils";
import type { HeroBannerSlide } from "@/types";

const AUTO_MS = 6000;

interface Props {
  slides: HeroBannerSlide[];
}

export default function HeroBannerSlider({ slides }: Props) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((i) => (i + direction + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused || reducedMotion) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reducedMotion, go]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="relative w-screen max-w-[100vw] overflow-hidden border-b border-[var(--border)] bg-[var(--bg-secondary)]"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      aria-roledescription="carousel"
      aria-label="Promotional offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full min-h-[360px] h-[45vh] sm:h-[50vh] lg:h-[min(70vh,720px)]">
        {slides.map((s, i) => {
          const src = urlForImage(s.image, 1920, 900);
          return (
            <div
              key={s._key}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                i === index ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
              aria-hidden={i !== index}
            >
              <Image
                src={src}
                alt={s.title}
                fill
                priority={i === 0}
                className={cn(
                  "object-cover",
                  i === index && !reducedMotion && ""
                )}
                sizes="100vw"
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 bg-black/35" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/45 to-transparent" />

        <div className="absolute inset-0 z-30 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-10">
            <div
              key={slide._key}
              className="max-w-xl animate-fade-up"
            >
              {slide.eyebrow && (
                <p className="text-gold text-lg tracking-[0.35em] uppercase font-semibold mb-3">
                  {slide.eyebrow}
                </p>
              )}
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] mb-4">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-white/80 font-body text-sm md:text-base leading-relaxed mb-8 max-w-md">
                  {slide.subtitle}
                </p>
              )}
              {(slide.ctaLabel || slide.ctaHref) && (
                <Link
                  href={slide.ctaHref || "/shop"}
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <span>{slide.ctaLabel || "Shop Now"}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:border-gold hover:text-gold transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s._key}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === index
                        ? "w-10 bg-gold"
                        : "w-4 bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="hidden sm:flex w-8 h-8 items-center justify-center text-white/70 hover:text-gold transition-colors"
                aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
              <div
                className="h-full bg-gold transition-all duration-300 ease-linear"
                style={{ width: `${((index + 1) / count) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

    </section>
  );
}
