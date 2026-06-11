import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const notes = [
  { label: "Top Notes", examples: "Citrus · Bergamot · Cardamom" },
  { label: "Heart Notes", examples: "Iris · Lavender · Rose" },
  { label: "Base Notes", examples: "Vetiver · Vanilla · Leather" },
];

export default function NotesBanner() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-obsidian">
      <div className="max-w-7xl mx-auto">
        {/* Notes grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-smoke mb-16">
          {notes.map((note) => (
            <div
              key={note.label}
              className="bg-obsidian px-10 py-10 flex flex-col gap-4 group hover:bg-charcoal transition-colors duration-300"
            >
              <div className="w-6 h-px bg-primary" />
              <h3 className="text-xs tracking-[0.4em] uppercase text-primary">{note.label}</h3>
              <p className="text-sm font-light text-foreground/50 leading-relaxed">{note.examples}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className="relative px-12 py-16 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #111111 0%, #1a1408 100%)" }}
        >
          {/* Gold corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/40" />

          <p className="text-xs tracking-[0.5em] uppercase mb-4 text-primary">Limited Collection</p>
          <h2 className="text-3xl sm:text-4xl font-extralight tracking-widest uppercase text-foreground mb-6">
            Find Your Signature Scent
          </h2>
          <p className="text-foreground/50 text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            Each Riham fragrance is crafted to leave a lasting impression. Discover the scent that
            speaks your language.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
