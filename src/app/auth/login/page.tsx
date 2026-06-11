import { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.5em] uppercase text-primary mb-4">Welcome Back</p>
          <h1 className="text-3xl font-extralight tracking-[0.15em] uppercase text-foreground mb-6">
            Sign In
          </h1>
          <Separator gold className="max-w-[120px] mx-auto" />
        </div>

        <LoginForm />

        <p className="text-center mt-8 text-xs font-light text-foreground/40">
          New to Riham?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:text-gold-light transition-colors duration-200"
          >
            Create an account →
          </Link>
        </p>
      </div>
    </div>
  );
}
