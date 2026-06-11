"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, User, LayoutDashboard, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/ui/LogoutButton";
import { getCartCount } from "@/lib/cart-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  user: { name: string; email: string; role?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/95 backdrop-blur-md border-b border-gold/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo/riham-flag.svg"
                alt="Riham"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-light tracking-[0.3em] uppercase hidden sm:block text-gold-gradient">
              Riham
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-light tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-medium text-primary-foreground">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {user.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel className="text-foreground/40">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 text-primary">
                        <LayoutDashboard className="h-3 w-3" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart" className="flex items-center gap-2">
                      <ShoppingBag className="h-3 w-3" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <LogoutButton />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-medium text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-obsidian border-l border-gold/20 p-0">
                <SheetHeader className="p-6 border-b border-smoke">
                  <SheetTitle className="text-gold-gradient">Riham</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-xs font-light tracking-[0.3em] uppercase text-foreground/70 hover:text-primary transition-colors py-3 border-b border-smoke/50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator gold className="my-4" />
                  {user ? (
                    <div className="flex flex-col gap-3">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-3.5 w-3.5" />
                        My Account ({user.name.split(" ")[0]})
                      </Link>
                      <LogoutButton />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button variant="ghost" asChild size="sm" className="justify-start">
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" asChild size="sm">
                        <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
