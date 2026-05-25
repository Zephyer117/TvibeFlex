import TestimonialCard from "@/components/TestimonialCard";
import TestimonialForm from "@/components/TestimonialForm";
import { getApprovedTestimonialsForProduct } from "@/lib/queries";

interface Props {
  productId: string;
  productName: string;
  productSlug: string;
}

export default async function ProductCommentsSection({
  productId,
  productName,
  productSlug,
}: Props) {
  const comments = await getApprovedTestimonialsForProduct(productId, 12).catch(
    () => []
  );

  return (
    <section className="mt-16 pt-16 border-t border-[var(--border)]">
      <div className="max-w-3xl">
        <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
          Community
        </p>
        <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-3">
          Customer Comments
        </h2>
        <p className="text-[var(--text-muted)] font-body text-sm mb-10">
          Share your experience with {productName}. Approved comments appear here
          and in Client Stories on our homepage.
        </p>
      </div>

      {comments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl">
          {comments.map((t) => (
            <TestimonialCard key={t._id} testimonial={t} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--text-muted)] font-body text-sm mb-10 max-w-xl">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <div className="max-w-xl">
        <TestimonialForm
          productId={productId}
          productName={productName}
          signInRedirect={`/product/${productSlug}`}
          submitLabel="Post Comment"
        />
      </div>
    </section>
  );
}
