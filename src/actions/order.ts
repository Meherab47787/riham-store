"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type OrderState = { error: string } | null;

export async function createOrder(
  prevState: OrderState,
  formData: FormData
): Promise<OrderState> {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const note = (formData.get("note") as string)?.trim();
  const cartItemsJson = formData.get("cartItems") as string;
  const couponCode = (formData.get("couponCode") as string)?.trim().toUpperCase() || null;
  const clientDiscount = parseInt(formData.get("discountAmount") as string, 10) || 0;

  if (!phone || !address) {
    return { error: "Phone number and delivery address are required." };
  }

  let cartItems: { productId: string; quantity: number }[];
  try {
    cartItems = JSON.parse(cartItemsJson || "[]");
  } catch {
    return { error: "Invalid cart data." };
  }

  if (!cartItems.length) {
    return { error: "Your cart is empty." };
  }

  // Validate products and prices from DB (never trust client-sent prices)
  const productIds = cartItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });

  if (products.length !== productIds.length) {
    return { error: "One or more products are no longer available." };
  }

  const priceMap = new Map(products.map((p) => [p.id, p.price]));
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity,
    0
  );

  // Re-validate coupon server-side so discount can't be spoofed
  let discount = 0;
  let validatedCouponCode: string | null = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt >= new Date()) &&
      (coupon.maxUses === null || coupon.usedCount < coupon.maxUses) &&
      subtotal >= coupon.minOrder
    ) {
      discount =
        coupon.discountType === "PERCENTAGE"
          ? Math.round((subtotal * coupon.discountValue) / 100)
          : Math.min(coupon.discountValue, subtotal);

      // Sanity check: client-computed discount should match server (allow ±1 for rounding)
      if (Math.abs(discount - clientDiscount) <= 1) {
        validatedCouponCode = coupon.code;
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      total,
      discount,
      couponCode: validatedCouponCode,
      phone,
      address,
      note: note || null,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: priceMap.get(item.productId)!,
        })),
      },
    },
  });

  // Increment coupon usage after successful order
  if (validatedCouponCode) {
    await prisma.coupon.update({
      where: { code: validatedCouponCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  revalidatePath("/account");
  redirect(`/account/orders/${order.id}`);
}
