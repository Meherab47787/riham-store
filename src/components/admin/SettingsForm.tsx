"use client";

import { useActionState } from "react";
import { updateSettings } from "@/actions/admin/settings";
import type { StoreSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

interface Props {
  settings: StoreSettings | null;
}

export default function SettingsForm({ settings }: Props) {
  const [state, dispatch, isPending] = useActionState(updateSettings, null);

  const d = settings ?? {
    storeName: "Riham Fragrances",
    storeEmail: "",
    phoneNumber: "",
    address: "",
    freeShippingMin: 3000,
    currency: "BDT",
    currencySymbol: "৳",
    taxRate: 0,
  };

  return (
    <form action={dispatch} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state?.success && (
        <Alert variant="success">
          <AlertDescription>Settings saved successfully.</AlertDescription>
        </Alert>
      )}

      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-primary/50 mb-4">Store Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" name="storeName" defaultValue={d.storeName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input id="storeEmail" name="storeEmail" type="email" defaultValue={d.storeEmail} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={d.phoneNumber} />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" defaultValue={d.address} rows={2} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-primary/50 mb-4">Commerce Settings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currency">Currency Code</Label>
            <Input id="currency" name="currency" defaultValue={d.currency} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input id="currencySymbol" name="currencySymbol" defaultValue={d.currencySymbol} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="freeShippingMin">Free Shipping Minimum (৳)</Label>
            <Input id="freeShippingMin" name="freeShippingMin" type="number" min={0} defaultValue={d.freeShippingMin} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input id="taxRate" name="taxRate" type="number" min={0} step="0.01" defaultValue={d.taxRate} />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-3.5 w-3.5" />
          {isPending ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
