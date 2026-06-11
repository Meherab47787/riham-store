import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const STATUS_BADGE: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING:   "warning",
  CONFIRMED: "default",
  SHIPPED:   "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminDashboard() {
  const session = await getSession();

  const [revenue, totalOrders, totalProducts, totalCustomers, recentOrders, pendingCount] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

  const stats = [
    { label: "Total Revenue", value: `৳ ${(revenue._sum.total ?? 0).toLocaleString()}`, sub: "Excluding cancelled", icon: <TrendingUp className="h-5 w-5 text-primary" /> },
    { label: "Total Orders", value: totalOrders.toLocaleString(), sub: `${pendingCount} pending`, icon: <ShoppingBag className="h-5 w-5 text-blue-400" /> },
    { label: "Products", value: totalProducts.toLocaleString(), sub: "In catalogue", icon: <Package className="h-5 w-5 text-purple-400" /> },
    { label: "Customers", value: totalCustomers.toLocaleString(), sub: "Registered accounts", icon: <Users className="h-5 w-5 text-emerald-400" /> },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Overview</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">
          Welcome back, {session?.name.split(" ")[0]}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">{s.label}</p>
                {s.icon}
              </div>
              <p className="text-2xl font-extralight tracking-tight mb-1 text-foreground">{s.value}</p>
              <p className="text-[11px] text-foreground/25">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { href: "/admin/products/new", label: "Add Product" },
          { href: "/admin/orders", label: "View Orders" },
          { href: "/admin/customers", label: "Customers" },
          { href: "/admin/reports", label: "Reports" },
        ].map((a) => (
          <Button key={a.href} variant="secondary" size="sm" asChild className="justify-center">
            <Link href={a.href}>{a.label}</Link>
          </Button>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="ghost" size="xs" asChild>
            <Link href="/admin/orders">View All →</Link>
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary/70 hover:text-primary font-mono transition-colors"
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell className="text-foreground/60">{order.user.name}</TableCell>
                <TableCell className="text-foreground/40">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </TableCell>
                <TableCell className="text-primary/80">৳ {order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[order.status] ?? "secondary"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground/30">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
            {recentOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No orders yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
