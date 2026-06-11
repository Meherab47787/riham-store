import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/ui/LogoutButton";
import { Package, User } from "lucide-react";

export const metadata: Metadata = { title: "My Account" };

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: { include: { product: { select: { name: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-16 px-6 text-center bg-charcoal border-b border-border">
        <p className="text-xs tracking-[0.5em] uppercase text-primary mb-3">My Account</p>
        <h1 className="text-4xl font-extralight tracking-[0.15em] uppercase text-foreground mb-6">
          {session.name}
        </h1>
        <Separator gold className="max-w-xs mx-auto" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="border border-border p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-light text-foreground truncate">{session.name}</p>
                  <p className="text-[10px] text-foreground/30 truncate">{session.email}</p>
                </div>
              </div>
              <Separator gold />
              <nav className="flex flex-col gap-1">
                <Link
                  href="/account"
                  className="text-xs tracking-[0.2em] uppercase text-primary py-2 border-l-2 border-primary pl-3"
                >
                  My Orders
                </Link>
                <Link
                  href="/shop"
                  className="text-xs tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70 py-2 pl-3 transition-colors duration-200"
                >
                  Browse Shop
                </Link>
              </nav>
              <Separator />
              <LogoutButton />
            </div>
          </aside>

          {/* Orders list */}
          <main className="lg:col-span-3">
            <h2 className="text-xs tracking-[0.4em] uppercase text-primary mb-8">My Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-20 border border-border">
                <Package className="h-10 w-10 mx-auto mb-4 text-foreground/10" />
                <p className="text-xs tracking-[0.3em] uppercase text-foreground/30 mb-6">No orders yet</p>
                <Link
                  href="/shop"
                  className="text-xs tracking-[0.25em] uppercase text-primary hover:text-gold-light transition-colors duration-200"
                >
                  Start Shopping →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="border border-border hover:border-primary/40 transition-colors duration-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/30">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs font-light text-foreground/50">
                        {order.items.map((i) => i.product.name).join(", ")}
                      </p>
                      <p className="text-[10px] text-foreground/25">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <Badge variant={statusVariant[order.status] ?? "secondary"}>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-extralight tracking-widest text-primary">
                        ৳ {order.total.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
