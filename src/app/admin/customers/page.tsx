import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">CRM</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Customers</h1>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Name</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Email</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Phone</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Orders</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors bg-charcoal/50">
                <td className="px-4 py-3 text-xs font-light text-foreground/80">{customer.name}</td>
                <td className="px-4 py-3 text-xs font-light text-foreground/60">{customer.email}</td>
                <td className="px-4 py-3 text-xs font-light text-foreground/50">{customer.phone ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-light text-foreground/60">{customer._count.orders}</td>
                <td className="px-4 py-3 text-xs font-light text-foreground/40">
                  {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-xs text-foreground/30 tracking-widest uppercase bg-charcoal/50">
                  No customers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
