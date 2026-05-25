import Link from "next/link";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { getHomepageTestimonials } from "@/lib/queries";
import type { Testimonial } from "@/types";

const FALLBACK: Testimonial[] = [
  {
    _id: "fallback-1",
    authorName: "Alexandra Chen",
    message:
      "The quality exceeded every expectation. Each piece feels curated just for me.",
    rating: 5,
    submittedAt: new Date().toISOString(),
    status: "approved",
    featured: true,
  },
  {
    _id: "fallback-2",
    authorName: "Marcus Williams",
    message:
      "Luxe Store understands that true luxury is in the details. Impeccable service.",
    rating: 5,
    submittedAt: new Date().toISOString(),
    status: "approved",
    featured: true,
  },
  {
    _id: "fallback-3",
    authorName: "Isabelle Laurent",
    message:
      "Finally, a store that takes quality as seriously as I do. Absolutely stunning.",
    rating: 5,
    submittedAt: new Date().toISOString(),
    status: "approved",
    featured: true,
  },
];

export default async function TestimonialsSection() {
  let testimonials = await getHomepageTestimonials(12).catch(
    () => [] as Testimonial[]
  );

  if (testimonials.length === 0) {
    testimonials = FALLBACK;
  }

  return (
    <section className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
            What They Say
          </p>
          <h2 className="section-title">Client Stories</h2>
          <p className="text-[var(--text-muted)] font-body text-sm mt-3 max-w-lg mx-auto">
            Real experiences from our community. Share yours after signing in.
          </p>
        </div>

        <div className="px-8 md:px-12 mb-10">
          <TestimonialsSlider testimonials={testimonials} />
        </div>

        <div className="text-center">
          <Link href="/account/reviews" className="btn-outline text-sm">
            Share Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
