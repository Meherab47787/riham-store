import { createProduct } from "@/actions/admin/products";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Inventory</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">New Product</h1>
      </div>
      <ProductForm action={createProduct} />
    </div>
  );
}
