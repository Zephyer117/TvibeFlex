import { sanityClient } from "./sanity";
import type {
  Product,
  Post,
  Category,
  Order,
  Testimonial,
  HomepageStat,
  HeroBannerSlide,
  HomepagePromoBanner,
  NewsletterSettings,
  FooterSettings,
} from "@/types";

const ORDER_FIELDS = `
  _id, orderNumber, paymentMethod, status, orderPlacedAt, _createdAt,
  subtotal, shippingCost, total,
  customer, shippingAddress,
  items[]{ productId, name, price, quantity, image, variations[]{ name, value } }
`;

const PRODUCT_FIELDS = `
  _id, name, slug, price, comparePrice, description,
  images, category->{_id,name,slug}, stock, featured, tags, variantOptions
`;

// ─── Products ─────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  return sanityClient.fetch(
    `*[_type == "product"] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return sanityClient.fetch(
    `*[_type == "product" && featured == true][0...8] { ${PRODUCT_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      ${PRODUCT_FIELDS}, body
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getAllProducts_slugs(): Promise<{ slug: { current: string } }[]> {
  return sanityClient.fetch(`*[_type == "product"]{ slug }`);
}

// ─── Categories ───────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(name asc) { _id, name, slug, description, image }`,
    {},
    { next: { revalidate: 120 } }
  );
}

// ─── Blog Posts ───────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, mainImage, publishedAt,
      author->{_id,name,image}, categories
    }`,
    {},
    { next: { revalidate: 120 } }
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, mainImage, publishedAt,
      author->{_id,name,bio,image}, categories
    }`,
    { slug },
    { next: { revalidate: 120 } }
  );
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...$limit] {
      _id, title, slug, excerpt, mainImage, publishedAt,
      author->{_id,name,image}
    }`,
    { limit },
    { next: { revalidate: 120 } }
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  return sanityClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber][0]`,
    { orderNumber },
    { cache: "no-store" }
  );
}

export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  return sanityClient.fetch(
    `*[_type == "order" && stripeSessionId == $sessionId][0]`,
    { sessionId },
    { cache: "no-store" }
  );
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  return sanityClient.fetch(
    `*[_type == "order" && customer.email == $email] | order(orderPlacedAt desc, _createdAt desc)`,
    { email },
    { cache: "no-store" }
  );
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  return sanityClient.fetch(
    `*[_type == "order" && customer.phone == $phone] | order(orderPlacedAt desc, _createdAt desc)`,
    { phone },
    { cache: "no-store" }
  );
}

/** Orders owned by authenticated Sanity storeUser only */
export async function getOrdersForStoreUser(
  storeUserId: string,
  email: string
): Promise<Order[]> {
  return sanityClient.fetch(
    `*[_type == "order" && (
      customerUser._ref == $storeUserId ||
      (!defined(customerUser) && customer.email == $email)
    )] | order(orderPlacedAt desc, _createdAt desc) {
      ${ORDER_FIELDS}
    }`,
    { storeUserId, email },
    { cache: "no-store" }
  );
}

export async function getOrderForStoreUser(
  orderNumber: string,
  storeUserId: string,
  email: string
): Promise<Order | null> {
  return sanityClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber && (
      customerUser._ref == $storeUserId ||
      (!defined(customerUser) && customer.email == $email)
    )][0] {
      ${ORDER_FIELDS}
    }`,
    { orderNumber, storeUserId, email },
    { cache: "no-store" }
  );
}

// ─── Newsletter & footer ────────────────────────────────────────────────────

export const DEFAULT_NEWSLETTER_SETTINGS: NewsletterSettings = {
  eyebrow: "Stay Informed",
  title: "Join the Inner Circle",
  description:
    "Be the first to know about new arrivals, exclusive offers, and curated stories.",
  emailPlaceholder: "Your email address",
  buttonLabel: "Subscribe",
  successMessage: "Thank you for subscribing!",
};

export async function getNewsletterSettings(): Promise<NewsletterSettings> {
  const doc = await sanityClient.fetch<NewsletterSettings | null>(
    `*[_type == "newsletterSettings" && _id == "newsletterSettings"][0]{
      eyebrow, title, description, emailPlaceholder, buttonLabel, successMessage
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  if (!doc?.title?.trim()) return DEFAULT_NEWSLETTER_SETTINGS;
  return { ...DEFAULT_NEWSLETTER_SETTINGS, ...doc };
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  brandHighlight: "TVibe",
  brandName: "Flex",
  tagline:
    "Premium products curated for the discerning individual. Crafted with excellence, delivered with care.",
  shopLinks: [
    { label: "All Products", href: "/shop" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Journal", href: "/blog" },
  ],
  infoLinks: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "My Orders", href: "/account/orders" },
  ],
  socialLinks: [],
  copyrightText: "© {year} TVibeFlex. All rights reserved.",
  creditLine: "Built with Next.js · Sanity",
};

