// ─── Sanity Image ──────────────────────────────────────────────────────────
export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

// ─── Category ──────────────────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  image?: SanityImage;
}

// ─── Product ───────────────────────────────────────────────────────────────
export interface ProductVariantOption {
  name: string;
  values: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  comparePrice?: number;
  images: SanityImage[];
  description: string;
  body?: PortableTextBlock[];
  category: Category;
  stock: number;
  featured?: boolean;
  tags?: string[];
  variantOptions?: ProductVariantOption[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any;

// ─── Author ────────────────────────────────────────────────────────────────
export interface Author {
  _id: string;
  name: string;
  bio?: string;
  image?: SanityImage;
}

// ─── Blog Post ─────────────────────────────────────────────────────────────
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body: PortableTextBlock[];
  mainImage?: SanityImage;
  author?: Author;
  categories?: string[];
  publishedAt: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export interface CartVariation {
  name: string;
  value: string;
}

export interface CartItem {
  /** Unique line id (product id, or product id + variation key) */
  cartKey: string;
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  variations?: CartVariation[];
}

export interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    imageUrl: string,
    variations?: CartVariation[]
  ) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// ─── Wishlist ───────────────────────────────────────────────────────────────
export interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  stock: number;
}

export interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product, imageUrl: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product, imageUrl: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;
}

// ─── Checkout Form (COD) ───────────────────────────────────────────────────
export interface CodCheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email?: string;
}

/** @deprecated Legacy Stripe checkout shape */
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// ─── Order (Sanity) ────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "delivered"
  | "cancelled"
  | "paid"
  | "processing"
  | "shipped";

export type PaymentMethod = "cod" | "stripe";

export interface OrderItemVariation {
  name: string;
  value: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variations?: OrderItemVariation[];
}

// ─── Store User (Sanity) ───────────────────────────────────────────────────
export interface StoreUser {
  _id: string;
  clerkId: string;
  email: string;
  fullName?: string;
  imageUrl?: string;
  phone?: string;
}

// ─── Newsletter & footer (Sanity) ──────────────────────────────────────────
export interface NewsletterSettings {
  eyebrow?: string;
  title: string;
  description?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export type SocialPlatform = "instagram" | "twitter" | "facebook";

export interface FooterSocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface FooterSettings {
  brandHighlight?: string;
  brandName?: string;
  tagline?: string;
  shopLinks?: FooterLink[];
  infoLinks?: FooterLink[];
  socialLinks?: FooterSocialLink[];
  copyrightText?: string;
  creditLine?: string;
}

// ─── Homepage stats (Sanity singleton) ─────────────────────────────────────
export interface HomepageStat {
  value: string;
  label: string;
}

export interface HomepageStats {
  _id: string;
  stats: HomepageStat[];
}

// ─── Testimonial (Sanity) ──────────────────────────────────────────────────
export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Testimonial {
  _id: string;
  authorName: string;
  authorImageUrl?: string;
  message: string;
  rating?: number;
  submittedAt: string;
  status: TestimonialStatus;
  featured?: boolean;
  product?: { _id: string; name: string };
  user?: { _id: string; fullName?: string; imageUrl?: string };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerUser?: { _ref: string } | StoreUser;
  paymentMethod?: PaymentMethod;
  orderPlacedAt?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  customer: {
    fullName?: string;
    phone?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  _createdAt: string;
}
