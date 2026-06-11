import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/actions/admin/products";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const boundAction = updateProduct.bind(null, product.id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Inventory</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">
          Edit Product — {product.name}
        </h1>
      </div>
      <ProductForm action={boundAction} product={product} submitLabel="Update Product" />
    </div>
  );
}
