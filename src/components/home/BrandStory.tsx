import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BrandStory() {
  return (
    <section className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.5em] uppercase text-primary">Our Philosophy</p>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-[0.08em] uppercase text-foreground leading-tight">
              Luxury Within
              <br />
              <span className="text-gold-gradient">Every Reach</span>
            </h2>
            <Separator gold className="max-w-24" />
            <p className="text-foreground/60 text-sm leading-relaxed font-light">
              At Riham, we believe that exceptional fragrance should be accessible to everyone. Our
              collection of luxury inspired scents captures the essence of the world's most
              celebrated fragrances, meticulously crafted to deliver an unparalleled olfactory
              experience.
            </p>
            <p className="text-foreground/60 text-sm leading-relaxed font-light">
              Each Riham fragrance is a testament to artistry and precision — blending top-tier
              ingredients to create scents that don't just complement who you are, but define who
              you're becoming.
            </p>

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

            <Button variant="outline" size="default" className="self-start mt-2" asChild>
              <Link href="/about">Read Our Story</Link>
            </Button>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4 h-125">
            <div className="relative overflow-hidden row-span-2">
              <Image src="/images/products/iris-noir/2.png" alt="Riham Iris Noir" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-obsidian/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <Image src="/images/products/fuego-lento/1.jpg" alt="Riham Fuego Lento" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-obsidian/40 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <Image src="/images/products/cennet/3.png" alt="Riham Cennet" fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-obsidian/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
