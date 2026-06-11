"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";

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
      <Button variant="secondary" size="lg" disabled className="flex-1 gap-2">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={added}
      size="lg"
      className={`flex-1 gap-2 ${added ? "bg-linear-to-br from-emerald-700 to-emerald-600 hover:opacity-100" : ""}`}
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
