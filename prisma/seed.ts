import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing products
  await prisma.product.deleteMany();

  const products = [
    {
      slug: "riham-cennet",
      name: "Riham Cennet",
      inspiredBy: "Elysium Pour Homme Parfum Cologne",
      inspiredByBrand: "Roja Dove",
      gender: "Male",
      season: "Summer",
      topNotes: ["Grapefruit", "Lemon", "Bergamot"],
      heartNotes: ["Apple", "Blackcurrant", "Juniper"],
      baseNotes: ["Vetiver", "Ambergris", "Leather"],
      description:
        "Fresh yet commanding. Riham Cennet opens with vibrant citrus before settling into refined woods and sensual depth. Clean, luxurious, and endlessly charismatic.",
      tagline: "Freshness with authority.",
      price: 2499,
      images: [
        "/images/products/cennet/1.png",
        "/images/products/cennet/2.png",
        "/images/products/cennet/3.png",
      ],
      featured: true,
      inStock: true,
    },
    {
      slug: "riham-iris-noir",
      name: "Riham Iris Noir",
      inspiredBy: "Dior Homme Intense",
      inspiredByBrand: "Dior",
      gender: "Male",
      season: "All Season",
      topNotes: ["Lavender"],
      heartNotes: ["Iris", "Ambrette"],
      baseNotes: ["Virginia Cedar", "Vetiver"],
      description:
        "A masterpiece of powdery elegance. Riham Iris Noir blends smooth iris with woody depth, creating a sophisticated and sensual signature. Perfect for formal evenings and timeless style.",
      tagline: "Pure sophistication.",
      price: 2199,
      images: [
        "/images/products/iris-noir/1.png",
        "/images/products/iris-noir/2.png",
        "/images/products/iris-noir/3.png",
      ],
      featured: true,
      inStock: true,
    },
    {
      slug: "riham-fuego-lento",
      name: "Riham Fuego Lento",
      inspiredBy: "Le Male Le Parfum",
      inspiredByBrand: "Jean Paul Gaultier",
      gender: "Male",
      season: "All Season",
      topNotes: ["Cardamom"],
      heartNotes: ["Lavender", "Iris"],
      baseNotes: ["Vanilla", "Oriental Woods"],
      description:
        "Bold. Intense. Magnetic. Riham Fuego Lento delivers spicy cardamom wrapped in smooth vanilla and refined woods. A powerful evening scent that commands attention with elegance.",
      tagline: "The captain of the night.",
      price: 2799,
      images: [
        "/images/products/fuego-lento/1.jpg",
        "/images/products/fuego-lento/2.jpg",
        "/images/products/fuego-lento/3.jpg",
      ],
      featured: true,
      inStock: true,
    },
    {
      slug: "riham-regalis",
      name: "Riham Regalis",
      inspiredBy: "Tygar",
      inspiredByBrand: "Bvlgari",
      gender: "Male",
      season: "Summer",
      topNotes: ["Grapefruit"],
      heartNotes: ["Ginger"],
      baseNotes: ["Ambroxan", "Woody Notes"],
      description:
        "Sharp, fresh grapefruit meets warm ambroxan in this modern minimalist masterpiece. Riham Regalis is vibrant, energetic, and confidently masculine — perfect for warm days and bold personalities.",
      tagline: "Fresh power unleashed.",
      price: 1899,
      images: ["/images/products/cennet/1.png"],
      featured: false,
      inStock: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✓ Created: ${product.name}`);
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
