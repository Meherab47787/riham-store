"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCartItems } from "@/lib/cart-store";
import { createOrder } from "@/actions/order";
import { validateCoupon, type CouponResult } from "@/actions/coupon";
import type { CartItem } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Tag, X, Truck } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full mt-4 gap-2">
      <ShoppingBag className="h-3.5 w-3.5" />
      {pending ? "Placing order..." : "Place Order"}
    </Button>
  );
}

export default function CheckoutClient({ defaultPhone }: { defaultPhone: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState(createOrder, null);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<(CouponResult & { valid: true }) | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isPendingCoupon, startCouponTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const cart = getCartItems();
    if (cart.length === 0) { router.replace("/cart"); return; }
    setItems(cart);
  }, [router]);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-foreground/30 text-xs tracking-[0.3em] uppercase">Loading...</p>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon?.discountAmount ?? 0;
  const total = subtotal - discountAmount;
  const cartPayload = JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));

  function applyCoupon() {
    setCouponError("");
    setCoupon(null);
    startCouponTransition(async () => {
      const result = await validateCoupon(couponInput, subtotal);
      if (result.valid) setCoupon(result);
      else setCouponError(result.error);
    });
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-14 px-6 text-center bg-charcoal border-b border-border">
        <Separator gold className="max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3 text-primary">Final Step</p>
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-foreground">
          Checkout
        </h1>
        <Separator gold className="max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Delivery form */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-6 text-primary">Delivery Details</p>
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="cartItems" value={cartPayload} />
              <input type="hidden" name="couponCode" value={coupon?.code ?? ""} />
              <input type="hidden" name="discountAmount" value={discountAmount} />

              {state?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone / WhatsApp *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  defaultValue={defaultPhone}
                  placeholder="+880 1700 000 000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  placeholder="Full delivery address including area, city..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  name="note"
                  rows={2}
                  placeholder="Any special instructions or requests..."
                />
              </div>

              <div className="border border-border p-4 text-[10px] text-foreground/30 leading-relaxed flex items-start gap-2">
                <Truck className="h-4 w-4 text-primary/50 shrink-0 mt-0.5" />
                <span>
                  Payment method: <span className="text-primary/60">Cash on Delivery</span>
                  <br />
                  We will call/WhatsApp you to confirm before dispatching.
                </span>
              </div>

              <SubmitButton />
            </form>
          </div>

          {/* Order review */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-6 text-primary">Your Order</p>
            <Card>
              <CardContent className="flex flex-col gap-5 pt-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 shrink-0 bg-charcoal">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-light tracking-widest uppercase text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-foreground/40 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-light shrink-0 text-primary">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <Separator gold />

                {/* Coupon */}
                {!coupon ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="couponInput">
                      <Tag className="h-3 w-3 inline mr-1" />
                      Coupon Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="couponInput"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="font-mono tracking-widest"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={applyCoupon}
                        disabled={isPendingCoupon || !couponInput.trim()}
                      >
                        {isPendingCoupon ? "…" : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <Alert variant="destructive">
                        <AlertDescription>{couponError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/20">
                    <div>
                      <p className="text-xs font-mono tracking-widest text-primary">{coupon.code}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}% off`
                          : `৳${coupon.discountValue.toLocaleString()} off`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={removeCoupon}
                      className="text-destructive/50 hover:text-destructive gap-1"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                )}

                <Separator gold />

                {/* Totals */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40">Subtotal</span>
                    <span className="text-xs text-foreground/60">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-primary/60">Discount</span>
                      <Badge variant="default" className="text-[10px]">− ৳ {discountAmount.toLocaleString()}</Badge>
                    </div>
                  )}
                  <Separator className="my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs tracking-[0.2em] uppercase text-foreground/60">Total</span>
                    <span className="text-xl font-extralight tracking-widest text-primary">
                      ৳ {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-charcoal p-4 text-[10px] text-foreground/30 leading-relaxed">
                  We will contact you to confirm your order and arrange delivery. Payment is collected upon delivery.
                </div>
              </CardContent>
            </Card>

            <p className="text-center mt-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cart">← Back to cart</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
