import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111111] mb-5">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover CTA */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
          <span className="text-xs tracking-[0.3em] uppercase px-6 py-2 bg-[#c9a84c] text-[#0a0a0a]">
            View Details
          </span>
        </div>

        {/* Number badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] tracking-[0.2em] text-[#c9a84c]/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Season badge */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 bg-[#0a0a0a]/70 text-[#f5f0e8]/50">
            {product.season}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]/60">
          {product.gender}
        </p>
        <h3 className="text-base font-light tracking-[0.15em] uppercase text-[#f5f0e8] group-hover:text-[#c9a84c] transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-xs text-[#f5f0e8]/40 leading-relaxed line-clamp-2 mt-0.5">
          {product.tagline}
        </p>

        {/* Notes preview */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {product.topNotes.slice(0, 2).map((note) => (
            <span
              key={note}
              className="text-[10px] tracking-[0.1em] px-2 py-0.5 border border-[#2a2a2a] text-[#f5f0e8]/30"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]">
          <span
            className="text-sm font-light tracking-[0.1em]"
            style={{ color: "#c9a84c" }}
          >
            ৳ {product.price.toLocaleString()}
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/20 group-hover:text-[#c9a84c] transition-colors duration-300">
            Shop →
          </span>
        </div>
      </div>
    </Link>
  );
}
