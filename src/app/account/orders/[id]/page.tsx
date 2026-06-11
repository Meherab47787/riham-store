import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Order Details" };

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } } },
  });

  if (!order || order.userId !== session.userId) notFound();

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-foreground/30 hover:text-primary transition-colors duration-200 mb-10"
        >
          <ArrowLeft className="w-3 h-3" />
          My Orders
        </Link>

        {/* Order header */}
        <div className="border border-border p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-2">Order</p>
              <p className="text-sm font-mono tracking-widest text-foreground/60">
                #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="text-[10px] text-foreground/25 mt-1">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant={statusVariant[order.status] ?? "secondary"}>{order.status}</Badge>
          </div>

          <Separator gold className="mb-6" />

          {/* Items */}
          <div className="flex flex-col divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5 items-center">
                <div className="relative w-16 h-20 shrink-0 bg-charcoal">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.product.slug}`}
                    className="text-xs font-light tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors duration-200"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[10px] text-foreground/30 mt-1">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-light text-primary shrink-0">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <Separator gold className="mt-2 mb-6" />

          {/* Totals */}
          <div className="flex flex-col gap-2 text-xs">
            {order.discount > 0 && (
              <div className="flex justify-between text-foreground/40">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span className="text-primary">− ৳ {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="tracking-[0.2em] uppercase text-foreground/50">Total</span>
              <span className="text-lg font-extralight tracking-widest text-primary">
                ৳ {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="border border-border p-6 flex flex-col gap-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary">Delivery Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-foreground/50">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Phone</p>
              <p>{order.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Address</p>
              <p className="leading-relaxed">{order.address ?? "—"}</p>
            </div>
            {order.note && (
              <div className="sm:col-span-2">
                <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Note</p>
                <p>{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
