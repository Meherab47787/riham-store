import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Reports" };

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#facc15", CONFIRMED: "#60a5fa", SHIPPED: "#a78bfa",
  DELIVERED: "#34d399", CANCELLED: "#f87171",
};

export default async function AdminReportsPage() {
  const [ordersByStatus, topProducts, monthlyData, customerStats] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { id: true }, _sum: { total: true } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
        status: { not: "CANCELLED" },
      },
      select: { createdAt: true, total: true },
    }),
    prisma.user.aggregate({ where: { role: "CUSTOMER" }, _count: { id: true } }),
  ]);

  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  const monthMap: Record<string, { revenue: number; orders: number }> = {};
  for (const order of monthlyData) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[key]) monthMap[key] = { revenue: 0, orders: 0 };
    monthMap[key].revenue += order.total;
    monthMap[key].orders += 1;
  }
  const months = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b));
  const maxRevenue = Math.max(...months.map(([, d]) => d.revenue), 1);

  const totalRevenue = ordersByStatus.reduce(
    (s, o) => s + (o.status !== "CANCELLED" ? (o._sum.total ?? 0) : 0),
    0
  );
  const totalOrders = ordersByStatus.reduce((s, o) => s + o._count.id, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Analytics</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">Reports</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Revenue", value: `৳ ${totalRevenue.toLocaleString()}` },
          { label: "Total Orders", value: totalOrders.toString() },
          { label: "Customers", value: customerStats._count.id.toString() },
          {
            label: "Avg. Order Value",
            value: totalOrders > 0
              ? `৳ ${Math.round(totalRevenue / totalOrders).toLocaleString()}`
              : "—",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2">{s.label}</p>
              <p className="text-xl font-extralight text-primary">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Monthly Revenue Bar Chart */}
        <Card>
          <CardContent className="p-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-5">
              Revenue — Last 6 Months
            </p>
            {months.length > 0 ? (
              <div className="flex items-end gap-3 h-36">
                {months.map(([month, data]) => {
                  const pct = (data.revenue / maxRevenue) * 100;
                  const label = new Date(month + "-01").toLocaleDateString("en-GB", {
                    month: "short", year: "2-digit",
                  });
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                      <p className="text-[9px] text-foreground/30 truncate w-full text-center">
                        ৳{Math.round(data.revenue / 1000)}k
                      </p>
                      <div
                        className="w-full transition-all"
                        style={{
                          height: `${Math.max(pct, 4)}%`,
                          background: "linear-gradient(180deg, #e2c97e, #c9a84c)",
                        }}
                      />
                      <p className="text-[9px] text-foreground/25">{label}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-foreground/20 text-center py-10">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardContent className="p-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-5">
              Orders by Status
            </p>
            <div className="space-y-3">
              {ordersByStatus.map((row) => {
                const pct = totalOrders > 0 ? (row._count.id / totalOrders) * 100 : 0;
                return (
                  <div key={row.status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/40">
                        {row.status}
                      </span>
                      <span className="text-[10px] text-foreground/30">
                        {row._count.id} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: STATUS_COLORS[row.status] ?? "var(--color-primary)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {ordersByStatus.length === 0 && (
                <p className="text-xs text-foreground/20 text-center py-8">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="px-5 py-4 border-b border-border">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30">
            Top Products by Units Sold
          </p>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {["#", "Product", "Units Sold", "Orders"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((row, i) => {
              const product = productMap[row.productId];
              return (
                <TableRow key={row.productId}>
                  <TableCell className="text-foreground/20 font-mono">0{i + 1}</TableCell>
                  <TableCell className="text-foreground/70">{product?.name ?? "Unknown"}</TableCell>
                  <TableCell className="text-primary/70">{row._sum.quantity ?? 0}</TableCell>
                  <TableCell className="text-foreground/40">{row._count.id}</TableCell>
                </TableRow>
              );
            })}
            {topProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No sales data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
