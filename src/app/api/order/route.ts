import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStoreUser } from "@/lib/auth";
import { getOrderForStoreUser } from "@/lib/queries";

/**
 * Secure order lookup — authenticated users may only fetch their own orders.
 */
export async function GET(req: NextRequest) {
  const authResult = await getAuthenticatedStoreUser();
  if (!authResult.ok) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const number = new URL(req.url).searchParams.get("number");
  if (!number?.trim()) {
    return NextResponse.json(
      { error: "Provide ?number= with your order ID" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderForStoreUser(
      number.trim(),
      authResult.storeUser._id,
      authResult.storeUser.email
    );
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order lookup error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
