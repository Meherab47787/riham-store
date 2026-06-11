"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCartItems, removeFromCart, updateCartQuantity } from "@/lib/cart-store";
import type { CartItem } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag, Sparkles, Package, Gift } from "lucide-react";

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
      <div className="relative w-20 h-28 shrink-0 bg-charcoal">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-light tracking-[0.15em] uppercase text-foreground">{item.name}</p>
          <span className="text-sm font-light shrink-0 text-primary">
            ৳ {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-foreground/30">৳ {item.price.toLocaleString()} each</p>
        <div className="flex items-center gap-4 mt-auto pt-2">
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground/40 hover:text-primary"
              onClick={() => onQty(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-xs text-foreground">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground/40 hover:text-primary"
              onClick={() => onQty(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="text-foreground/25 hover:text-destructive gap-1"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
            Remove
          </Button>
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
        <p className="text-foreground/30 text-xs tracking-[0.3em] uppercase">Loading...</p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-16 px-6 text-center bg-charcoal border-b border-border">
        <Separator gold className="max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3 text-primary">Your Selection</p>
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-foreground">
          Shopping Cart
        </h1>
        <Separator gold className="max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 mx-auto mb-6 text-foreground/10" />
            <p className="text-xs tracking-[0.4em] uppercase text-foreground/30 mb-6">
              Your cart is empty
            </p>
            <p className="text-foreground/40 text-sm font-light mb-8">
              Discover our collection and find your signature scent.
            </p>
            <Button size="lg" asChild>
              <Link href="/shop">Browse Collection</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 flex flex-col divide-y divide-border">
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
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-xs text-foreground/40">
                        <span className="font-light">{item.name} × {item.quantity}</span>
                        <span>৳ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <Separator gold />

                  <div className="flex justify-between items-center">
                    <span className="text-xs tracking-[0.2em] uppercase text-foreground/60">Total</span>
                    <span className="text-lg font-extralight tracking-widest text-primary">
                      ৳ {total.toLocaleString()}
                    </span>
                  </div>

                  {total < 3000 && (
                    <p className="text-[10px] text-foreground/30 leading-relaxed">
                      Add ৳ {(3000 - total).toLocaleString()} more for free delivery.
                    </p>
                  )}

                  <Button size="lg" className="w-full mt-2" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-3 py-4">
                  {[
                    { icon: <Package className="h-3.5 w-3.5 text-primary" />, label: "Free Delivery", desc: "On orders above ৳3,000" },
                    { icon: <Sparkles className="h-3.5 w-3.5 text-primary" />, label: "Authentic", desc: "Premium ingredients only" },
                    { icon: <Gift className="h-3.5 w-3.5 text-primary" />, label: "Gift Packaging", desc: "Available on request" },
                  ].map((f) => (
                    <div key={f.label} className="flex gap-3 items-start">
                      {f.icon}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/50">{f.label}</p>
                        <p className="text-[10px] text-foreground/25">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
