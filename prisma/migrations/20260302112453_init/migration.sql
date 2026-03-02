-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inspiredBy" TEXT NOT NULL,
    "inspiredByBrand" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "topNotes" TEXT[],
    "heartNotes" TEXT[],
    "baseNotes" TEXT[],
    "description" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
