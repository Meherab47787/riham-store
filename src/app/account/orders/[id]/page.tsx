import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ClearCart from "@/components/ui/ClearCart";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Order Confirmation" };

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-500/70 border-yellow-500/20",
  CONFIRMED: "text-blue-400/70 border-blue-400/20",
  SHIPPED: "text-purple-400/70 border-purple-400/20",
  DELIVERED: "text-green-500/70 border-green-500/20",
  CANCELLED: "text-red-400/70 border-red-400/20",
};

const statusMessages: Record<string, string> = {
  PENDING: "We've received your order and will contact you shortly to confirm.",
  CONFIRMED: "Your order has been confirmed! We're preparing your fragrance.",
  SHIPPED: "Your order is on the way!",
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
      <div className="py-16 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="gold-divider max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
          {order.status === "PENDING" ? "Order Placed" : "Order Details"}
        </p>
        <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          #{order.id.slice(-8).toUpperCase()}
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Status */}
        <div className="border border-[#1a1a1a] p-6 mb-8 text-center">
          <span
            className={`inline-block text-xs tracking-[0.2em] uppercase border px-4 py-1.5 mb-4 ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
          <p className="text-sm text-[#f5f0e8]/60 font-light leading-relaxed">
            {statusMessages[order.status]}
          </p>
        </div>

        {/* Items */}
        <div className="border border-[#1a1a1a] p-6 mb-6 flex flex-col gap-5">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]">Items Ordered</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-14 h-18 shrink-0 bg-[#111]">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-light tracking-[0.1em] uppercase text-[#f5f0e8] truncate">
                  {item.product.name}
                </p>
                <p className="text-[10px] text-[#f5f0e8]/40 mt-1">
                  ৳ {item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>
              <span className="text-xs font-light shrink-0" style={{ color: "#c9a84c" }}>
                ৳ {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="gold-divider" />
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/60">Total</span>
            <span className="text-xl font-extralight" style={{ color: "#c9a84c" }}>
              ৳ {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="border border-[#1a1a1a] p-6 mb-8">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c] mb-4">Delivery Info</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/30 w-20 shrink-0">
                Phone
              </span>
              <span className="text-xs text-[#f5f0e8]/60">{order.phone}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/30 w-20 shrink-0">
                Address
              </span>
              <span className="text-xs text-[#f5f0e8]/60">{order.address}</span>
            </div>
            {order.note && (
              <div className="flex gap-3">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/30 w-20 shrink-0">
                  Note
                </span>
                <span className="text-xs text-[#f5f0e8]/60">{order.note}</span>
              </div>
            )}
            <div className="flex gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/30 w-20 shrink-0">
                Placed
              </span>
              <span className="text-xs text-[#f5f0e8]/60">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/account"
            className="flex-1 text-center py-3.5 text-xs tracking-[0.3em] uppercase font-light border border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c] transition-all duration-300"
          >
            My Orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center py-3.5 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
              color: "#0a0a0a",
            }}
          >
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
}
