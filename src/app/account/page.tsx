import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";

export const metadata: Metadata = { title: "My Account" };

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-500/70 border-yellow-500/20",
  CONFIRMED: "text-blue-400/70 border-blue-400/20",
  SHIPPED: "text-purple-400/70 border-purple-400/20",
  DELIVERED: "text-green-500/70 border-green-500/20",
  CANCELLED: "text-red-400/70 border-red-400/20",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-16 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="gold-divider max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
          Your Account
        </p>
        <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          {user.name}
        </h1>
        <p className="text-[#f5f0e8]/40 text-xs mt-2">{user.email}</p>
        <div className="gold-divider max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Profile card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { label: "Total Orders", value: user.orders.length },
            {
              label: "Total Spent",
              value: `৳ ${user.orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`,
            },
            { label: "Member Since", value: new Date(user.createdAt).getFullYear() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[#1a1a1a] p-6 text-center"
            >
              <p
                className="text-2xl font-extralight tracking-[0.05em] mb-1"
                style={{ color: "#c9a84c" }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a84c" }}>
            Order History
          </p>
          <LogoutButton />
        </div>

        {user.orders.length === 0 ? (
          <div className="text-center py-16 border border-[#1a1a1a]">
            <p className="text-[#f5f0e8]/30 text-sm font-light mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-block text-xs tracking-[0.3em] uppercase px-8 py-3"
              style={{
                background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                color: "#0a0a0a",
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {user.orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-[#1a1a1a] p-6 hover:border-[#c9a84c]/30 transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/30 mb-1">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#f5f0e8]/50">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] tracking-[0.2em] uppercase border px-3 py-1 ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span
                      className="text-sm font-extralight"
                      style={{ color: "#c9a84c" }}
                    >
                      ৳ {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-[10px] tracking-[0.1em] px-2 py-1 bg-[#111] text-[#f5f0e8]/30"
                    >
                      {item.product.name} × {item.quantity}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-[#c9a84c]/50 mt-3 group-hover:text-[#c9a84c] transition-colors">
                  View details →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
