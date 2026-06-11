import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning" | "success"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    totalCustomers,
    revenueResult,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, inStock: true },
    }),
  ]);

  const totalRevenue = revenueResult._sum.total ?? 0;

  const stats = [
    { label: "Total Products", value: totalProducts },
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}` },
    { label: "Total Customers", value: totalCustomers },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Command Center</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-charcoal border border-border p-5"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-2">{stat.label}</p>
            <p className="text-2xl font-extralight text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Recent Orders</p>
            <Link href="/admin/orders" className="text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary/70 transition-colors">
              View All →
            </Link>
          </div>
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Order</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Customer</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Total</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-primary hover:text-primary/70">
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/60">{order.user?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/80">৳{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[order.status] ?? "default"} className="text-[9px] tracking-widest uppercase">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-xs text-foreground/30 tracking-widest uppercase">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Recent Products</p>
            <Link href="/admin/products" className="text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary/70 transition-colors">
              View All →
            </Link>
          </div>
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Stock</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}`} className="text-xs text-foreground/80 hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-light text-foreground/60">৳{product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] tracking-widest uppercase ${product.inStock ? "text-green-400/70" : "text-red-400/70"}`}>
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-xs text-foreground/30 tracking-widest uppercase">No products yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
