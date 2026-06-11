"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { rm } from "fs/promises";
import path from "path";

function parseArray(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type ProductFormState = { error?: string; success?: boolean } | null;

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.PRODUCT_CREATE)) {
    return { error: "Unauthorized" };
  }

  const name = (formData.get("name") as string)?.trim();
  const price = parseInt(formData.get("price") as string, 10);

  if (!name || isNaN(price)) {
    return { error: "Name and price are required." };
  }

  const rawSlug = (formData.get("slug") as string)?.trim() || slugify(name);

  const existing = await prisma.product.findUnique({ where: { slug: rawSlug } });
  if (existing) {
    return { error: "A product with this slug already exists." };
  }

  await prisma.product.create({
    data: {
      slug: rawSlug,
      name,
      inspiredBy: (formData.get("inspiredBy") as string)?.trim() ?? "",
      inspiredByBrand: (formData.get("inspiredByBrand") as string)?.trim() ?? "",
      gender: (formData.get("gender") as string)?.trim() ?? "Unisex",
      season: (formData.get("season") as string)?.trim() ?? "All Season",
      topNotes: parseArray(formData.get("topNotes") as string ?? ""),
      heartNotes: parseArray(formData.get("heartNotes") as string ?? ""),
      baseNotes: parseArray(formData.get("baseNotes") as string ?? ""),
      description: (formData.get("description") as string)?.trim() ?? "",
      tagline: (formData.get("tagline") as string)?.trim() ?? "",
      price,
      featured: formData.get("featured") === "on",
      inStock: formData.get("inStock") !== "off",
      images: parseArray(formData.get("images") as string ?? ""),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.PRODUCT_EDIT)) {
    return { error: "Unauthorized" };
  }

  const name = (formData.get("name") as string)?.trim();
  const price = parseInt(formData.get("price") as string, 10);

  if (!name || isNaN(price)) {
    return { error: "Name and price are required." };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      inspiredBy: (formData.get("inspiredBy") as string)?.trim() ?? "",
      inspiredByBrand: (formData.get("inspiredByBrand") as string)?.trim() ?? "",
      gender: (formData.get("gender") as string)?.trim() ?? "Unisex",
      season: (formData.get("season") as string)?.trim() ?? "All Season",
      topNotes: parseArray(formData.get("topNotes") as string ?? ""),
      heartNotes: parseArray(formData.get("heartNotes") as string ?? ""),
      baseNotes: parseArray(formData.get("baseNotes") as string ?? ""),
      description: (formData.get("description") as string)?.trim() ?? "",
      tagline: (formData.get("tagline") as string)?.trim() ?? "",
      price,
      featured: formData.get("featured") === "on",
      inStock: formData.get("inStock") !== "off",
      images: parseArray(formData.get("images") as string ?? ""),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${(await prisma.product.findUnique({ where: { id }, select: { slug: true } }))?.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<void> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.PRODUCT_DELETE)) return;

  const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  await prisma.product.delete({ where: { id } });

  if (product) {
    const imageDir = path.join(process.cwd(), "public", "images", "products", product.slug);
    await rm(imageDir, { recursive: true, force: true });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
