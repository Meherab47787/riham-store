"use client";

import { useTransition } from "react";
import { logout } from "@/actions/auth";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30 hover:text-red-400 transition-colors duration-300 disabled:opacity-50"
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
