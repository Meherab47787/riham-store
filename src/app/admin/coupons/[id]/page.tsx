import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCoupon } from "@/actions/admin/coupons";
import CouponForm from "@/components/admin/CouponForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const boundAction = updateCoupon.bind(null, coupon.id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Marketing</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">
          Edit Coupon — {coupon.code}
        </h1>
      </div>
      <CouponForm action={boundAction} coupon={coupon} submitLabel="Update Coupon" />
    </div>
  );
}
