"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin } from "@/lib/auth";

export type SettingsFormState = { error?: string; success?: boolean } | null;

export async function updateSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await getSession();
  if (!isSuperAdmin(session)) return { error: "Unauthorized" };

  const freeShippingMin = parseInt(formData.get("freeShippingMin") as string, 10);
  const taxRate = parseFloat(formData.get("taxRate") as string);

  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      storeName: (formData.get("storeName") as string)?.trim() || "Riham Fragrances",
      storeEmail: (formData.get("storeEmail") as string)?.trim() || "",
      phoneNumber: (formData.get("phoneNumber") as string)?.trim() || "",
      address: (formData.get("address") as string)?.trim() || "",
      freeShippingMin: isNaN(freeShippingMin) ? 3000 : freeShippingMin,
      currency: (formData.get("currency") as string)?.trim() || "BDT",
      currencySymbol: (formData.get("currencySymbol") as string)?.trim() || "৳",
      taxRate: isNaN(taxRate) ? 0 : taxRate,
    },
    update: {
      storeName: (formData.get("storeName") as string)?.trim() || "Riham Fragrances",
      storeEmail: (formData.get("storeEmail") as string)?.trim() || "",
      phoneNumber: (formData.get("phoneNumber") as string)?.trim() || "",
      address: (formData.get("address") as string)?.trim() || "",
      freeShippingMin: isNaN(freeShippingMin) ? 3000 : freeShippingMin,
      currency: (formData.get("currency") as string)?.trim() || "BDT",
      currencySymbol: (formData.get("currencySymbol") as string)?.trim() || "৳",
      taxRate: isNaN(taxRate) ? 0 : taxRate,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
