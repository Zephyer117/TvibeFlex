"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Loader2, ShoppingBag, AlertCircle } from "lucide-react";
import OrderCard from "@/components/OrderCard";
import type { Order } from "@/types";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/account/orders");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load your orders.");
          return;
        }
        setOrders(data.orders ?? []);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="pt-16 min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
            Your Account
          </p>
          <h1 className="section-title">My Orders</h1>
          <p className="text-[var(--text-muted)] font-body mt-3 text-sm">
            Only orders linked to your signed-in account are shown here.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        {loading && (
          <div className="card-luxury p-12 flex flex-col items-center gap-3 text-[var(--text-muted)]">
            <Loader2 size={24} className="animate-spin text-gold" />
            <p className="font-body text-sm">Loading your orders…</p>
          </div>
        )}

        {!loading && error && (
          <div className="card-luxury p-8 flex items-start gap-4 border-red-500/30">
            <AlertCircle size={22} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-body font-semibold text-[var(--text-primary)] mb-1">
                Unable to load orders
              </p>
              <p className="text-red-400 text-sm font-body">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="card-luxury p-12 text-center">
            <Package size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
            <h2 className="font-display text-2xl text-[var(--text-primary)] mb-2">
              No orders yet
            </h2>
            <p className="text-[var(--text-muted)] font-body text-sm mb-8 max-w-sm mx-auto">
              When you place an order while signed in, it will appear here with
              status and delivery details.
            </p>
            <Link href="/shop" className="btn-gold inline-flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
