import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImage } from "@/types";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "3tavxqc3";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV === "development") {
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is missing; using default project id."
  );
}
const apiVersion = "2024-01-01";

// ── Read-only client (CDN for speed) ──────────────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// ── Write client (mutations — orders, stock updates) ─────────────────────
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ── Image Builder ─────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export function urlForImage(source: SanityImage, width = 800, height = 800): string {
  try {
    return builder
      .image(source)
      .width(width)
      .height(height)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return "";
  }
}
