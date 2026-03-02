"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart-store";

interface Props {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function AddToCartButton({ productId, slug, name, price, image, inStock }: Props) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (!inStock) return;
    addToCart({ productId, slug, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!inStock) {
    return (
      <button
        disabled
        className="flex-1 text-center py-4 text-xs tracking-[0.3em] uppercase font-light border border-[#2a2a2a] text-[#f5f0e8]/25 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className="flex-1 text-center py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 disabled:opacity-75"
      style={{
        background: added
          ? "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)"
          : "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
        color: "#0a0a0a",
      }}
    >
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  );
}
