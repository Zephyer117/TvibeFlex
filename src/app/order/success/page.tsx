"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/context/cartStore";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Loader2, Banknote } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { formatVariationsLabel } from "@/lib/cart-utils";
import type { Order } from "@/types";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const clearCart = useCartStore((s) => s.clearCart);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clearCart();

    const fetchOrder = async () => {
      if (!searchParams.order) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/order?number=${encodeURIComponent(searchParams.order)}`
        );
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          setError("We could not load order details, but your order was placed.");
        }
      } catch {
        setError("We could not load order details, but your order was placed.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [clearCart, searchParams.order]);

  const placedAt = order?.orderPlacedAt || order?._createdAt;
  const customerName =
    order?.customer?.fullName ||
    [order?.customer?.firstName, order?.customer?.lastName]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-3">
            Order Placed Successfully
          </h1>
          <p className="text-[var(--text-secondary)] font-body">
            Thank you! Pay with cash when your order is delivered.
          </p>
          {searchParams.order && (
            <p className="mt-3 font-body text-gold font-semibold tracking-widest">
              Order ID: {searchParams.order}
            </p>
          )}
          {placedAt && (
            <p className="mt-2 text-xs text-[var(--text-muted)] font-body">
              {formatDateTime(placedAt)}
            </p>
          )}
        </div>

        {loading ? (
          <div className="card-luxury p-8 flex items-center justify-center gap-3 text-[var(--text-muted)]">
            <Loader2 size={18} className="animate-spin" />
            <span className="font-body text-sm">Loading order details…</span>
          </div>
        ) : order ? (
          <div className="card-luxury p-6 mb-8 space-y-5">
            <h2 className="font-body font-semibold text-xs tracking-widest uppercase text-[var(--text-muted)]">
              Order Summary
            </h2>

            <div className="flex items-center justify-between text-sm font-body pb-3 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="text-yellow-400 font-semibold capitalize">
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover border border-[var(--border)]"
                      />
                    )}
                    <div>
                      <p className="font-body text-sm font-medium text-[var(--text-primary)]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-body">
                        Qty: {item.quantity}
                        {item.variations?.length
                          ? ` · ${formatVariationsLabel(item.variations)}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <p className="font-body font-semibold text-sm text-[var(--text-primary)] shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm font-body pt-2">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    formatPrice(order.shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-[var(--text-primary)] text-base pt-2 border-t border-[var(--border)]">
                <span>Total (pay on delivery)</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="pt-3 border-t border-[var(--border)]">
                <p className="text-xs tracking-widest uppercase font-semibold text-[var(--text-muted)] mb-2">
                  Delivers To
                </p>
                <p className="font-body text-sm text-[var(--text-secondary)]">
                  {customerName}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                  {order.customer?.phone && (
                    <>
                      <br />
                      {order.customer.phone}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="card-luxury p-6 mb-8 flex items-center gap-4">
            <Package size={22} className="text-gold shrink-0" />
            <div>
              <p className="font-body font-semibold text-[var(--text-primary)] text-sm">
                {error || "Your COD order has been received."}
              </p>
              <p className="text-[var(--text-muted)] text-xs font-body mt-1">
                Save your order ID to track delivery status.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 card-luxury p-4 mb-8 text-sm text-[var(--text-muted)] font-body">
          <Banknote size={16} className="text-gold shrink-0" />
          <span>
            Payment method: Cash on Delivery. Our team will contact you to confirm
            your order.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders" className="btn-outline inline-flex items-center justify-center">
            Track Order
          </Link>
          <Link href="/shop" className="btn-gold inline-flex items-center justify-center gap-2">
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
