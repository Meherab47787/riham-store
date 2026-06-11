import { prisma } from "@/lib/prisma";

export default async function AdminReportsPage() {
  const now = new Date();

  // Build last 6 months array
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    });
  }

  // Revenue by month (non-cancelled orders)
  const revenueByMonth = await Promise.all(
    months.map(async ({ year, month, label }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const result = await prisma.order.aggregate({
        _sum: { total: true },
        _count: { id: true },
        where: {
          status: { not: "CANCELLED" },
          createdAt: { gte: start, lt: end },
        },
      });
      return {
        label,
        revenue: result._sum.total ?? 0,
        orders: result._count.id,
      };
    })
  );

  // Top 10 products by order count
  const topProductItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const topProductIds = topProductItems.map((p) => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, price: true },
  });
  const productMap = new Map(topProductDetails.map((p) => [p.id, p]));

  const topProducts = topProductItems.map((item) => ({
    product: productMap.get(item.productId),
    quantity: item._sum.quantity ?? 0,
  }));

  // Order status breakdown
  const statusBreakdown = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
    _sum: { total: true },
  });

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Analytics</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Reports</h1>
      </div>

      {/* Revenue by Month */}
      <section className="mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">Revenue — Last 6 Months</p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {revenueByMonth.map(({ label, revenue, orders }) => (
            <div key={label} className="bg-charcoal border border-border p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-3">{label}</p>
              <p className="text-lg font-extralight text-foreground mb-1">৳{revenue.toLocaleString()}</p>
              <p className="text-[10px] text-foreground/30 tracking-widest uppercase">{orders} order{orders !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Breakdown */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">Order Status Breakdown</p>
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-charcoal">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Count</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {statusBreakdown.map((row) => (
                  <tr key={row.status} className="border-b border-border last:border-0 bg-charcoal/50">
                    <td className="px-4 py-3 text-xs font-light text-foreground/70 tracking-widest uppercase">{row.status}</td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/60">{row._count.id}</td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/60">
                      {row.status === "CANCELLED" ? "—" : `৳${(row._sum.total ?? 0).toLocaleString()}`}
                    </td>
                  </tr>
                ))}
                {statusBreakdown.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-xs text-foreground/30 tracking-widest uppercase">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Products */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">Top Products by Units Sold</p>
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-charcoal">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">#</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Product</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(({ product, quantity }, index) => (
                  <tr key={product?.id ?? index} className="border-b border-border last:border-0 bg-charcoal/50">
                    <td className="px-4 py-3 text-xs text-foreground/30">{index + 1}</td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/80">{product?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs font-light text-primary/70">{quantity}</td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-xs text-foreground/30 tracking-widest uppercase">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
