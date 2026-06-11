"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, X, Save } from "lucide-react";
import NumericInput from "@/components/admin/NumericInput";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) => Promise<{ error?: string; success?: boolean } | null>;

interface ProductFormProps {
  action: FormAction;
  product?: Product;
  submitLabel?: string;
}

const GENDER_OPTIONS = ["Male", "Female", "Unisex"];
const SEASON_OPTIONS = ["Summer", "Winter", "Spring", "Autumn", "All Season"];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProductForm({ action, product, submitLabel = "Save Product" }: ProductFormProps) {
  const [state, dispatch, isPending] = useActionState(action, null);
  const [productName, setProductName] = useState(product?.name ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    if (!productName.trim()) {
      setUploadErrors(["Enter a product name before uploading images."]);
      return;
    }
    setUploadErrors([]);
    const arr = Array.from(files);
    setUploadingCount((c) => c + arr.length);
    const results = await Promise.all(
      arr.map(async (file) => {
        const fd = new FormData();
        fd.append("productName", productName.trim());
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        return res.json() as Promise<{ path?: string; error?: string }>;
      })
    );
    const errors: string[] = [];
    const newPaths: string[] = [];
    for (const r of results) {
      if (r.path) newPaths.push(r.path);
      else if (r.error) errors.push(r.error);
    }
    setImages((prev) => [...prev, ...newPaths]);
    if (errors.length) setUploadErrors(errors);
    setUploadingCount((c) => c - arr.length);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <form action={dispatch} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug {!product && "(auto-generated if empty)"}</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            readOnly={!!product}
            placeholder={productName ? slugify(productName) : ""}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price (৳) *</Label>
          <NumericInput id="price" name="price" defaultValue={product?.price} required min={1} />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <Label>Gender</Label>
          <Select name="gender" defaultValue={product?.gender ?? "Unisex"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Season */}
        <div className="flex flex-col gap-1.5">
          <Label>Season</Label>
          <Select name="season" defaultValue={product?.season ?? "All Season"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEASON_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Inspired By */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inspiredBy">Inspired By</Label>
          <Input id="inspiredBy" name="inspiredBy" defaultValue={product?.inspiredBy} />
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inspiredByBrand">Brand</Label>
          <Input id="inspiredByBrand" name="inspiredByBrand" defaultValue={product?.inspiredByBrand} />
        </div>
      </div>

      {/* Tagline */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={product?.tagline} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} rows={4} />
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(["topNotes", "heartNotes", "baseNotes"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-1.5">
            <Label htmlFor={field}>
              {field === "topNotes" ? "Top Notes" : field === "heartNotes" ? "Heart Notes" : "Base Notes"}
              <span className="ml-1 text-foreground/20 normal-case tracking-normal">(comma-separated)</span>
            </Label>
            <Input
              id={field}
              name={field}
              defaultValue={product?.[field].join(", ")}
              placeholder="e.g. Bergamot, Lemon"
            />
          </div>
        ))}
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-3">
        <Label>
          Product Images
          {productName && (
            <span className="ml-2 text-primary/40 normal-case tracking-normal font-mono text-[9px]">
              → /images/products/{slugify(productName)}/
            </span>
          )}
        </Label>

        <input type="hidden" name="images" value={images.join(", ")} />

        <Card
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging ? "border-primary/60 bg-primary/5" : "border-dashed border-ash hover:border-primary/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
          />
          {uploadingCount > 0 ? (
            <p className="text-xs text-primary/60 tracking-[0.2em] uppercase">
              Uploading {uploadingCount} file{uploadingCount !== 1 ? "s" : ""}…
            </p>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 mx-auto mb-3 text-foreground/15" />
              <p className="text-xs text-foreground/30 tracking-[0.2em] uppercase mb-1">
                Drop images here or click to browse
              </p>
              <p className="text-[10px] text-foreground/15">JPG, PNG, WebP, AVIF — max 5 MB each</p>
            </>
          )}
        </Card>

        {uploadErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {uploadErrors.map((err, i) => <p key={i}>{err}</p>)}
            </AlertDescription>
          </Alert>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((src, i) => (
              <div key={src} className="relative group aspect-3/4 bg-obsidian border border-border">
                <Image src={src} alt={`Image ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImages((prev) => prev.filter((_, idx) => idx !== i)); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive/80 hover:bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-1 py-0.5">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        {[
          { name: "featured", label: "Featured", defaultChecked: product?.featured ?? false },
          { name: "inStock", label: "In Stock", defaultChecked: product?.inStock ?? true },
        ].map((t) => (
          <label key={t.name} className="flex items-center gap-3 cursor-pointer">
            <Switch name={t.name} defaultChecked={t.defaultChecked} />
            <span className="text-xs tracking-[0.15em] uppercase text-foreground/50">{t.label}</span>
          </label>
        ))}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending || uploadingCount > 0}
          size="default"
          className="gap-2"
        >
          <Save className="h-3.5 w-3.5" />
          {isPending ? "Saving…" : uploadingCount > 0 ? "Uploading…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
