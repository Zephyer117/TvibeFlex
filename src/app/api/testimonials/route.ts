import { NextRequest, NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "@/lib/sanity";
import { getAuthenticatedStoreUser } from "@/lib/auth";
import {
  getApprovedTestimonials,
  getFeaturedTestimonials,
} from "@/lib/queries";

export async function GET(req: NextRequest) {
  const featured = new URL(req.url).searchParams.get("featured") === "true";

  try {
    const testimonials = featured
      ? await getFeaturedTestimonials(6)
      : await getApprovedTestimonials(12);
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error("Testimonials fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await getAuthenticatedStoreUser();
  if (!authResult.ok) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const rating =
      body.rating != null ? Number(body.rating) : undefined;
    const productId =
      typeof body.productId === "string" ? body.productId.trim() : "";

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please write at least 10 characters." },
        { status: 400 }
      );
    }
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Review must be under 1000 characters." },
        { status: 400 }
      );
    }
    if (rating != null && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return NextResponse.json(
        { error: "Rating must be a whole number from 1 to 5." },
        { status: 400 }
      );
    }

    const { storeUser } = authResult;
    const authorName =
      storeUser.fullName?.trim() ||
      storeUser.email.split("@")[0];

    let productRef: { _type: "reference"; _ref: string } | undefined;
    if (productId) {
      const exists = await sanityClient.fetch<boolean>(
        `defined(*[_type == "product" && _id == $productId][0]._id)`,
        { productId }
      );
      if (!exists) {
        return NextResponse.json(
          { error: "Invalid product." },
          { status: 400 }
        );
      }
      productRef = { _type: "reference", _ref: productId };
    }

    const doc = await sanityWriteClient.create({
      _type: "testimonial",
      user: { _type: "reference", _ref: storeUser._id },
      ...(productRef ? { product: productRef } : {}),
      authorName,
      authorImageUrl: storeUser.imageUrl || "",
      message,
      rating: rating ?? null,
      submittedAt: new Date().toISOString(),
      status: "pending",
      featured: false,
    });

    return NextResponse.json({
      success: true,
      id: doc._id,
      message:
        "Thank you! Your comment was submitted and will appear after approval.",
    });
  } catch (err) {
    console.error("Testimonial create error:", err);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
