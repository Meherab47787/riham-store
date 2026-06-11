import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Riham's full collection of luxury inspired fragrances.",
};

const GENDER_FILTERS = ["All", "Male", "Female", "Unisex"];

interface Props {
  searchParams: Promise<{ gender?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { gender } = await searchParams;
  const activeGender = GENDER_FILTERS.includes(gender ?? "") ? gender : undefined;

  const products = await prisma.product.findMany({
    where: activeGender ? { gender: activeGender } : undefined,
    orderBy: { createdAt: "asc" },
  });

  const totalCount = activeGender ? await prisma.product.count() : products.length;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-20 px-6 text-center bg-charcoal border-b border-border">
        <Separator gold className="max-w-xs mx-auto mb-8" />
        <p className="text-xs tracking-[0.5em] uppercase mb-4 text-primary">The Collection</p>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.15em] uppercase text-foreground">
          All Fragrances
        </h1>
        <Separator gold className="max-w-xs mx-auto mt-8" />
      </div>

      {/* Filter bar */}
      <div className="border-b border-border px-6 lg:px-12 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-foreground/40 tracking-[0.2em] uppercase">
            {products.length}{activeGender ? ` of ${totalCount}` : ""} Fragrances
          </p>
          <div className="flex gap-6">
            {GENDER_FILTERS.map((filter) => {
              const isActive = filter === "All" ? !activeGender : activeGender === filter;
              return (
                <Link
                  key={filter}
                  href={filter === "All" ? "/shop" : `/shop?gender=${filter}`}
                  className={cn(
                    "text-xs tracking-[0.2em] uppercase transition-colors duration-300",
                    isActive ? "text-primary" : "text-foreground/40 hover:text-primary"
                  )}
                >
                  {filter}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/30 text-sm font-light mb-6">
              No fragrances found for this filter.
            </p>
            <Button variant="ghost" asChild>
              <Link href="/shop">View all →</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Bottom banner */}
      <div className="border-t border-border py-16 text-center px-6">
        <p className="text-xs tracking-[0.4em] uppercase text-foreground/30 mb-4">
          Riham Fragrances
        </p>
        <p className="text-foreground/20 text-sm font-light">
          All prices in BDT · Free delivery on orders above ৳3,000
        </p>
      </div>
    </div>
  );
}
