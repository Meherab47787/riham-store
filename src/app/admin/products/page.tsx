import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct } from "@/actions/admin/products";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Inventory</p>
          <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:bg-primary/80 transition-colors"
        >
          + New Product
        </Link>
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Image</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Name</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Price</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Gender</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Season</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Featured</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Stock</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const coverImage = product.images[0] ?? null;
              const boundDelete = deleteProduct.bind(null, product.id);
              return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors bg-charcoal/50">
                  <td className="px-4 py-3">
                    <div className="w-10 h-12 bg-obsidian border border-border relative overflow-hidden">
                      {coverImage ? (
                        <Image src={coverImage} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-foreground/20 uppercase tracking-widest">
                          None
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-light text-foreground/80">{product.name}</p>
                    <p className="text-[10px] text-foreground/30 font-mono mt-0.5">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/70">৳{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/50">{product.gender}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/50">{product.season}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase ${product.featured ? "text-primary" : "text-foreground/25"}`}>
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase ${product.inStock ? "text-green-400/70" : "text-red-400/70"}`}>
                      {product.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-[10px] tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors px-3 py-1.5 border border-primary/30 hover:border-primary/60"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={boundDelete}
                        confirmMessage={`Are you sure you want to delete "${product.name}"? This cannot be undone.`}
                        label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-xs text-foreground/30 tracking-widest uppercase bg-charcoal/50">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
