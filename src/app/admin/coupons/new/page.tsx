import { createCoupon } from "@/actions/admin/coupons";
import CouponForm from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Marketing</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">New Coupon</h1>
      </div>
      <CouponForm action={createCoupon} />
    </div>
  );
}
