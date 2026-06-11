import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "My Account" };

const STATUS_BADGE: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING:   "warning",
  CONFIRMED: "default",
  SHIPPED:   "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
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
      <div className="py-16 px-6 text-center bg-charcoal border-b border-border">
        <Separator gold className="max-w-xs mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase mb-3 text-primary">Your Account</p>
        <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-foreground">
          {user.name}
        </h1>
        <p className="text-foreground/40 text-xs mt-2">{user.email}</p>
        <Separator gold className="max-w-xs mx-auto mt-6" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { label: "Total Orders", value: user.orders.length },
            { label: "Total Spent", value: `৳ ${user.orders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
            { label: "Member Since", value: new Date(user.createdAt).getFullYear() },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-extralight tracking-widest mb-1 text-primary">
                  {stat.value}
                </p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders header */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs tracking-[0.4em] uppercase text-primary">Order History</p>
          <LogoutButton />
        </div>

        {user.orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-foreground/30 text-sm font-light mb-6">
                You haven&apos;t placed any orders yet.
              </p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {user.orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-border p-6 hover:border-primary/30 transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-1">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-foreground/50">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_BADGE[order.status] ?? "secondary"}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-extralight text-primary">
                      ৳ {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <Badge key={item.id} variant="outline">
                      {item.product.name} × {item.quantity}
                    </Badge>
                  ))}
                </div>
                <p className="text-[10px] text-primary/50 mt-3 group-hover:text-primary transition-colors">
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
