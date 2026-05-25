import { NextRequest, NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "@/lib/sanity";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!process.env.SANITY_API_TOKEN) {
    console.error("Newsletter: SANITY_API_TOKEN is not set");
    return NextResponse.json(
      { error: "Newsletter is not configured. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const raw =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!raw || !EMAIL_RE.test(raw)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await sanityClient.fetch<boolean>(
      `defined(*[_type == "newsletterSubscriber" && email == $email][0]._id)`,
      { email: raw }
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed. Thank you!",
      });
    }

    await sanityWriteClient.create({
      _type: "newsletterSubscriber",
      email: raw,
      subscribedAt: new Date().toISOString(),
      source: "homepage",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing!",
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Could not subscribe. Please try again." },
      { status: 500 }
    );
  }
}
