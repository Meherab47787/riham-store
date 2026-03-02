import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "#c9a84c" }}>
          The Collection
        </p>
        <h2 className="text-3xl sm:text-5xl font-extralight tracking-[0.1em] uppercase text-[#f5f0e8] mb-6">
          Signature Scents
        </h2>
        <div className="gold-divider max-w-xs mx-auto" />
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {featured.map((product, index) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group relative flex flex-col"
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111111] mb-6">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* View product label on hover */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-xs tracking-[0.3em] uppercase px-6 py-2 border border-[#c9a84c] text-[#c9a84c] bg-[#0a0a0a]/80">
                  Discover
                </span>
              </div>

              {/* Index number */}
              <div className="absolute top-4 left-4">
                <span className="text-xs tracking-[0.2em] text-[#c9a84c]/60">
                  0{index + 1}
                </span>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-2">
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a84c]/60">
                {product.season} · {product.gender}
              </p>
              <h3 className="text-lg font-light tracking-[0.15em] uppercase text-[#f5f0e8] group-hover:text-[#c9a84c] transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-xs text-[#f5f0e8]/40 font-light leading-relaxed line-clamp-2">
                {product.tagline}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a]">
                <span className="text-sm font-light tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                  ৳ {product.price.toLocaleString()}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30 group-hover:text-[#c9a84c] transition-colors duration-300">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View all link */}
      <div className="text-center mt-16">
        <Link
          href="/shop"
          className="inline-block text-xs tracking-[0.3em] uppercase px-10 py-3.5 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all duration-300"
        >
          View Full Collection
        </Link>
      </div>
    </section>
  );
}
