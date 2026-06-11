import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { deleteProduct } from "@/actions/admin/products";
import DeleteButton from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Eye } from "lucide-react";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const session = await getSession();
  const canCreate = hasPermission(session, PERMISSIONS.PRODUCT_CREATE);
  const canEdit   = hasPermission(session, PERMISSIONS.PRODUCT_EDIT);
  const canDelete = hasPermission(session, PERMISSIONS.PRODUCT_DELETE);

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Catalogue</p>
          <h1 className="text-2xl font-extralight tracking-widest text-foreground">Products</h1>
        </div>
        {canCreate && (
          <Button asChild size="sm" className="gap-2">
            <Link href="/admin/products/new">
              <Plus className="h-3.5 w-3.5" />
              New Product
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {["Image", "Name", "Gender", "Season", "Price", "Stock", "Featured", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.images[0] ? (
                    <div className="w-10 h-12 relative bg-obsidian overflow-hidden">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-12 bg-smoke flex items-center justify-center text-foreground/20 text-[9px]">
                      –
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-foreground/80 font-light">{p.name}</p>
                  <p className="text-[10px] text-foreground/30 mt-0.5 font-mono">{p.slug}</p>
                </TableCell>
                <TableCell className="text-foreground/40">{p.gender}</TableCell>
                <TableCell className="text-foreground/40">{p.season}</TableCell>
                <TableCell className="text-primary/70">৳ {p.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={p.inStock ? "success" : "destructive"}>
                    {p.inStock ? "In Stock" : "Out"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {p.featured && (
                    <Badge variant="default">✦ Yes</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" asChild>
                      <Link href={`/shop/${p.slug}`} target="_blank">
                        <Eye className="h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    {canEdit && (
                      <Button variant="secondary" size="xs" asChild>
                        <Link href={`/admin/products/${p.id}/edit`}>
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                    )}
                    {canDelete && (
                      <DeleteButton
                        action={deleteProduct.bind(null, p.id)}
                        confirmMessage={`Delete "${p.name}"?`}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-foreground/20 tracking-[0.2em] uppercase">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
