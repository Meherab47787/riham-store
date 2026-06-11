import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Orders" };

const STATUS_BADGE: Record<string, "warning" | "default" | "secondary" | "success" | "destructive"> = {
  PENDING:   "warning",
  CONFIRMED: "default",
  SHIPPED:   "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  const statuses = ["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Management</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">Orders</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {statuses.map((s) => {
          const active = s === "All" ? !status : status === s;
          return (
            <Button key={s} variant={active ? "default" : "ghost"} size="xs" asChild>
              <Link href={s === "All" ? "/admin/orders" : `/admin/orders?status=${s}`}>
                {s}
              </Link>
            </Button>
          );
        })}
        <span className="ml-auto text-xs text-foreground/30">{orders.length} orders</span>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-primary/60">
                  #{order.id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <p className="text-foreground/70">{order.user.name}</p>
                  <p className="text-[10px] text-foreground/30">{order.user.email}</p>
                </TableCell>
                <TableCell className="text-foreground/40">{order.items.length}</TableCell>
                <TableCell className="text-primary/70">৳ {order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[order.status] ?? "secondary"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground/30">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="xs" asChild>
                    <Link href={`/admin/orders/${order.id}`}>Manage →</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
