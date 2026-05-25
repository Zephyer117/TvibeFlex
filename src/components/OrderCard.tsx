import Image from "next/image";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { formatVariationsLabel } from "@/lib/cart-utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import type { Order } from "@/types";

export default function OrderCard({ order }: { order: Order }) {
  const placedAt = order.orderPlacedAt || order._createdAt;

  return (
    <article className="card-luxury p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-[var(--border)]">
        <div>
          <p className="font-body font-semibold text-[var(--text-primary)]">
            Order <span className="text-gold">#{order.orderNumber}</span>
          </p>
          {placedAt && (
            <p className="text-xs text-[var(--text-muted)] font-body mt-0.5">
              {formatDateTime(placedAt)}
            </p>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-3 mb-5">
        {order.items?.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 text-sm font-body"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.image ? (
                <div className="relative w-10 h-12 shrink-0 overflow-hidden border border-[var(--border)]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] font-medium truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Qty: {item.quantity}
                  {item.variations?.length
                    ? ` · ${formatVariationsLabel(item.variations)}`
                    : ""}
                </p>
              </div>
            </div>
            <span className="text-[var(--text-primary)] font-medium shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-[var(--border)] text-sm font-body">
        {order.shippingAddress?.address && (
          <p className="text-xs text-[var(--text-muted)] max-w-md">
            {order.shippingAddress.address}, {order.shippingAddress.city}
            {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}{" "}
            {order.shippingAddress.postalCode}
          </p>
        )}
        <div className="text-right sm:ml-auto">
          <p className="text-xs text-[var(--text-muted)]">Total</p>
          <p className="font-semibold text-[var(--text-primary)] text-lg">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>
    </article>
  );
}
