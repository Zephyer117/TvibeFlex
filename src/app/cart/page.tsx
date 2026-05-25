"use client";

import { useCartStore } from "@/context/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { formatVariationsLabel } from "@/lib/cart-utils";
import {
  FREE_SHIPPING_THRESHOLD,
  getShippingCost,
} from "@/lib/shipping";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const total = totalPrice();
  const shipping = getShippingCost(total);

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={60} className="text-[var(--text-muted)] mx-auto mb-6" />
          <h1 className="font-display text-3xl text-[var(--text-primary)] mb-3">Your cart is empty</h1>
          <p className="text-[var(--text-muted)] font-body mb-8">Discover something extraordinary.</p>
          <Link href="/shop" className="btn-gold inline-flex items-center gap-3">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.cartKey} className="card-luxury p-5 flex gap-5 group">
                {item.image && (
                  <div className="relative w-24 h-30 shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${item.slug}`} className="font-body font-medium text-[var(--text-primary)] hover:text-gold transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.cartKey)}
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="font-body text-[var(--text-muted)] text-sm mt-1">{formatPrice(item.price)} each</p>
                  {item.variations?.length ? (
                    <p className="text-xs text-[var(--text-muted)] font-body mt-1">
                      {formatVariationsLabel(item.variations)}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-0 border border-[var(--border)]">
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-gold hover:bg-[var(--bg-secondary)] transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center font-body text-sm text-[var(--text-primary)]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-gold hover:bg-[var(--bg-secondary)] transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-body font-semibold text-[var(--text-primary)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link href="/shop" className="text-[var(--text-muted)] text-sm font-body hover:text-gold transition-colors">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-[var(--text-muted)] text-xs font-body hover:text-red-400 transition-colors tracking-widest uppercase">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card-luxury p-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-500">Free</span> : formatPrice(shipping)}</span>
                </div>
                {total < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - total)} more for free shipping
                  </p>
                )}
                <div className="h-px bg-[var(--border)] my-4" />
                <div className="flex justify-between font-semibold text-[var(--text-primary)] text-base">
                  <span>Total</span>
                  <span>{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-gold w-full flex items-center justify-center gap-3 mt-6">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>

              <p className="text-center text-xs text-[var(--text-muted)] font-body mt-4">
                Cash on Delivery at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
