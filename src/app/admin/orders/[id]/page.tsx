import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { updateOrderStatus } from "@/actions/admin/orders";
import type { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Order Detail" };

interface Props { params: Promise<{ id: string }> }

const ALL_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_BADGE: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING:   "warning",
  CONFIRMED: "default",
  SHIPPED:   "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  const canUpdate = hasPermission(session, PERMISSIONS.ORDER_UPDATE);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="xs" asChild className="mb-4 -ml-2">
            <Link href="/admin/orders">← Back to Orders</Link>
          </Button>
          <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Order</p>
          <h1 className="text-2xl font-extralight tracking-widest text-foreground font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <Badge variant={STATUS_BADGE[order.status] ?? "secondary"} className="self-start mt-10">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer */}
        <Card>
          <CardContent className="p-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">Customer</p>
            <p className="text-sm text-foreground/80">{order.user.name}</p>
            <p className="text-xs text-foreground/40 mt-1">{order.user.email}</p>
            {order.phone && <p className="text-xs text-foreground/40 mt-1">{order.phone}</p>}
            {order.address && (
              <p className="text-xs text-foreground/40 mt-2 leading-relaxed">{order.address}</p>
            )}
            {order.note && (
              <p className="text-xs text-foreground/30 mt-2 italic">&ldquo;{order.note}&rdquo;</p>
            )}
          </CardContent>
        </Card>

        {/* Update Status */}
        {canUpdate && (
          <Card>
            <CardContent className="p-5">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((s) => (
                  <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
                    <Button
                      type="submit"
                      variant={order.status === s ? "default" : "secondary"}
                      size="xs"
                      disabled={order.status === s}
                    >
                      {s}
                    </Button>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Items */}
      <Card>
        <CardHeader className="px-5 py-4 border-b border-border">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30">
            Order Items ({order.items.length})
          </p>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              {item.product.images[0] && (
                <div className="w-12 h-14 relative bg-obsidian shrink-0 overflow-hidden">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/80 font-light">{item.product.name}</p>
                <p className="text-xs text-foreground/30 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-primary/70">৳ {(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-[10px] text-foreground/25">৳ {item.price.toLocaleString()} ea.</p>
              </div>
            </div>
          ))}
        </CardContent>
        <div className="flex justify-end items-center gap-4 px-5 py-4 border-t border-border">
          <span className="text-xs tracking-[0.2em] uppercase text-foreground/30">Total</span>
          <span className="text-lg font-extralight text-primary">৳ {order.total.toLocaleString()}</span>
        </div>
      </Card>

      <p className="text-[10px] text-foreground/20 mt-4">
        Placed {new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
      </p>
    </div>
  );
}
