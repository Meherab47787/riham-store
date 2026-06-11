"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/admin/orders";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function UpdateOrderStatusForm({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateOrderStatus(orderId, status as typeof ORDER_STATUSES[number]);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-obsidian border border-border text-foreground/80 text-xs tracking-[0.15em] uppercase px-3 py-2.5 focus:outline-none focus:border-primary/50"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending || status === currentStatus}
        className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating…" : "Update Status"}
      </button>
    </form>
  );
}
