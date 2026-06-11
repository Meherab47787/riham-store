import type { Metadata } from "next";
import Link from "next/link";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { createCoupon } from "@/actions/admin/coupons";
import CouponForm from "@/components/admin/CouponForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "New Coupon" };

export default async function NewCouponPage() {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) redirect("/admin");

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/coupons" className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/25 hover:text-[#c9a84c] transition-colors mb-4 inline-block">
          ← Back to Coupons
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-1">Create</p>
        <h1 className="text-2xl font-extralight tracking-[0.1em] text-[#f5f0e8]">New Coupon</h1>
      </div>
      <div className="bg-[#111] border border-[#1a1a1a] p-6">
        <CouponForm action={createCoupon} submitLabel="Create Coupon" />
      </div>
    </div>
  );
}
