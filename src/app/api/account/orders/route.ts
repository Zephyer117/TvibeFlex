import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStoreUser } from "@/lib/auth";
import {
  getOrdersForStoreUser,
  getOrderForStoreUser,
} from "@/lib/queries";

export async function GET(req: NextRequest) {
  const authResult = await getAuthenticatedStoreUser();
  if (!authResult.ok) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const { storeUser } = authResult;
  const orderNumber = new URL(req.url).searchParams.get("number");

  try {
    if (orderNumber) {
      const order = await getOrderForStoreUser(
        orderNumber.trim(),
        storeUser._id,
        storeUser.email
      );
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const orders = await getOrdersForStoreUser(storeUser._id, storeUser.email);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Account orders error:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
