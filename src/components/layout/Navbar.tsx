"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/ui/LogoutButton";
import { getCartCount } from "@/lib/cart-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  user: { name: string; email: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#c9a84c]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo/riham-logo.png"
                alt="Riham"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className="text-xl font-light tracking-[0.3em] uppercase hidden sm:block"
              style={{
                background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Riham
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-light tracking-[0.2em] uppercase text-[#f5f0e8]/70 hover:text-[#c9a84c] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Cart + User */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/60 hover:text-[#c9a84c] transition-colors duration-300 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium"
                  style={{ background: "#c9a84c", color: "#0a0a0a" }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-xs tracking-[0.1em] text-[#f5f0e8]/60 hover:text-[#c9a84c] transition-colors duration-300 border border-[#2a2a2a] hover:border-[#c9a84c]/40 px-3 py-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  {user.name.split(" ")[0]}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#111] border border-[#1a1a1a] flex flex-col">
                    <Link
                      href="/account"
                      className="text-xs tracking-[0.15em] uppercase px-4 py-3 text-[#f5f0e8]/60 hover:text-[#c9a84c] hover:bg-[#1a1a1a] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/cart"
                      className="text-xs tracking-[0.15em] uppercase px-4 py-3 text-[#f5f0e8]/60 hover:text-[#c9a84c] hover:bg-[#1a1a1a] transition-colors border-t border-[#1a1a1a]"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    <div className="border-t border-[#1a1a1a] px-4 py-3">
                      <LogoutButton />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/50 hover:text-[#c9a84c] transition-colors duration-300"
                >
                  Sign In
                </Link>
                <span className="text-[#2a2a2a]">|</span>
                <Link
                  href="/auth/register"
                  className="text-xs tracking-[0.2em] uppercase px-4 py-2 border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all duration-300 font-light"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Cart icon + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative p-2">
              <svg className="w-5 h-5 text-[#c9a84c]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium"
                  style={{ background: "#c9a84c", color: "#0a0a0a" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0a0a0a]/98 border-t border-[#c9a84c]/10`}
      >
        <nav className="flex flex-col px-6 py-6 gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-light tracking-[0.3em] uppercase text-[#f5f0e8]/70 hover:text-[#c9a84c] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="gold-divider" />
          {user ? (
            <>
              <Link href="/account" className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/50 hover:text-[#c9a84c] transition-colors" onClick={() => setMenuOpen(false)}>
                My Account ({user.name.split(" ")[0]})
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/50 hover:text-[#c9a84c] transition-colors" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth/register" className="text-xs tracking-[0.2em] uppercase px-5 py-2.5 border border-[#c9a84c]/60 text-[#c9a84c] text-center" onClick={() => setMenuOpen(false)}>
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
