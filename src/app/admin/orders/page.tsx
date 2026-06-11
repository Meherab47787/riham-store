import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning" | "success"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Commerce</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Orders</h1>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Order ID</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Customer</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Items</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Total</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Status</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Date</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors bg-charcoal/50">
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-foreground/60">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-light text-foreground/80">{order.user?.name ?? "—"}</p>
                  <p className="text-[10px] text-foreground/30">{order.user?.email ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-xs font-light text-foreground/50">{order._count.items}</td>
                <td className="px-4 py-3 text-xs font-light text-foreground/80">৳{order.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE[order.status] ?? "default"} className="text-[9px] tracking-widest uppercase">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs font-light text-foreground/40">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[10px] tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-xs text-foreground/30 tracking-widest uppercase bg-charcoal/50">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
