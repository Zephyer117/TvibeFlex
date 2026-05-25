import { NextRequest, NextResponse } from "next/server";
import { createCodOrder } from "@/lib/orders";
import { validateCartItems } from "@/lib/validate-order";
import { getAuthenticatedStoreUser } from "@/lib/auth";
import type { CartItem, CodCheckoutFormData } from "@/types";

function validateCustomerDetails(
  details: CodCheckoutFormData
): string | null {
  if (!details.fullName?.trim()) return "Full name is required.";
  if (!details.phone?.trim()) return "Phone number is required.";
  if (!/^[\d\s+\-()]{7,20}$/.test(details.phone.trim())) {
    return "Please enter a valid phone number.";
  }
  if (!details.address?.trim()) return "Address is required.";
  if (!details.city?.trim()) return "City is required.";
  if (!details.state?.trim()) return "State is required.";
  if (!details.postalCode?.trim()) return "Postal code is required.";
  if (
    details.email?.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())
  ) {
    return "Please enter a valid email address.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  const authResult = await getAuthenticatedStoreUser();
  if (!authResult.ok) {
    return NextResponse.json(
      { error: "Sign in to place an order.", requiresAuth: true },
      { status: authResult.status }
    );
  }

  try {
    const body = await req.json();
    const items: CartItem[] = body.items;
    const customerDetails: CodCheckoutFormData = {
      ...body.customerDetails,
      email: authResult.storeUser.email,
    };

    const customerError = validateCustomerDetails(customerDetails);
    if (customerError) {
      return NextResponse.json({ error: customerError }, { status: 400 });
    }

    const validation = await validateCartItems(items);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const order = await createCodOrder({
      lines: validation.lines,
      customerDetails,
      status: "pending",
      customerUserId: authResult.storeUser._id,
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order._id,
      total: order.total,
    });
  } catch (err) {
    console.error("COD order error:", err);
    const message =
      err instanceof Error && err.message.includes("Insufficient permissions")
        ? "Order could not be saved. Check Sanity API token permissions."
        : "Failed to place order. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
