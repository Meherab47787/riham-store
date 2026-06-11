import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    <section className="py-20 px-6 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-2 text-primary">You May Also Like</p>
            <h2 className="text-2xl font-extralight tracking-widest uppercase text-foreground">
              Related Scents
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shop">View All →</Link>
          </Button>
        </div>

        <Separator gold className="mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {related.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group flex flex-col">
              <div className="relative aspect-3/4 overflow-hidden bg-charcoal mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 mb-1">{product.gender}</p>
              <h3 className="text-sm font-light tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                {product.name}
              </h3>
              <span className="text-xs font-light text-primary">৳ {product.price.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
