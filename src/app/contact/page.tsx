import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Riham — orders, enquiries, and more.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-24 px-6 text-center bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="gold-divider max-w-xs mx-auto mb-8" />
        <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "#c9a84c" }}>
          Reach Out
        </p>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
          Contact Us
        </h1>
        <div className="gold-divider max-w-xs mx-auto mt-8" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "#c9a84c" }}>
                Get in Touch
              </p>
              <p className="text-[#f5f0e8]/60 text-sm font-light leading-relaxed mb-8">
                We'd love to hear from you. Whether you have a question about
                our fragrances, want to place a custom order, or simply want to
                know more about Riham — reach out to us.
              </p>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-8">
              {[
                {
                  label: "Email",
                  value: "hello@riham.com",
                  href: "mailto:hello@riham.com",
                },
                {
                  label: "Phone / WhatsApp",
                  value: "+880 1700 000 000",
                  href: "tel:+8801700000000",
                },
                {
                  label: "Instagram",
                  value: "@riham.fragrances",
                  href: "#",
                },
                {
                  label: "Facebook",
                  value: "Riham Fragrances",
                  href: "#",
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#c9a84c" }}>
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    className="text-sm font-light text-[#f5f0e8]/60 hover:text-[#c9a84c] transition-colors duration-300"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="border border-[#1a1a1a] p-6">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
                Response Time
              </p>
              <p className="text-xs text-[#f5f0e8]/40 font-light leading-relaxed">
                We typically respond within 24 hours. For urgent orders, reach
                us via WhatsApp for the fastest response.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: "#c9a84c" }}>
              Send a Message
            </p>

            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+880 1700 000 000"
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Subject
                </label>
                <select className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8]/60 text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300">
                  <option value="">Select a subject</option>
                  <option value="order">Place an Order</option>
                  <option value="enquiry">Product Enquiry</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                  className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 mt-2"
                style={{
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                  color: "#0a0a0a",
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
