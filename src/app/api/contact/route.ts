import { NextRequest, NextResponse } from "next/server";
import {
  isMailConfigured,
  sendContactEmail,
} from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isMailConfigured()) {
    console.error("Contact: GMAIL_USER or GMAIL_APP_PASSWORD is not set");
    return NextResponse.json(
      {
        error:
          "Email is not configured yet. Add Gmail credentials to .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject =
      typeof body.subject === "string" ? body.subject.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please write at least 10 characters in your message." },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({
      success: true,
      message: "Your message was sent. We'll reply within 24 hours.",
    });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }
}
