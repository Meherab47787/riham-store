"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartItems } from "@/lib/cart-store";
import { createOrder } from "@/actions/order";
import type { CartItem } from "@/lib/cart-store";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 disabled:opacity-60 mt-4"
      style={{
        background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
        color: "#0a0a0a",
      }}
    >
      {pending ? "Placing order..." : "Place Order"}
    </button>
  );
}

export default function CheckoutClient({ defaultPhone }: { defaultPhone: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState(createOrder, null);

  useEffect(() => {
    setMounted(true);
    const cart = getCartItems();
    if (cart.length === 0) {
      router.replace("/cart");
      return;
    }
    setItems(cart);
  }, [router]);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-[#f5f0e8]/30 text-xs tracking-[0.3em] uppercase">Loading...</div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartPayload = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-14 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="gold-divider max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
          Final Step
        </p>
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          Checkout
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Delivery form */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "#c9a84c" }}>
              Delivery Details
            </p>
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="cartItems" value={cartPayload} />

              {state?.error && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="text-xs text-red-400">{state.error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Phone / WhatsApp *
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  defaultValue={defaultPhone}
                  placeholder="+880 1700 000 000"
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="Full delivery address including area, city..."
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Any special instructions or requests..."
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20 resize-none"
                />
              </div>

              <div className="border border-[#1a1a1a] p-4 text-[10px] text-[#f5f0e8]/30 leading-relaxed">
                Payment method: <span className="text-[#c9a84c]/60">Cash on Delivery</span>
                <br />
                We will call/WhatsApp you to confirm before dispatching.
              </div>

              <SubmitButton />
            </form>
          </div>

          {/* Order review */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "#c9a84c" }}>
              Your Order
            </p>
            <div className="border border-[#1a1a1a] p-6 flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 shrink-0 bg-[#111]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-light tracking-[0.1em] uppercase text-[#f5f0e8] truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#f5f0e8]/40 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-light shrink-0" style={{ color: "#c9a84c" }}>
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="gold-divider" />

              <div className="flex justify-between items-center">
                <span className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/60">Total</span>
                <span className="text-xl font-extralight tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                  ৳ {total.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#111] p-4 text-[10px] text-[#f5f0e8]/30 leading-relaxed">
                We will contact you to confirm your order and arrange delivery.
                Payment is collected upon delivery (Cash on Delivery).
              </div>
            </div>

            <p className="text-center mt-4">
              <Link href="/cart" className="text-xs text-[#f5f0e8]/30 hover:text-[#c9a84c] transition-colors">
                ← Back to cart
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
