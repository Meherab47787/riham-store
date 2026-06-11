"use client";

import { useTransition } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="gap-2 text-foreground/30 hover:text-destructive"
    >
      <LogOut className="h-3 w-3" />
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
