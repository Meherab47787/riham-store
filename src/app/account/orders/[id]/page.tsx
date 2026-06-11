import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ClearCart from "@/components/ui/ClearCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Order Confirmation" };

const STATUS_BADGE: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING:   "warning",
  CONFIRMED: "default",
  SHIPPED:   "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

const STATUS_MESSAGES: Record<string, string> = {
  PENDING:   "We've received your order and will contact you shortly to confirm.",
  CONFIRMED: "Your order has been confirmed! We're preparing your fragrance.",
  SHIPPED:   "Your order is on the way!",
  DELIVERED: "Your order has been delivered. Thank you for choosing Riham!",
  CANCELLED: "This order has been cancelled.",
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== session.userId) notFound();

  return (
    <div className="min-h-screen pt-20">
      <ClearCart />

      {/* Header */}
      <div className="py-16 px-6 text-center bg-charcoal border-b border-border">
        <Separator gold className="max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3 text-primary">
          {order.status === "PENDING" ? "Order Placed" : "Order Details"}
        </p>
        <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-foreground">
          #{order.id.slice(-8).toUpperCase()}
        </h1>
        <Separator gold className="max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Status */}
        <Card className="mb-8 text-center">
          <CardContent className="p-6">
            <Badge variant={STATUS_BADGE[order.status] ?? "secondary"} className="mb-4">
              {order.status}
            </Badge>
            <p className="text-sm text-foreground/60 font-light leading-relaxed">
              {STATUS_MESSAGES[order.status]}
            </p>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col gap-5">
            <p className="text-xs tracking-[0.4em] uppercase text-primary">Items Ordered</p>

            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-14 h-18 shrink-0 bg-charcoal">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-light tracking-widest uppercase text-foreground truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-1">
                    ৳ {item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-light shrink-0 text-primary">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <Separator gold />

            {order.discount > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.2em] uppercase text-foreground/40">Subtotal</span>
                  <span className="text-xs text-foreground/50">
                    ৳ {(order.total + order.discount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.2em] uppercase text-primary/60">
                    Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span className="text-xs text-primary">− ৳ {order.discount.toLocaleString()}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-xs tracking-[0.2em] uppercase text-foreground/60">Total</span>
              <span className="text-xl font-extralight text-primary">
                ৳ {order.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Delivery Info</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Phone", value: order.phone },
                { label: "Address", value: order.address },
                ...(order.note ? [{ label: "Note", value: order.note }] : []),
                {
                  label: "Placed",
                  value: new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  } as Intl.DateTimeFormatOptions),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 w-20 shrink-0">
                    {label}
                  </span>
                  <span className="text-xs text-foreground/60">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link href="/account">My Orders</Link>
          </Button>
          <Button size="lg" className="flex-1" asChild>
            <Link href="/shop">Shop More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
