import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.5em] uppercase" style={{ color: "#c9a84c" }}>
              Our Philosophy
            </p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-[0.08em] uppercase text-[#f5f0e8] leading-tight">
              Luxury Within
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Every Reach
              </span>
            </h2>
            <div className="gold-divider max-w-24" />
            <p className="text-[#f5f0e8]/60 text-sm leading-relaxed font-light">
              At Riham, we believe that exceptional fragrance should be
              accessible to everyone. Our collection of luxury inspired scents
              captures the essence of the world's most celebrated fragrances,
              meticulously crafted to deliver an unparalleled olfactory
              experience.
            </p>
            <p className="text-[#f5f0e8]/60 text-sm leading-relaxed font-light">
              Each Riham fragrance is a testament to artistry and precision —
              blending top-tier ingredients to create scents that don't just
              complement who you are, but define who you're becoming.
            </p>
            <div className="flex gap-10 pt-4">
              <div>
                <p className="text-2xl font-extralight tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                  4+
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/40 mt-1">
                  Signature Scents
                </p>
              </div>
              <div>
                <p className="text-2xl font-extralight tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                  100%
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/40 mt-1">
                  Authentic
                </p>
              </div>
              <div>
                <p className="text-2xl font-extralight tracking-[0.1em]" style={{ color: "#c9a84c" }}>
                  ∞
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/40 mt-1">
                  Confidence
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="self-start text-xs tracking-[0.3em] uppercase px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all duration-300 mt-2"
            >
              Read Our Story
            </Link>
          </div>

          {/* Right: Image collage */}
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            <div className="relative overflow-hidden row-span-2">
              <Image
                src="/images/products/iris-noir/2.png"
                alt="Riham Iris Noir"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/images/products/fuego-lento/1.jpg"
                alt="Riham Fuego Lento"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/images/products/cennet/3.png"
                alt="Riham Cennet"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
