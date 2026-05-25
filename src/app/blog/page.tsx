import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/queries";
import { urlForImage } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = await getAllPosts().catch(() => []);

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">Stories & Insights</p>
          <h1 className="section-title">The Journal</h1>
          <p className="text-[var(--text-muted)] font-body mt-3 max-w-xl mx-auto text-sm">
            Perspectives on craft, design, and the art of living well.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[var(--text-muted)]">No articles yet</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug.current}`} className="group grid md:grid-cols-2 gap-8 mb-16 card-luxury overflow-hidden">
                {posts[0].mainImage && (
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image src={urlForImage(posts[0].mainImage, 800, 500)} alt={posts[0].title}
                      fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex flex-col justify-center p-8">
                  <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold mb-3">Featured</p>
                  <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] leading-tight group-hover:text-gold transition-colors mb-4">
                    {posts[0].title}
                  </h2>
                  {posts[0].excerpt && (
                    <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-5">{posts[0].excerpt}</p>
                  )}
                  <div className="flex items-center gap-3">
                    {posts[0].author?.name && (
                      <span className="text-[var(--text-muted)] text-xs font-body">{posts[0].author.name}</span>
                    )}
                    <span className="text-[var(--border)]">·</span>
                    <span className="text-[var(--text-muted)] text-xs font-body">{formatDate(posts[0].publishedAt)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`} className="group card-luxury overflow-hidden">
                  {post.mainImage && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <Image src={urlForImage(post.mainImage, 600, 340)} alt={post.title}
                        width={600} height={340}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[var(--text-muted)] text-xs font-body mb-2">{formatDate(post.publishedAt)}</p>
                    <h3 className="font-display text-[var(--text-primary)] font-medium text-xl leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-[var(--text-muted)] text-sm font-body line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
