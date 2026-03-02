import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="gold-divider max-w-24 mx-auto mb-6" />
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#c9a84c" }}>
            Join Riham
          </p>
          <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-[#f5f0e8]">
            Create Account
          </h1>
        </div>

        <RegisterForm />

        <p className="text-center text-xs text-[#f5f0e8]/40 mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#c9a84c] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
