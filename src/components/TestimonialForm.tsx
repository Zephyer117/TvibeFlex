"use client";

import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

interface TestimonialFormProps {
  productId?: string;
  productName?: string;
  signInRedirect?: string;
  submitLabel?: string;
}

export default function TestimonialForm({
  productId,
  productName,
  signInRedirect = "/account/reviews",
  submitLabel = "Submit Comment",
}: TestimonialFormProps) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          rating,
          ...(productId ? { productId } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not submit comment.");
        return;
      }
      toast.success(
        data.message ||
          "Thank you! Your comment will appear on the homepage after approval."
      );
      setMessage("");
      setRating(5);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(signInRedirect)}`;

  return (
    <>
      <SignedOut>
        <div className="card-luxury p-8 text-center">
          <p className="font-body text-[var(--text-secondary)] text-sm mb-6">
            Sign in to leave a comment
            {productName ? ` about ${productName}` : ""}. Approved comments appear
            in our Client Stories on the homepage.
          </p>
          <Link href={signInUrl} className="btn-gold inline-flex text-sm">
            Sign In to Comment
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <form onSubmit={handleSubmit} className="card-luxury p-8 space-y-6">
          <div>
            <label className="text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] font-body block mb-3">
              Rating (optional)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1 transition-colors"
                  aria-label={`${n} stars`}
                >
                  <Star
                    size={22}
                    className={
                      rating != null && n <= rating
                        ? "fill-gold text-gold"
                        : "text-[var(--border)]"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor={productId ? "product-comment" : "testimonial-message"}
              className="text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] font-body block mb-3"
            >
              Your comment *
            </label>
            <textarea
              id={productId ? "product-comment" : "testimonial-message"}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                productName
                  ? `Share your thoughts on ${productName}…`
                  : "Tell us about your experience with Luxe Store…"
              }
              className="input-luxury resize-none w-full"
              maxLength={1000}
              required
            />
            <p className="text-xs text-[var(--text-muted)] font-body mt-1 text-right">
              {message.length}/1000
            </p>
          </div>

          <p className="text-xs text-[var(--text-muted)] font-body -mt-2">
            Comments are moderated before appearing on the product page and
            homepage testimonials.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MessageSquare size={16} />
            )}
            <span>{loading ? "Submitting…" : submitLabel}</span>
          </button>
        </form>
      </SignedIn>
    </>
  );
}
