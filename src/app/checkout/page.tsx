"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/context/cartStore";
import { formatPrice } from "@/lib/utils";
import { formatVariationsLabel } from "@/lib/cart-utils";
import { Banknote, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import type { CodCheckoutFormData } from "@/types";
import {
  FREE_SHIPPING_THRESHOLD,
  getShippingCost,
} from "@/lib/shipping";

const INITIAL_FORM: CodCheckoutFormData = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  email: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CodCheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = totalPrice();
  const shipping = getShippingCost(total);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      "";
    setForm((f) => ({
      ...f,
      fullName: f.fullName || name,
      email: user.primaryEmailAddress?.emailAddress || f.email,
    }));
  }, [isLoaded, user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[\d\s+\-()]{7,20}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required";
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Invalid email address";
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
  };

  const handlePlaceOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customerDetails: form }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresAuth) {
          toast.error("Please sign in to place your order.");
          router.push("/sign-in?redirect_url=/checkout");
          return;
        }
        toast.error(data.error || "Could not place order. Please try again.");
        return;
      }

      toast.success("Order placed successfully!");
      router.push(`/order/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-[var(--text-primary)] mb-4">
            Your cart is empty
          </p>
          <Link href="/shop" className="btn-gold inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-2">
          Checkout
        </h1>
        <p className="text-[var(--text-muted)] font-body text-sm mb-10">
          Pay with cash when your order is delivered.
        </p>

        <SignedOut>
          <div className="card-luxury p-8 text-center mb-10 max-w-lg mx-auto">
            <p className="font-body text-[var(--text-secondary)] mb-6">
              Sign in with your email to place an order and view it later in My Orders.
            </p>
            <Link href="/sign-in?redirect_url=/checkout" className="btn-gold inline-flex">
              Sign In to Continue
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <div>
              <h2 className="font-body text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] mb-5 flex items-center gap-3">
                <span className="w-6 h-6 bg-gold text-obsidian text-xs font-bold flex items-center justify-center">
                  1
                </span>
                Customer Details
              </h2>
              <div className="space-y-3">
                <div>
                  <input
                    name="fullName"
                    placeholder="Full name *"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`input-luxury ${errors.fullName ? "border-red-500" : ""}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1 font-body">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={handleChange}
                    className={`input-luxury ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 font-body">{errors.phone}</p>
                  )}
                </div>
                {user?.primaryEmailAddress?.emailAddress && (
                  <p className="text-sm font-body text-[var(--text-muted)]">
                    Order updates:{" "}
                    <span className="text-[var(--text-primary)]">
                      {user.primaryEmailAddress.emailAddress}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-body text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] mb-5 flex items-center gap-3">
                <span className="w-6 h-6 bg-gold text-obsidian text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Delivery Address
              </h2>
              <div className="space-y-3">
                <div>
                  <textarea
                    name="address"
                    rows={3}
                    placeholder="Full address / location *"
                    value={form.address}
                    onChange={handleChange}
                    className={`input-luxury resize-none ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1 font-body">{errors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="city"
                      placeholder="City *"
                      value={form.city}
                      onChange={handleChange}
                      className={`input-luxury ${errors.city ? "border-red-500" : ""}`}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1 font-body">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      name="state"
                      placeholder="State *"
                      value={form.state}
                      onChange={handleChange}
                      className={`input-luxury ${errors.state ? "border-red-500" : ""}`}
                    />
                    {errors.state && (
                      <p className="text-red-400 text-xs mt-1 font-body">{errors.state}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    name="postalCode"
                    placeholder="Postal code *"
                    value={form.postalCode}
                    onChange={handleChange}
                    className={`input-luxury ${errors.postalCode ? "border-red-500" : ""}`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-400 text-xs mt-1 font-body">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card-luxury p-5 flex items-start gap-3">
              <Banknote size={16} className="text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-semibold text-[var(--text-primary)] text-sm mb-1">
                  Cash on Delivery
                </p>
                <p className="text-[var(--text-muted)] text-xs font-body leading-relaxed">
                  No online payment required. Pay the full amount in cash when your
                  order arrives. Your order will be saved and visible in Sanity for
                  fulfillment.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-luxury p-6 sticky top-24">
              <h2 className="font-body text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartKey} className="flex gap-3 items-center">
                    {item.image ? (
                      <div className="relative w-12 h-14 shrink-0 overflow-hidden border border-[var(--border)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-14 shrink-0 bg-[var(--bg-secondary)] border border-[var(--border)]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-[var(--text-primary)] line-clamp-1 font-medium">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-body">
                        Qty: {item.quantity}
                        {item.variations?.length
                          ? ` · ${formatVariationsLabel(item.variations)}`
                          : ""}
                      </p>
                    </div>
                    <p className="font-body text-sm font-semibold text-[var(--text-primary)] shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-400 font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {total < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-[var(--text-muted)] italic bg-[var(--bg-secondary)] px-3 py-2">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - total)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-semibold text-[var(--text-primary)] text-base pt-2 border-t border-[var(--border)]">
                  <span>Total (COD)</span>
                  <span>{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package size={14} />
                <span>
                  {loading ? "Placing order…" : "Place Order (Cash on Delivery)"}
                </span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </div>
        </SignedIn>
      </div>
    </div>
  );
}