export async function getFooterSettings(): Promise<FooterSettings> {
  const doc = await sanityClient.fetch<FooterSettings | null>(
    `*[_type == "footerSettings" && _id == "footerSettings"][0]{
      brandHighlight, brandName, tagline,
      shopLinks[]{ label, href },
      infoLinks[]{ label, href },
      socialLinks[]{ platform, url },
      copyrightText, creditLine
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
  if (!doc) return DEFAULT_FOOTER_SETTINGS;
  return {
    ...DEFAULT_FOOTER_SETTINGS,
    ...doc,
    shopLinks: doc.shopLinks?.length ? doc.shopLinks : DEFAULT_FOOTER_SETTINGS.shopLinks,
    infoLinks: doc.infoLinks?.length ? doc.infoLinks : DEFAULT_FOOTER_SETTINGS.infoLinks,
  };
}

// ─── Homepage stats ─────────────────────────────────────────────────────────

export const DEFAULT_HOMEPAGE_STATS: HomepageStat[] = [
  { value: "2,400+", label: "Happy Clients" },
  { value: "180+", label: "Premium Products" },
  { value: "15+", label: "Years of Craft" },
];

export async function getHomepageStats(): Promise<HomepageStat[]> {
  const doc = await sanityClient.fetch<{ stats?: HomepageStat[] } | null>(
    `*[_type == "homepageStats" && _id == "homepageStats"][0]{ stats }`,
    {},
    { next: { revalidate: 30 } }
  );

  const stats = doc?.stats?.filter(
    (s) => s?.value?.trim() && s?.label?.trim()
  );

  return stats?.length === 3 ? stats : DEFAULT_HOMEPAGE_STATS;
}

// ─── Homepage banners ───────────────────────────────────────────────────────

export async function getHomepageHeroBanners(): Promise<HeroBannerSlide[]> {
  const doc = await sanityClient.fetch<{ slides?: HeroBannerSlide[] } | null>(
    `*[_type == "homepageHeroBanners" && _id == "homepageHeroBanners"][0]{
      slides[]{
        _key, active, eyebrow, title, subtitle, ctaLabel, ctaHref, image
      }
    }`,
    {},
    { next: { revalidate: 60 } }
  );

  return (
    doc?.slides?.filter(
      (s) => s?.active !== false && s?.title?.trim() && s?.image
    ) ?? []
  );
}

export async function getHomepagePromoBanner(): Promise<HomepagePromoBanner | null> {
  const doc = await sanityClient.fetch<HomepagePromoBanner | null>(
    `*[_type == "homepagePromoBanner" && _id == "homepagePromoBanner"][0]{
      enabled, variant, eyebrow, title, description, endAt, ctaLabel, ctaHref, backgroundImage,
      "products": products[]->{ ${PRODUCT_FIELDS} }
    }`,
    {},
    { next: { revalidate: 60 } }
  );

  if (!doc?.enabled || !doc.title?.trim()) return null;

  const products = doc.products?.filter((p) => p?._id) ?? [];
  if (products.length === 0) return null;

  return { ...doc, products };
}

// ─── Testimonials ───────────────────────────────────────────────────────────

const TESTIMONIAL_FIELDS = `
  _id, authorName, authorImageUrl, message, rating, submittedAt, status, featured,
  product->{ _id, name }
`;

export async function getApprovedTestimonials(limit = 12): Promise<Testimonial[]> {
  return sanityClient.fetch(
    `*[_type == "testimonial" && status == "approved"] | order(submittedAt desc)[0...$limit] {
      ${TESTIMONIAL_FIELDS}
    }`,
    { limit },
    { next: { revalidate: 120 } }
  );
}

/** Featured first, then newest — single query for homepage slider */
export async function getHomepageTestimonials(limit = 12): Promise<Testimonial[]> {
  return sanityClient.fetch(
    `*[_type == "testimonial" && status == "approved"] | order(featured desc, submittedAt desc)[0...$limit] {
      ${TESTIMONIAL_FIELDS}
    }`,
    { limit },
    { next: { revalidate: 120 } }
  );
}

export async function getFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
  return sanityClient.fetch(
    `*[_type == "testimonial" && status == "approved" && featured == true] | order(submittedAt desc)[0...$limit] {
      ${TESTIMONIAL_FIELDS}
    }`,
    { limit },
    { next: { revalidate: 120 } }
  );
}

export async function getApprovedTestimonialsForProduct(
  productId: string,
  limit = 12
): Promise<Testimonial[]> {
  return sanityClient.fetch(
    `*[_type == "testimonial" && status == "approved" && product._ref == $productId] | order(submittedAt desc)[0...$limit] {
      ${TESTIMONIAL_FIELDS}
    }`,
    { productId, limit },
    { next: { revalidate: 120 } }
  );
}
