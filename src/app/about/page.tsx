import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Discover the story behind Riham — a luxury inspired fragrance house born from the belief that exceptional scent should be within everyone's reach.",
};

const values = [
  {
    title: "Inspired, Never Copied",
    body: "Every Riham fragrance begins with a celebrated original and becomes something entirely our own — a Riham original that pays homage without imitation.",
  },
  {
    title: "Luxury Within Reach",
    body: "We believe the feeling of walking into a room and owning it should not be gated behind a price tag. Premium ingredients, honest pricing.",
  },
  {
    title: "Crafted with Precision",
    body: "Each formula is blended by hand in small batches, balanced until every note — top, heart, base — speaks clearly and lasts through the day.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden bg-charcoal border-b border-border">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs tracking-[0.5em] uppercase text-primary mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            Who We Are
          </p>
          <h1
            className="text-5xl sm:text-7xl font-extralight tracking-[0.1em] uppercase text-foreground leading-none mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.25s", opacity: 0 }}
          >
            The Riham
            <br />
            <span className="text-gold-gradient">Story</span>
          </h1>
          <Separator gold className="max-w-xs mx-auto mb-8" />
          <p
            className="text-foreground/60 text-base font-light leading-relaxed max-w-lg mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            At Riham, we believe that exceptional fragrance should be accessible to everyone. Bold.
            Sensual. Unapologetically luxurious.
          </p>
        </div>
      </section>

      {/* Brand philosophy */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.5em] uppercase text-primary">Our Philosophy</p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-[0.08em] uppercase text-foreground leading-tight">
              Luxury Within
              <br />
              <span className="text-gold-gradient">Every Reach</span>
            </h2>
            <Separator gold className="max-w-24" />
            <p className="text-foreground/60 text-sm leading-relaxed font-light">
              Riham was born from a simple conviction: the world's most captivating scents should not
              be reserved for the few. Our collection of luxury inspired fragrances captures the
              essence of celebrated originals, meticulously reinterpreted to deliver an unparalleled
              olfactory experience at a price that respects you.
            </p>
            <p className="text-foreground/60 text-sm leading-relaxed font-light">
              Each Riham fragrance is a testament to artistry and precision — blending top-tier
              ingredients to create scents that don't just complement who you are, but define who
              you're becoming.
            </p>

            {/* Stats */}
            <div className="flex gap-10 pt-4">
              {[
                { value: "4+", label: "Signature Scents" },
                { value: "100%", label: "Authentic" },
                { value: "∞", label: "Confidence" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extralight tracking-widest text-primary">{stat.value}</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            <div className="relative overflow-hidden row-span-2">
              <Image
                src="/images/products/iris-noir/2.png"
                alt="Riham Iris Noir"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-obsidian/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/images/products/fuego-lento/1.jpg"
                alt="Riham Fuego Lento"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative overflow-hidden">
              <Image
                src="/images/products/cennet/3.png"
                alt="Riham Cennet"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator gold />

      {/* Values */}
      <section className="py-24 px-6 lg:px-12 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.5em] uppercase text-primary mb-4">What Drives Us</p>
            <h2 className="text-3xl font-extralight tracking-[0.15em] uppercase text-foreground">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-charcoal px-10 py-10 flex flex-col gap-4 hover:bg-ash transition-colors duration-300"
              >
                <div className="w-6 h-px bg-primary" />
                <h3 className="text-xs tracking-[0.3em] uppercase text-primary">{v.title}</h3>
                <p className="text-sm font-light text-foreground/50 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div
          className="relative max-w-3xl mx-auto px-12 py-16 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #111111 0%, #1a1408 100%)" }}
        >
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/40" />

          <p className="text-xs tracking-[0.5em] uppercase text-primary mb-4">Begin Your Journey</p>
          <h2 className="text-3xl font-extralight tracking-widest uppercase text-foreground mb-6">
            Discover the Collection
          </h2>
          <Button size="lg" asChild>
            <Link href="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
