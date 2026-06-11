import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/ui/AddToCartButton";
import RelatedProducts from "@/components/shop/RelatedProducts";
import ProductGallery from "@/components/ui/ProductGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const noteGroups = [
    { label: "Top Notes", notes: product.topNotes },
    { label: "Heart Notes", notes: product.heartNotes },
    { label: "Base Notes", notes: product.baseNotes },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="px-6 lg:px-12 py-4 border-b border-border max-w-7xl mx-auto">
        <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/30">
          Shop <span className="mx-2 text-foreground/15">·</span> {product.name}
        </p>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary/60 mb-3">
                {product.gender} · {product.season}
              </p>
              <h1 className="text-4xl font-extralight tracking-widest uppercase text-foreground leading-tight mb-4">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-sm font-light text-foreground/50 italic leading-relaxed">
                  "{product.tagline}"
                </p>
              )}
            </div>

            {/* Price + stock */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-extralight tracking-[0.15em] text-primary">
                ৳ {product.price.toLocaleString()}
              </span>
              <Badge variant={product.inStock ? "default" : "secondary"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <Separator gold />

            {/* Inspired by */}
            {product.inspiredBy && (
              <div className="border-l-2 border-primary/30 pl-4">
                <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/30 mb-1">Inspired By</p>
                <p className="text-sm font-light text-foreground/60">{product.inspiredBy}</p>
              </div>
            )}

            {/* Description */}
            <p className="text-sm font-light text-foreground/60 leading-relaxed">
              {product.description}
            </p>

            {/* Notes pyramid */}
            <div className="grid grid-cols-3 gap-4 py-4">
              {noteGroups.map((group) =>
                group.notes.length > 0 ? (
                  <div key={group.label}>
                    <div className="w-8 h-px bg-primary mb-3" />
                    <p className="text-[10px] tracking-[0.25em] uppercase text-primary mb-2">{group.label}</p>
                    <div className="flex flex-col gap-1">
                      {group.notes.map((note) => (
                        <span key={note} className="text-xs font-light text-foreground/50">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>

            <Separator gold />

            {/* CTA */}
            <div className="flex gap-3">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.images[0]}
                inStock={product.inStock}
              />
              <a
                href="/contact"
                className="flex items-center justify-center px-6 py-3 border border-border text-xs tracking-[0.25em] uppercase text-foreground/50 hover:border-primary/40 hover:text-foreground/70 transition-colors duration-200"
              >
                Enquire
              </a>
            </div>

            {/* Perks */}
            <div className="flex gap-6 pt-2">
              {["✦ Free delivery over ৳3,000", "✦ Cash on delivery", "✦ Gift packaging"].map((perk) => (
                <span key={perk} className="text-[10px] font-light text-foreground/30 leading-relaxed">
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts currentSlug={product.slug} />
    </div>
  );
}
