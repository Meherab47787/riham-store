import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSession } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Riham | Luxury Inspired Fragrances",
    template: "%s | Riham",
  },
  description:
    "Discover Riham's collection of luxury inspired fragrances. Bold, elegant, and endlessly captivating scents crafted for those who demand the extraordinary.",
  keywords: ["perfume", "fragrance", "luxury", "Riham", "inspired", "scent"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar
          user={session ? { name: session.name, email: session.email } : null}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
