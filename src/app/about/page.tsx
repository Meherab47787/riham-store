import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about Riham's philosophy — crafting luxury inspired fragrances for those who demand the extraordinary.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-24 px-6 text-center overflow-hidden bg-[#0f0f0f]">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/products/iris-noir/1.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]" />
        <div className="relative z-10">
          <div className="gold-divider max-w-xs mx-auto mb-8" />
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Who We Are
          </p>
          <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
            Our Story
          </h1>
          <div className="gold-divider max-w-xs mx-auto mt-8" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
        {/* Mission */}
        <div className="text-center mb-20">
          <p className="text-lg sm:text-xl font-extralight text-[#f5f0e8]/80 leading-relaxed tracking-wide">
            &ldquo;Riham was born from a singular belief: that extraordinary
            fragrance should not be a privilege, but a right. We craft luxury
            inspired scents for those who live boldly.&rdquo;
          </p>
        </div>

        {/* Story sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="flex flex-col gap-5">
            <div className="w-8 h-px bg-[#c9a84c]" />
            <h2 className="text-xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
              The Beginning
            </h2>
            <p className="text-[#f5f0e8]/55 text-sm font-light leading-relaxed">
              Riham was founded with a passion for the art of fragrance. We
              observed that the finest scents in the world were locked behind
              prices that only a few could afford. We set out to change that —
              not by compromising quality, but by reimagining what inspired
              fragrances could be.
            </p>
            <p className="text-[#f5f0e8]/55 text-sm font-light leading-relaxed">
              Every formula we develop undergoes rigorous testing to ensure it
              captures the soul of its inspiration while maintaining its own
              unique identity.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="w-8 h-px bg-[#c9a84c]" />
            <h2 className="text-xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
              Our Craft
            </h2>
            <p className="text-[#f5f0e8]/55 text-sm font-light leading-relaxed">
              Each Riham fragrance begins with a deep study of its inspiration —
              dissecting notes, understanding the mood, the season, and the
              person it was designed for. We then rebuild it from the ground up
              using premium ingredients sourced globally.
            </p>
            <p className="text-[#f5f0e8]/55 text-sm font-light leading-relaxed">
              The result is never a copy. It is a Riham original — a scent that
              honours its inspiration while carrying its own story.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="border border-[#1a1a1a] p-10 mb-20">
          <p className="text-xs tracking-[0.4em] uppercase mb-8 text-center" style={{ color: "#c9a84c" }}>
            Our Values
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                desc: "Every fragrance is crafted with genuine care and premium ingredients — never a shortcut.",
              },
              {
                title: "Accessibility",
                desc: "Luxury should not be gatekept. We bring world-class scents within reach.",
              },
              {
                title: "Confidence",
                desc: "We don't just sell perfume. We sell the feeling of walking into a room and owning it.",
              },
            ].map((value) => (
              <div key={value.title} className="flex flex-col gap-3">
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#f5f0e8]">
                  {value.title}
                </h3>
                <p className="text-xs text-[#f5f0e8]/40 font-light leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image row */}
        <div className="grid grid-cols-3 gap-4 mb-20 h-64">
          <div className="relative overflow-hidden col-span-1">
            <Image
              src="/images/products/cennet/2.png"
              alt="Riham Cennet"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="relative overflow-hidden col-span-1">
            <Image
              src="/images/products/fuego-lento/2.jpg"
              alt="Riham Fuego Lento"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="relative overflow-hidden col-span-1">
            <Image
              src="/images/products/iris-noir/3.png"
              alt="Riham Iris Noir"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-6 text-[#f5f0e8]/40">
            Ready to find your scent?
          </p>
          <Link
            href="/shop"
            className="inline-block text-xs tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
              color: "#0a0a0a",
            }}
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
