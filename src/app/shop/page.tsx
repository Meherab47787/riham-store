import type { Metadata } from "next";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Riham's full collection of luxury inspired fragrances.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <div className="relative py-20 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        {/* Decorative lines */}
        <div className="gold-divider max-w-xs mx-auto mb-8" />
        <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "#c9a84c" }}>
          The Collection
        </p>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          All Fragrances
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-8" />
      </div>

      {/* Filter Bar */}
      <div className="border-b border-[#1a1a1a] px-6 lg:px-12 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-[#f5f0e8]/40 tracking-[0.2em] uppercase">
            {products.length} Fragrances
          </p>
          <div className="flex gap-6">
            {["All", "Male", "Female", "Unisex"].map((filter) => (
              <button
                key={filter}
                className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/40 hover:text-[#c9a84c] transition-colors duration-300 first:text-[#c9a84c]"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="border-t border-[#1a1a1a] py-16 text-center px-6">
        <p className="text-xs tracking-[0.4em] uppercase text-[#f5f0e8]/30 mb-4">
          Riham Fragrances
        </p>
        <p className="text-[#f5f0e8]/20 text-sm font-light">
          All prices in BDT · Free delivery on orders above ৳3,000
        </p>
      </div>
    </div>
  );
}
