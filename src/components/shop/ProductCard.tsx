import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group flex flex-col">
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-charcoal mb-5">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover name */}
        <div className="absolute top-2/5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
          <span className="tracking-[0.3em] uppercase px-6 py-2 text-primary bg-obsidian/65 text-center text-sm">
            {product.name}
          </span>
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
          <span className="text-xs tracking-[0.3em] uppercase px-6 py-2 bg-primary text-primary-foreground">
            View Details
          </span>
        </div>

        {/* Index badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] tracking-[0.2em] text-primary/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Season badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="text-[10px] bg-obsidian/70 border-transparent text-foreground/50">
            {product.season}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60">{product.gender}</p>
        <h3 className="text-base font-light tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-xs text-foreground/40 leading-relaxed line-clamp-2 mt-0.5">
          {product.tagline}
        </p>

        {/* Notes preview */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {product.topNotes.slice(0, 2).map((note) => (
            <Badge key={note} variant="secondary" className="text-[10px]">
              {note}
            </Badge>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-smoke">
          <span className="text-sm font-light tracking-widest text-primary">
            ৳ {product.price.toLocaleString()}
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-foreground/20 group-hover:text-primary transition-colors duration-300">
            Shop →
          </span>
        </div>
      </div>
    </Link>
  );
}
