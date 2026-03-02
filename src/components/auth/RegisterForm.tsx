"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 text-xs tracking-[0.3em] uppercase font-light transition-all duration-300 disabled:opacity-60"
      style={{
        background: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 50%, #a07c2a 100%)",
        color: "#0a0a0a",
      }}
    >
      {pending ? "Creating account..." : "Create Account"}
    </button>
  );
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(register, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-xs text-red-400">{state.error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
          Full Name
        </label>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
          Phone / WhatsApp
        </label>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+880 1700 000 000"
          className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/40">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          className="bg-[#111111] border border-[#2a2a2a] text-[#f5f0e8] text-sm font-light px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors duration-300 placeholder:text-[#f5f0e8]/20"
        />
      </div>

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
