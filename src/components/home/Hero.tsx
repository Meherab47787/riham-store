"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div ref={heroRef} className="absolute inset-0 scale-110">
        <Image
          src="/images/products/cennet/1.png"
          alt="Riham Cennet"
          fill
          className="object-cover opacity-25"
          priority
          quality={75}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-obsidian/60 via-obsidian/40 to-obsidian" />

      {/* Decorative side line */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-24 bg-linear-to-b from-transparent to-primary" />
        <span className="text-[10px] tracking-[0.4em] uppercase rotate-90 my-4 text-primary">Scroll</span>
        <div className="w-px h-24 bg-linear-to-t from-transparent to-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          className="text-xs tracking-[0.5em] uppercase mb-8 text-primary animate-fade-in-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          The Art of Fragrance
        </p>

        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-[0.15em] uppercase leading-none mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <span className="block text-foreground">Wear the</span>
          <span className="block text-gold-gradient">Extraordinary</span>
        </h1>

        <p
          className="text-foreground/60 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          Luxury inspired fragrances for the bold. Each scent is a story of elegance, crafted for
          those who refuse to go unnoticed.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.7s", opacity: 0 }}
        >
          <Button size="lg" asChild>
            <Link href="/shop">Explore Collection</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Our Story</Link>
          </Button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-obsidian to-transparent" />
    </section>
  );
}
