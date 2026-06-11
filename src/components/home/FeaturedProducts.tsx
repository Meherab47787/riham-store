import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function FeaturedProducts() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.5em] uppercase mb-4 text-primary">The Collection</p>
        <h2 className="text-3xl sm:text-5xl font-extralight tracking-widest uppercase text-foreground mb-6">
          Signature Scents
        </h2>
        <Separator gold className="max-w-xs mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {featured.map((product, index) => (
          <Link key={product.id} href={`/shop/${product.slug}`} className="group relative flex flex-col">
            <div className="relative aspect-3/4 overflow-hidden bg-charcoal mb-6">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Hover name */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                <span className="text-2xl tracking-[0.3em] uppercase px-6 py-2 text-primary bg-obsidian/65 text-center">
                  {product.name}
                </span>
              </div>

              {/* Hover CTA */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-xs tracking-[0.3em] uppercase px-6 py-2 border border-primary text-primary bg-obsidian/80">
                  Discover
                </span>
              </div>

              {/* Index */}
              <div className="absolute top-4 left-4">
                <span className="text-xs tracking-[0.2em] text-primary/60">0{index + 1}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs tracking-[0.3em] uppercase text-primary/60">
                {product.season} · {product.gender}
              </p>
              <h3 className="text-lg font-light tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-xs text-foreground/40 font-light leading-relaxed line-clamp-2">
                {product.tagline}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ash">
                <span className="text-sm font-light tracking-widest text-primary">
                  ৳ {product.price.toLocaleString()}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-foreground/30 group-hover:text-primary transition-colors duration-300">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button variant="outline" size="lg" asChild>
          <Link href="/shop">View Full Collection</Link>
        </Button>
      </div>
    </section>
  );
}
