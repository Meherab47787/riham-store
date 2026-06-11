import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteCoupon } from "@/actions/admin/coupons";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Marketing</p>
          <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Coupons</h1>
        </div>
        <Link
          href="/admin/coupons/new"
          className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:bg-primary/80 transition-colors"
        >
          + New Coupon
        </Link>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Code</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Type</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Value</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Min Order</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Used / Max</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Active</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Expires</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const boundDelete = deleteCoupon.bind(null, coupon.id);
              return (
                <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors bg-charcoal/50">
                  <td className="px-4 py-3 font-mono text-xs text-primary/80 tracking-wider">{coupon.code}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/60">
                    {coupon.discountType === "PERCENTAGE" ? "%" : "Fixed ৳"}
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/80">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `৳${coupon.discountValue.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/50">
                    {coupon.minOrder > 0 ? `৳${coupon.minOrder.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/50">
                    {coupon.usedCount} / {coupon.maxUses ?? "∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase ${coupon.active ? "text-green-400/70" : "text-foreground/25"}`}>
                      {coupon.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/40">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/coupons/${coupon.id}`}
                        className="text-[10px] tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors px-3 py-1.5 border border-primary/30 hover:border-primary/60"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={boundDelete}
                        confirmMessage={`Delete coupon "${coupon.code}"? This cannot be undone.`}
                        label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-xs text-foreground/30 tracking-widest uppercase bg-charcoal/50">
                  No coupons yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
