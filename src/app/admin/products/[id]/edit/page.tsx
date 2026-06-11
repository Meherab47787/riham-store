import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { updateProduct } from "@/actions/admin/products";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit Product" };

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.PRODUCT_EDIT)) redirect("/admin/products");

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const boundAction = updateProduct.bind(null, id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/products" className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/25 hover:text-[#c9a84c] transition-colors mb-4 inline-block">
          ← Back to Products
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-1">Editing</p>
        <h1 className="text-2xl font-extralight tracking-[0.1em] text-[#f5f0e8]">{product.name}</h1>
      </div>
      <div className="bg-[#111] border border-[#1a1a1a] p-6">
        <ProductForm action={boundAction} product={product} submitLabel="Update Product" />
      </div>
    </div>
  );
}
