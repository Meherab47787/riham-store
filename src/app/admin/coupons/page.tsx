import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { deleteCoupon } from "@/actions/admin/coupons";
import DeleteButton from "@/components/admin/DeleteButton";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.COUPON_MANAGE)) redirect("/admin");

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Promotions</p>
          <h1 className="text-2xl font-extralight tracking-widest text-foreground">Coupons</h1>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/coupons/new">
            <Plus className="h-3.5 w-3.5" />
            New Coupon
          </Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {["Code", "Discount", "Min Order", "Uses", "Expires", "Status", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => {
              const expired = c.expiresAt && c.expiresAt < new Date();
              const exhausted = c.maxUses !== null && c.usedCount >= c.maxUses;
              const isLive = c.active && !expired && !exhausted;

              return (
                <TableRow key={c.id}>
                  <TableCell className="font-mono tracking-widest text-primary/80">{c.code}</TableCell>
                  <TableCell className="text-foreground/70">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}%`
                      : `৳ ${c.discountValue.toLocaleString()}`}
                  </TableCell>
                  <TableCell className="text-foreground/40">
                    {c.minOrder > 0 ? `৳ ${c.minOrder.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-foreground/40">
                    {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                  </TableCell>
                  <TableCell className="text-foreground/40">
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isLive ? "success" : "destructive"}>
                      {isLive ? "Active" : expired ? "Expired" : exhausted ? "Used up" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="xs" asChild>
                        <Link href={`/admin/coupons/${c.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteButton
                        action={deleteCoupon.bind(null, c.id)}
                        confirmMessage={`Delete coupon "${c.code}"?`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No coupons yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
