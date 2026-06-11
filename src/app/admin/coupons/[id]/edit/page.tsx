import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { updateCoupon } from "@/actions/admin/coupons";
import CouponForm from "@/components/admin/CouponForm";

export const metadata: Metadata = { title: "Edit Coupon" };

interface Props { params: Promise<{ id: string }> }

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) redirect("/admin");

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const boundAction = updateCoupon.bind(null, id);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/coupons" className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/25 hover:text-[#c9a84c] transition-colors mb-4 inline-block">
          ← Back to Coupons
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-1">Editing</p>
        <h1 className="text-2xl font-extralight tracking-[0.1em] text-[#f5f0e8] font-mono">{coupon.code}</h1>
        <p className="text-xs text-[#f5f0e8]/30 mt-1">{coupon.usedCount} uses so far</p>
      </div>
      <div className="bg-[#111] border border-[#1a1a1a] p-6">
        <CouponForm action={boundAction} coupon={coupon} submitLabel="Update Coupon" />
      </div>
    </div>
  );
}
