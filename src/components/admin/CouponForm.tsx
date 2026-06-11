"use client";

import { useActionState } from "react";
import type { Coupon } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) => Promise<{ error?: string; success?: boolean } | null>;

interface Props {
  action: FormAction;
  coupon?: Coupon;
  submitLabel?: string;
}

export default function CouponForm({ action, coupon, submitLabel = "Save Coupon" }: Props) {
  const [state, dispatch, isPending] = useActionState(action, null);

  const defaultExpiry = coupon?.expiresAt
    ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
    : "";

  return (
    <form action={dispatch} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Coupon Code *</Label>
          <Input
            id="code"
            name="code"
            defaultValue={coupon?.code}
            readOnly={!!coupon}
            placeholder="e.g. SAVE20"
            className="uppercase placeholder:normal-case"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Discount Type *</Label>
          <Select name="discountType" defaultValue={coupon?.discountType ?? "PERCENTAGE"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
              <SelectItem value="FIXED">Fixed Amount (৳)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discountValue">Discount Value *</Label>
          <Input
            id="discountValue"
            name="discountValue"
            type="number"
            min={1}
            defaultValue={coupon?.discountValue}
            placeholder="e.g. 20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minOrder">Min Order (৳)</Label>
          <Input
            id="minOrder"
            name="minOrder"
            type="number"
            min={0}
            defaultValue={coupon?.minOrder ?? 0}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxUses">
            Max Uses <span className="text-foreground/20 normal-case tracking-normal">(blank = unlimited)</span>
          </Label>
          <Input
            id="maxUses"
            name="maxUses"
            type="number"
            min={1}
            defaultValue={coupon?.maxUses ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiresAt">
            Expiry Date <span className="text-foreground/20 normal-case tracking-normal">(blank = no expiry)</span>
          </Label>
          <Input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={defaultExpiry}
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {coupon && (
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch name="active" defaultChecked={coupon.active} />
          <span className="text-xs tracking-[0.15em] uppercase text-foreground/50">Active</span>
        </label>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-3.5 w-3.5" />
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
