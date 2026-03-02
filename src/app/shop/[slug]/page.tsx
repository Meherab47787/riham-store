import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/ui/ProductGallery";
import RelatedProducts from "@/components/shop/RelatedProducts";
import AddToCartButton from "@/components/ui/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
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

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="px-6 lg:px-12 py-6 border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#c9a84c] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span style={{ color: "#c9a84c" }}>{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 self-start">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-8">
            {/* Product meta */}
            <div>
              <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
                {product.gender} · {product.season}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8] mb-4">
                {product.name}
              </h1>
              <p className="text-[#f5f0e8]/40 text-sm italic font-light">
                Inspired by {product.inspiredBy} — {product.inspiredByBrand}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span
                className="text-2xl font-extralight tracking-[0.1em]"
                style={{ color: "#c9a84c" }}
              >
                ৳ {product.price.toLocaleString()}
              </span>
              {product.inStock ? (
                <span className="text-xs tracking-[0.2em] uppercase text-green-500/70 border border-green-500/20 px-3 py-1">
                  In Stock
                </span>
              ) : (
                <span className="text-xs tracking-[0.2em] uppercase text-red-500/70 border border-red-500/20 px-3 py-1">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Gold divider */}
            <div className="gold-divider" />

            {/* Tagline */}
            <blockquote className="border-l-2 border-[#c9a84c]/40 pl-5">
              <p className="text-[#f5f0e8]/70 text-base font-light italic leading-relaxed">
                &ldquo;{product.tagline}&rdquo;
              </p>
            </blockquote>

            {/* Description */}
            <p className="text-[#f5f0e8]/60 text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Notes */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Top Notes", notes: product.topNotes },
                { label: "Heart Notes", notes: product.heartNotes },
                { label: "Base Notes", notes: product.baseNotes },
              ].map((group) => (
                <div key={group.label} className="flex flex-col gap-3">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c]">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {group.notes.map((note) => (
                      <span
                        key={note}
                        className="text-xs text-[#f5f0e8]/50 font-light"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Gold divider */}
            <div className="gold-divider" />

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.images[0]}
                inStock={product.inStock}
              />
              <Link
                href="/contact"
                className="flex-1 text-center py-4 text-xs tracking-[0.3em] uppercase font-light border border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c] transition-all duration-300"
              >
                Enquire
              </Link>
            </div>

            {/* Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: "✦", label: "Free Shipping", desc: "Orders above ৳3,000" },
                { icon: "✦", label: "Authentic", desc: "Premium ingredients" },
                { icon: "✦", label: "Gift Ready", desc: "Luxury packaging" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 p-4 border border-[#1a1a1a]"
                >
                  <span className="text-[10px]" style={{ color: "#c9a84c" }}>
                    {item.icon}
                  </span>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#f5f0e8]/60">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#f5f0e8]/30 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentSlug={product.slug} />
    </div>
  );
}
