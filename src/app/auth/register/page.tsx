import { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.5em] uppercase text-primary mb-4">Join Riham</p>
          <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-foreground mb-6">
            Create Account
          </h1>
          <Separator gold className="max-w-[120px] mx-auto" />
        </div>

        <RegisterForm />

        <p className="text-center mt-8 text-xs font-light text-foreground/40">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:text-gold-light transition-colors duration-200"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
