"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
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

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />

      {/* Decorative gold lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-24 bg-linear-to-b from-transparent to-[#c9a84c]" />
        <span
          className="text-[10px] tracking-[0.4em] uppercase rotate-90 my-4"
          style={{ color: "#c9a84c" }}
        >
          Scroll
        </span>
        <div className="w-px h-24 bg-gradient-to-t from-transparent to-[#c9a84c]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Tagline above */}
        <p
          className="text-xs tracking-[0.5em] uppercase mb-8 animate-fade-in-up"
          style={{ color: "#c9a84c", animationDelay: "0.1s", opacity: 0 }}
        >
          The Art of Fragrance
        </p>

        {/* Main heading */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-[0.15em] uppercase leading-none mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <span className="block text-[#f5f0e8]">Wear the</span>
          <span
            className="block"
            style={{
              background:
                "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Extraordinary
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-[#f5f0e8]/60 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          Luxury inspired fragrances for the bold. Each scent is a story of
          elegance, crafted for those who refuse to go unnoticed.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.7s", opacity: 0 }}
        >
          <Link
            href="/shop"
            className="px-10 py-3.5 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
              color: "#0a0a0a",
            }}
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="px-10 py-3.5 text-xs tracking-[0.3em] uppercase font-light border border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c] transition-all duration-300"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
