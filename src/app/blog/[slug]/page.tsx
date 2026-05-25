import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllPosts } from "@/lib/queries";
import { urlForImage } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await getAllPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  return { title: post?.title || "Article" };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) notFound();

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      {post.mainImage && (
        <div className="relative h-[55vh] overflow-hidden">
          <Image src={urlForImage(post.mainImage, 1400, 700)} alt={post.title}
            fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-14">
        <Link href="/blog" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-gold transition-colors text-sm font-body mb-8">
          <ArrowLeft size={14} />
          <span>Back to Journal</span>
        </Link>

        <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--text-primary)] leading-tight mb-6">
          {post.title}
        </h1>

        {post.author && (
          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-[var(--border)]">
            {post.author.image && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={urlForImage(post.author.image, 80, 80)} alt={post.author.name} fill className="object-cover" />
              </div>
            )}
            <div>
              <p className="font-body font-semibold text-[var(--text-primary)] text-sm">{post.author.name}</p>
              {post.author.bio && <p className="text-[var(--text-muted)] text-xs font-body">{post.author.bio}</p>}
            </div>
          </div>
        )}

        {post.excerpt && (
          <p className="font-body text-lg text-[var(--text-secondary)] leading-relaxed mb-8 italic">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg font-body text-[var(--text-secondary)] leading-relaxed [&>p]:mb-5 [&>h2]:font-display [&>h2]:text-[var(--text-primary)] [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4">
          <PortableText value={post.body} />
        </div>
      </div>
    </div>
  );
}
