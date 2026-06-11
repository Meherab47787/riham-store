import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import { Separator } from "@/components/ui/separator";
import ShopFilters from "./ShopFilters";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore Riham's full collection of luxury inspired fragrances.",
};

interface PageProps {
  searchParams: Promise<{ season?: string; gender?: string }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { season, gender } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      ...(season && season !== "all" ? { season } : {}),
      ...(gender && gender !== "all" ? { gender } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const allSeasons = await prisma.product
    .findMany({ select: { season: true }, distinct: ["season"] })
    .then((r) => r.map((p) => p.season));

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="py-20 px-6 text-center bg-charcoal border-b border-border">
        <p
          className="text-xs tracking-[0.5em] uppercase mb-4 text-primary animate-fade-in-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          The Full Collection
        </p>
        <h1
          className="text-4xl sm:text-6xl font-extralight tracking-[0.15em] uppercase text-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.25s", opacity: 0 }}
        >
          Shop All Fragrances
        </h1>
        <Separator gold className="max-w-xs mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Filter bar — Suspense required for useSearchParams inside ShopFilters */}
        <Suspense fallback={<div className="h-16 border-b border-border mb-12" />}>
          <ShopFilters seasons={allSeasons} activeSeason={season} />
        </Suspense>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-foreground/30 text-xs tracking-[0.4em] uppercase">No fragrances found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
