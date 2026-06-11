import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Riham. We're here to help you find your signature scent.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-20 px-6 text-center bg-charcoal border-b border-border">
        <p className="text-xs tracking-[0.5em] uppercase text-primary mb-4">We'd Love to Hear From You</p>
        <h1 className="text-4xl sm:text-6xl font-extralight tracking-[0.1em] uppercase text-foreground mb-6">
          Get in Touch
        </h1>
        <Separator gold className="max-w-xs mx-auto" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-primary mb-8">Contact Details</p>
              <div className="flex flex-col gap-8">
                {[
                  {
                    label: "Email",
                    value: "hello@riham.com",
                    href: "mailto:hello@riham.com",
                  },
                  {
                    label: "WhatsApp / Phone",
                    value: "+880 1700 000 000",
                    href: "tel:+8801700000000",
                  },
                  {
                    label: "Hours",
                    value: "Sat – Thu, 10am – 8pm (BST)",
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-2">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-light text-foreground/70 hover:text-primary transition-colors duration-200"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-light text-foreground/70">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator gold />

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-foreground/30 mb-3">Follow Us</p>
              <div className="flex gap-5">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-foreground/30 hover:text-primary transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-foreground/30 hover:text-primary transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Message form */}
          <div>
            <p className="text-xs tracking-[0.5em] uppercase text-primary mb-8">Send a Message</p>
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.25em] uppercase text-foreground/40">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="bg-input border border-border px-4 py-3 text-sm font-light text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.25em] uppercase text-foreground/40">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-input border border-border px-4 py-3 text-sm font-light text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.25em] uppercase text-foreground/40">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="bg-input border border-border px-4 py-3 text-sm font-light text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-linear-to-br from-gold via-gold-light to-gold-dark text-obsidian text-xs tracking-[0.3em] uppercase px-8 py-4 hover:opacity-90 transition-opacity duration-200 cursor-pointer"
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
