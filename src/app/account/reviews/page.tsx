"use client";

import TestimonialForm from "@/components/TestimonialForm";
import Link from "next/link";

export default function ReviewsPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-14 px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
            Your Account
          </p>
          <h1 className="section-title">Share Your Experience</h1>
          <p className="text-[var(--text-muted)] font-body mt-3 text-sm">
            Reviews are moderated before appearing on the site and homepage
            testimonials.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-14">
        <TestimonialForm
          signInRedirect="/account/reviews"
          submitLabel="Submit Review"
        />

        <p className="text-center mt-8 text-sm font-body text-[var(--text-muted)]">
          <Link href="/account/orders" className="text-gold hover:underline">
            ← Back to My Orders
          </Link>
        </p>
      </div>
    </div>
  );
}
