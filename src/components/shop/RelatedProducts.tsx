import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface RelatedProductsProps {
  currentSlug: string;
}

export default async function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const related = await prisma.product.findMany({
    where: { slug: { not: currentSlug } },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  if (related.length === 0) return null;

  return (
    <section className="py-20 px-6 lg:px-12 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: "#c9a84c" }}>
              You May Also Like
            </p>
            <h2 className="text-2xl font-extralight tracking-[0.1em] uppercase text-[#f5f0e8]">
              Related Scents
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30 hover:text-[#c9a84c] transition-colors duration-300"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {related.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111111] mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-1">
                {product.gender}
              </p>
              <h3 className="text-sm font-light tracking-[0.15em] uppercase text-[#f5f0e8] group-hover:text-[#c9a84c] transition-colors duration-300 mb-2">
                {product.name}
              </h3>
              <span className="text-xs font-light" style={{ color: "#c9a84c" }}>
                ৳ {product.price.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
