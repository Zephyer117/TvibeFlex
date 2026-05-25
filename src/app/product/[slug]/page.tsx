import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProductBySlug, getAllProducts } from "@/lib/queries";
import { urlForImage } from "@/lib/sanity";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCommentsSection from "@/components/ProductCommentsSection";
import ProductGallery from "@/components/ProductGallery";
import WishlistButton from "@/components/WishlistButton";
import { Truck, Shield, RotateCcw } from "lucide-react";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const products = await getAllProducts().catch(() => []);
  return products.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug).catch(() => null);
  return { title: product?.name || "Product" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) notFound();

  const images = product.images?.map((img) => urlForImage(img, 800, 1000)) || [];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <ProductGallery images={images} productName={product.name} />

          {/* Details */}
          <div className="lg:sticky lg:top-24 self-start">
            {product.category && (
              <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4">
                {product.category.name}
              </p>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--text-primary)] leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-body font-semibold text-2xl text-[var(--text-primary)]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="font-body text-lg text-[var(--text-muted)] line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.comparePrice && (
                <span className="bg-gold text-obsidian text-xs font-bold px-2 py-1 tracking-widest uppercase">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>

            <div className="h-px bg-[var(--border)] mb-6" />

            <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-body text-[var(--text-muted)]">
                {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-3">
              <AddToCartButton product={product} imageUrl={images[0] || ""} />
              <WishlistButton
                product={product}
                imageUrl={images[0] || ""}
                variant="button"
              />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[var(--border)]">
              {[
                { Icon: Truck, label: "Free Shipping" },
                { Icon: Shield, label: "Authenticated" },
                { Icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={18} className="text-gold" />
                  <span className="text-[var(--text-muted)] text-xs font-body">{label}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[var(--border)]">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs border border-[var(--border)] text-[var(--text-muted)] px-3 py-1 font-body">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body Content */}
        {product.body && (
          <div className="mt-16 pt-16 border-t border-[var(--border)]">
            <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-8">Details</h2>
            <div className="prose prose-lg max-w-3xl font-body text-[var(--text-secondary)]">
              <PortableText value={product.body} />
            </div>
          </div>
        )}

        <ProductCommentsSection
          productId={product._id}
          productName={product.name}
          productSlug={product.slug.current}
        />
      </div>
    </div>
  );
}
