import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession, isAdmin } from "@/lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const productName = (formData.get("productName") as string)?.trim();
  const file = formData.get("file") as File | null;

  if (!productName) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, and AVIF images are allowed." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size must be under 5 MB." }, { status: 400 });
  }

  const folderSlug = slugify(productName);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  // Use original filename (slugified) + timestamp to avoid collisions
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const fileName = `${baseName}-${Date.now()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "images", "products", folderSlug);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

  return NextResponse.json({ path: `/images/products/${folderSlug}/${fileName}` });
}
