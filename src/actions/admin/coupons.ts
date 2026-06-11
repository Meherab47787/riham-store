"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";

export type CouponFormState = { error?: string; success?: boolean } | null;

export async function createCoupon(
  prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) return { error: "Unauthorized" };

  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED";
  const discountValue = parseInt(formData.get("discountValue") as string, 10);
  const minOrder = parseInt(formData.get("minOrder") as string, 10) || 0;
  const maxUsesRaw = formData.get("maxUses") as string;
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null;
  const expiresAtRaw = formData.get("expiresAt") as string;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!code) return { error: "Coupon code is required." };
  if (!discountType) return { error: "Discount type is required." };
  if (isNaN(discountValue) || discountValue <= 0) return { error: "Discount value must be a positive number." };
  if (discountType === "PERCENTAGE" && discountValue > 100) return { error: "Percentage discount cannot exceed 100." };

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) return { error: "A coupon with this code already exists." };

  await prisma.coupon.create({
    data: { code, discountType, discountValue, minOrder, maxUses, expiresAt, active: true },
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(
  id: string,
  prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) return { error: "Unauthorized" };

  const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED";
  const discountValue = parseInt(formData.get("discountValue") as string, 10);
  const minOrder = parseInt(formData.get("minOrder") as string, 10) || 0;
  const maxUsesRaw = formData.get("maxUses") as string;
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null;
  const expiresAtRaw = formData.get("expiresAt") as string;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
  const active = formData.get("active") === "on";

  if (isNaN(discountValue) || discountValue <= 0) return { error: "Discount value must be a positive number." };
  if (discountType === "PERCENTAGE" && discountValue > 100) return { error: "Percentage cannot exceed 100." };

  await prisma.coupon.update({
    where: { id },
    data: { discountType, discountValue, minOrder, maxUses, expiresAt, active },
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string): Promise<void> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) return;

  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
