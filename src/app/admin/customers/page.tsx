import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: { select: { total: true, status: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Management</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">Customers</h1>
        <p className="text-xs text-foreground/30 mt-1">{customers.length} registered accounts</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Email", "Phone", "Orders", "Total Spent", "Member Since"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => {
              const completedOrders = c.orders.filter((o) => o.status !== "CANCELLED");
              const totalSpent = completedOrders.reduce((sum, o) => sum + o.total, 0);
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-7 h-7 rounded-none">
                        <AvatarFallback className="rounded-none text-[10px] bg-primary/10 text-primary">
                          {c.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground/70">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground/40">{c.email}</TableCell>
                  <TableCell className="text-foreground/30">{c.phone ?? "—"}</TableCell>
                  <TableCell className="text-foreground/50">{c.orders.length}</TableCell>
                  <TableCell className="text-primary/70">
                    {totalSpent > 0 ? `৳ ${totalSpent.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-foreground/30">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No customers yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
