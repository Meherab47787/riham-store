"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCartItems, removeFromCart, updateCartQuantity } from "@/lib/cart-store";
import type { CartItem } from "@/lib/cart-store";

function CartItemRow({
  item,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onRemove: () => void;
  onQty: (qty: number) => void;
}) {
  return (
    <div className="flex gap-5 py-6">
      <div className="relative w-20 h-28 shrink-0 bg-[#111]">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-light tracking-[0.15em] uppercase text-[#f5f0e8]">
            {item.name}
          </p>
          <span className="text-sm font-light shrink-0" style={{ color: "#c9a84c" }}>
            ৳ {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-[#f5f0e8]/30">৳ {item.price.toLocaleString()} each</p>
        <div className="flex items-center gap-4 mt-auto pt-2">
          <div className="flex items-center border border-[#2a2a2a]">
            <button
              onClick={() => onQty(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#f5f0e8]/40 hover:text-[#c9a84c] transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-xs text-[#f5f0e8]">{item.quantity}</span>
            <button
              onClick={() => onQty(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#f5f0e8]/40 hover:text-[#c9a84c] transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/25 hover:text-red-400 transition-colors duration-300"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setItems(getCartItems());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-[#f5f0e8]/30 text-xs tracking-[0.3em] uppercase">Loading...</div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-16 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="gold-divider max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
          Your Selection
        </p>
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          Shopping Cart
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-[0.4em] uppercase text-[#f5f0e8]/30 mb-6">
              Your cart is empty
            </p>
            <p className="text-[#f5f0e8]/40 text-sm font-light mb-8">
              Discover our collection and find your signature scent.
            </p>
            <Link
              href="/shop"
              className="inline-block text-xs tracking-[0.3em] uppercase px-10 py-3.5 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                color: "#0a0a0a",
              }}
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 flex flex-col divide-y divide-[#1a1a1a]">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemove={() => removeFromCart(item.productId)}
                  onQty={(qty) => updateCartQuantity(item.productId, qty)}
                />
              ))}
            </div>

            {/* Order summary */}
            <div className="flex flex-col gap-6">
              <div className="border border-[#1a1a1a] p-6 flex flex-col gap-5">
                <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]">
                  Order Summary
                </p>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs text-[#f5f0e8]/40">
                      <span className="font-light">{item.name} × {item.quantity}</span>
                      <span>৳ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="gold-divider" />
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/60">Total</span>
                  <span className="text-lg font-extralight tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                    ৳ {total.toLocaleString()}
                  </span>
                </div>
                {total < 3000 && (
                  <p className="text-[10px] text-[#f5f0e8]/30 leading-relaxed">
                    Add ৳ {(3000 - total).toLocaleString()} more for free delivery.
                  </p>
                )}
                <Link
                  href="/checkout"
                  className="text-center py-3.5 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                    color: "#0a0a0a",
                  }}
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="text-center text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30 hover:text-[#c9a84c] transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="border border-[#1a1a1a] p-5 flex flex-col gap-3">
                {[
                  { label: "Free Delivery", desc: "On orders above ৳3,000" },
                  { label: "Authentic", desc: "Premium ingredients only" },
                  { label: "Gift Packaging", desc: "Available on request" },
                ].map((feature) => (
                  <div key={feature.label} className="flex gap-3 items-start">
                    <span className="text-[#c9a84c] text-xs mt-0.5">✦</span>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/50">
                        {feature.label}
                      </p>
                      <p className="text-[10px] text-[#f5f0e8]/25">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
