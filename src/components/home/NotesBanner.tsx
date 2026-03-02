import Link from "next/link";

const notes = [
  { label: "Top Notes", examples: "Citrus · Bergamot · Cardamom" },
  { label: "Heart Notes", examples: "Iris · Lavender · Rose" },
  { label: "Base Notes", examples: "Vetiver · Vanilla · Leather" },
];

export default function NotesBanner() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Top notes section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a] mb-16">
          {notes.map((note) => (
            <div
              key={note.label}
              className="bg-[#0a0a0a] px-10 py-10 flex flex-col gap-4 group hover:bg-[#111111] transition-colors duration-300"
            >
              <div className="w-6 h-px bg-[#c9a84c]" />
              <h3 className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]">
                {note.label}
              </h3>
              <p className="text-sm font-light text-[#f5f0e8]/50 leading-relaxed">
                {note.examples}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="relative px-12 py-16 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #111111 0%, #1a1408 100%)" }}
        >
          {/* Gold corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#c9a84c]/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#c9a84c]/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#c9a84c]/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#c9a84c]/40" />

          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Limited Collection
          </p>
          <h2 className="text-3xl sm:text-4xl font-extralight tracking-[0.1em] uppercase text-[#f5f0e8] mb-6">
            Find Your Signature Scent
          </h2>
          <p className="text-[#f5f0e8]/50 text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            Each Riham fragrance is crafted to leave a lasting impression.
            Discover the scent that speaks your language.
          </p>
          <Link
            href="/shop"
            className="inline-block text-xs tracking-[0.3em] uppercase px-10 py-3.5 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
              color: "#0a0a0a",
            }}
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
