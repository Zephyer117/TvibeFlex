import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import ProductCard from "@/components/ProductCard";
import {
  getFeaturedProducts,
  getAllCategories,
  getRecentPosts,
  getHomepageStats,
  DEFAULT_HOMEPAGE_STATS,
  getNewsletterSettings,
  DEFAULT_NEWSLETTER_SETTINGS,
} from "@/lib/queries";
import { urlForImage } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [products, categories, posts, stats, newsletterSettings] =
    await Promise.all([
      getFeaturedProducts().catch(() => []),
      getAllCategories().catch(() => []),
      getRecentPosts(3).catch(() => []),
      getHomepageStats().catch(() => DEFAULT_HOMEPAGE_STATS),
      getNewsletterSettings().catch(() => DEFAULT_NEWSLETTER_SETTINGS),
    ]);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg-secondary)] to-[var(--bg)]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)", backgroundSize: "48px 48px" }} />

        {/* Gold orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/8 rounded-full blur-2xl" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-6 animate-fade-in">
            New Collection 2024
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-semibold text-[var(--text-primary)] leading-[0.95] mb-8 animate-fade-up">
            Crafted for the{" "}
            <span className="italic gold-text">Exceptional</span>
          </h1>
          <p className="font-body text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-up"
            style={{ animationDelay: "0.1s" }}>
            Discover our curated selection of premium products, where every detail speaks to uncompromising quality and refined taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/shop" className="btn-gold inline-flex items-center gap-3">
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="btn-outline inline-flex items-center gap-3">
              <span>Our Story</span>
            </Link>
          </div>

          {/* Stats — from Sanity (Homepage Stats singleton) */}
          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-[var(--border)]">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl font-semibold gold-text">{value}</p>
                  <p className="text-[var(--text-muted)] text-xs tracking-widest uppercase mt-1 font-body">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">Browse By</p>
              <h2 className="section-title">Categories</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat._id} href={`/shop?category=${cat.slug.current}`}
                  className="group relative aspect-[3/4] overflow-hidden card-luxury">
                  {cat.image && (
                    <Image src={urlForImage(cat.image, 400, 500)} alt={cat.name}
                      fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-white text-xl font-semibold">{cat.name}</h3>
                    <p className="text-gold text-xs tracking-widest uppercase mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Shop Now <ArrowRight size={10} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Products ─────────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-24 px-6 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-4">
              <div>
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">Handpicked For You</p>
                <h2 className="section-title">Featured Products</h2>
              </div>
              <Link href="/shop" className="btn-outline text-sm shrink-0">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Features ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { Icon: Truck, title: "Free Shipping", desc: "Complimentary shipping on all orders over ৳5,000." },
            { Icon: Shield, title: "Authenticity Guarantee", desc: "Every product verified for premium quality." },
            { Icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free returns within 30 days of purchase." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 border border-gold/40 flex items-center justify-center">
                <Icon size={22} className="text-gold" />
              </div>
              <h3 className="font-body font-semibold text-[var(--text-primary)] tracking-wide">{title}</h3>
              <p className="text-[var(--text-muted)] text-sm font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Blog Preview ──────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">Stories & Insights</p>
              <h2 className="section-title">From Our Journal</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`}
                  className="group card-luxury overflow-hidden">
                  {post.mainImage && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <Image src={urlForImage(post.mainImage, 600, 340)} alt={post.title}
                        width={600} height={340}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[var(--text-muted)] text-xs font-body mb-2">{formatDate(post.publishedAt)}</p>
                    <h3 className="font-display text-[var(--text-primary)] font-medium text-lg leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-[var(--text-muted)] text-sm font-body mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/blog" className="btn-outline">Read All Articles</Link>
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection />

      <NewsletterSection settings={newsletterSettings} />
    </>
  );
}
