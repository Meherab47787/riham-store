"use server";

import { prisma } from "@/lib/prisma";

export type CouponResult =
  | { valid: true; code: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; discountAmount: number }
  | { valid: false; error: string };

export async function validateCoupon(code: string, orderTotal: number): Promise<CouponResult> {
  if (!code?.trim()) return { valid: false, error: "Enter a coupon code." };

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

  if (!coupon) return { valid: false, error: "Invalid coupon code." };
  if (!coupon.active) return { valid: false, error: "This coupon is no longer active." };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, error: "This coupon has expired." };
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return { valid: false, error: "This coupon has reached its usage limit." };
  if (orderTotal < coupon.minOrder) return { valid: false, error: `Minimum order of ৳${coupon.minOrder.toLocaleString()} required.` };

  const discountAmount =
    coupon.discountType === "PERCENTAGE"
      ? Math.round((orderTotal * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, orderTotal);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
  };
}
