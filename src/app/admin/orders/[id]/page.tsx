import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import UpdateOrderStatusForm from "./_UpdateOrderStatusForm";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning" | "success"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, images: true } },
        },
      },
    },
  });

  if (!order) notFound();

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Commerce</p>
          <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <Badge variant={STATUS_BADGE[order.status] ?? "default"} className="text-[10px] tracking-widest uppercase px-3 py-1.5">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Info */}
        <div className="bg-charcoal border border-border p-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">Customer</p>
          <p className="text-sm font-light text-foreground mb-1">{order.user?.name ?? "—"}</p>
          <p className="text-xs text-foreground/50">{order.user?.email ?? "—"}</p>
          {order.phone && <p className="text-xs text-foreground/50 mt-1">{order.phone}</p>}
        </div>

        {/* Shipping */}
        <div className="bg-charcoal border border-border p-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">Shipping Address</p>
          <p className="text-xs font-light text-foreground/70 leading-relaxed whitespace-pre-line">
            {order.address || "—"}
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-charcoal border border-border p-5">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">Order Info</p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Date</span>
              <span className="text-xs text-foreground/70">
                {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between">
                <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Coupon</span>
                <span className="text-xs font-mono text-primary/70">{order.couponCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="bg-charcoal border border-border p-5 mb-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-2">Customer Note</p>
          <p className="text-xs font-light text-foreground/60 italic">{order.note}</p>
        </div>
      )}

      {/* Items */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">Order Items</p>
        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-charcoal">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Product</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Qty</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Unit Price</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 bg-charcoal/50">
                  <td className="px-4 py-3 text-xs font-light text-foreground/80">
                    {item.product?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/60">{item.quantity}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/60">৳{item.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/80">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-x border-b border-border bg-charcoal p-4 flex flex-col items-end gap-1.5">
          <div className="flex gap-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/30">Subtotal</span>
            <span className="text-xs text-foreground/60">৳{subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex gap-8">
              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/30">Discount</span>
              <span className="text-xs text-green-400/70">−৳{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex gap-8 pt-1.5 border-t border-border mt-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/50">Total</span>
            <span className="text-sm font-light text-foreground">৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-charcoal border border-border p-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-4">Update Status</p>
        <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
