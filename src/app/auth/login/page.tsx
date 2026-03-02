import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="gold-divider max-w-24 mx-auto mb-6" />
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
            Welcome Back
          </p>
          <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
            Sign In
          </h1>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-[#f5f0e8]/40 mt-8">
          New to Riham?{" "}
          <Link href="/auth/register" className="text-[#c9a84c] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
